# preview_canakkale_clean_text sınır önerilerini insan incelemesi için dengeli
# örneklerle ya da tek kaydın sınır pencereleriyle gösterir. Salt okunur:
# dosyaya yazılmaz; hiçbir kayıt onaylanmaz, silinmez, temizlenmez,
# birleştirilmez ya da değiştirilmez. Varsayılan modda gövde satırı basılmaz;
# tek kayıt modunda yalnızca sınır pencerelerindeki satırlar maskeli ve
# kısaltılmış olarak basılır.
import argparse
import hashlib
import math
import os
import re

import inventory_canakkale_content as inventory
import map_canakkale_aday as mapper
import preview_canakkale_archive as preview
import preview_canakkale_clean_text as clean
import quality_canakkale_text as text_quality

ORNEK_NOTU = (
    "Salt okunur örnek incelemesi; hiçbir kayıt onaylanmadı, silinmedi, temizlenmedi "
    "veya değiştirilmedi; metin sınırı tarihsel doğrulama değildir; tüm kayıtlar "
    "insan_incelemesi_gerekli"
)
KAYIT_NOTU = (
    "Salt okunur inceleme; hiçbir kayıt onaylanmadı, silinmedi, temizlenmedi veya "
    "değiştirilmedi; metin sınırı tarihsel doğrulama değildir; kayıt "
    "insan_incelemesi_gerekli"
)
DURUM_NOTU = preview.DURUM_NOTU
ODAK_SINIF = clean.ODAK_SINIF
KATEGORILER = clean.KATEGORILER
GUVENLER = clean.GUVENLER

# Pay dağıtımında artan örnek bu sırayla verilir: tek limitte fazlalık belirsize gider.
GRUP_SIRASI = ("belirsiz", "yuksek", "sinir_bulunamadi")
# metin_uzunlugu (len(text)) katmanları: kisa < KISA_UZUNLUK_SINIRI <= orta < UZUN_UZUNLUK_SINIRI <= uzun.
KISA_UZUNLUK_SINIRI = 2000
UZUN_UZUNLUK_SINIRI = 6000
UZUNLUK_SINIFLARI = ("kisa", "orta", "uzun")
BASLIK_YOK = "yok"
RISK_YOK = "risk_yok"
VARSAYILAN_LIMIT = 20
VARSAYILAN_BAGLAM = 3
EN_FAZLA_BAGLAM = 10
SATIR_GOSTERIM_UZUNLUGU = 200
KIMLIK_KALIBI = re.compile(r"^CC-[0-9a-f]{12}$")
KOMUT_IPUCU = "python review_canakkale_text.py --input <dosya> --id {kimlik}"

ETIKETLER = {
    "korunacak_govde": "[KORUNACAK GÖVDE]",
    "yuksek_guvenli_arayuz": "[YÜKSEK GÜVENLİ ARAYÜZ]",
    "belirsiz_insan_incelemesi": "[BELİRSİZ – İNSAN İNCELEMESİ]",
}
SORULAR = (
    "Üst sınırdan sonra gerçek makale başlıyor mu?",
    "Üst sınırın üstünde makaleye ait bir satır kalmış mı?",
    "Alt sınırdan önce kaynakça ya da son paragraf kesilmiş mi?",
    "Alt sınırdan sonra makaleye ait içerik (kaynakça, dipnot, son paragraf) var mı?",
    "Belirsiz satırlar yorum mu, arayüz mü, içerik mi?",
)
# _kayit_siniri alt bloğu bu risklerden biri varsa belirsiz sayar.
_ALT_BELIRSIZLIK = frozenset(
    ("alt_blokta_uzun_satir", "alt_blokta_korunan_satir", "alt_blok_sablon_azinlikta")
)

SECIM_YONTEMI = (
    "Rastgelelik yok. Her güven grubunda kayıtlar URL'nin sha256 özetine göre sıralanır. "
    "Pay: limit dolu gruplar arasında eşit bölünür; artan örnek "
    f"{' > '.join(GRUP_SIRASI)} sırasıyla verilir; kaydı yetmeyen grubun kalan payı "
    "diğer gruplara aktarılır. Grup içinde iç içe sırayla (round-robin) seçim yapılır: "
    f"önce uzunluk katmanı ({', '.join(UZUNLUK_SINIFLARI)}; metin_uzunlugu < "
    f"{KISA_UZUNLUK_SINIRI} kisa, < {UZUN_UZUNLUK_SINIRI} orta, üstü uzun), sonra alt "
    f"sınırı belirleyen başlık ('{BASLIK_YOK}' dahil), sonra risk bileşimi "
    f"('{RISK_YOK}' dahil); başlık ve risk katmanları büyükten küçüğe, eşitlikte ada göre."
)
OKUMA_YONTEMI = (
    "iki geçiş, ikisi de salt okunur; 1. geçişte yalnızca normalize satır özetleri sayıldı "
    "(preview_canakkale_clean_text ile aynı şablon kuralı), 2. geçişte sınırlar "
    "preview_canakkale_clean_text._kayit_siniri ile hesaplandı; yalnızca seçilen kaydın "
    "satırları bellekte tutuldu"
)
DEGISIM_UYARISI = (
    "Uyarı: dosya iki geçiş arasında değişmiş görünüyor (satır sayısı, sayım ya da "
    "içerik özeti farklı); sonuçlar güvenilir değil, aracı yeniden çalıştırın."
)


def review_samples_jsonl(path, limit=VARSAYILAN_LIMIT) -> dict:
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 1:
        raise ValueError("limit pozitif bir tamsayı olmalı")
    tarama = _tara(_kaynak(path))
    gruplar = {g: [k for k in tarama["kayitlar"] if k["sinir_guveni"] == g] for g in GRUP_SIRASI}
    paylar = _paylar({g: len(kayitlar) for g, kayitlar in gruplar.items()}, limit)

    ornekler = []
    dagilim = {}
    for grup in GRUP_SIRASI:
        secilen = _katmanli_sira(gruplar[grup])[:paylar[grup]]
        ornekler.extend(secilen)
        dagilim[grup] = _grup_dagilimi(gruplar[grup], secilen)
    return {
        **_ozet_alanlari(tarama, ORNEK_NOTU),
        "secim": {"yontem": SECIM_YONTEMI, "limit": limit, "gruplar": dagilim},
        "ornekler": [{"sira": i, **k} for i, k in enumerate(ornekler, start=1)],
    }


def review_record_jsonl(path, url=None, kayit_id=None, baglam=VARSAYILAN_BAGLAM) -> dict:
    if url is not None and kayit_id is not None:
        raise ValueError("--url ve --id birlikte verilemez; yalnızca birini kullanın")
    if url is None and kayit_id is None:
        raise ValueError("Kayıt seçimi için --url ya da --id gerekli")
    if isinstance(baglam, bool) or not isinstance(baglam, int) or not 1 <= baglam <= EN_FAZLA_BAGLAM:
        raise ValueError(f"baglam 1 ile {EN_FAZLA_BAGLAM} arasında bir tamsayı olmalı")
    if url is not None:
        url = url.strip()
        if not url:
            raise ValueError("--url boş olamaz")
        secici, alan, deger = f"url={inventory._maskele(url)}", "url", url
    else:
        kayit_id = kayit_id.strip()
        if not KIMLIK_KALIBI.match(kayit_id):
            raise ValueError("--id CC- ve 12 küçük onaltılık haneden oluşmalı (ör. CC-0123456789ab)")
        secici, alan, deger = f"id={kayit_id}", "id", kayit_id

    tarama = _tara(_kaynak(path), lambda candidate: candidate[alan] == deger)
    secilen = tarama["secilen"]
    if secilen is None:
        ek = " (girdi dosyası boş)" if tarama["ikinci"]["okunan"] == 0 else ""
        raise LookupError(
            f"Kayıt bulunamadı: {secici}{ek}. Kayıt dosyada yok ya da geçerli aday değil "
            "(boş, bozuk, kök sayfa, başlıksız ya da yinelenen URL satırları atlanır)."
        )
    if secilen["sinif"] != ODAK_SINIF:
        raise ValueError(
            f"Seçilen kayıt {ODAK_SINIF} değil (sınıf: {secilen['sinif']}); bu araç yalnızca "
            f"{ODAK_SINIF} kayıtlarının metin sınırlarını gösterir."
        )

    kayit = secilen["kayit"]
    satirlar = secilen["satirlar"]
    _satir_kategorileri(kayit, satirlar)
    pencereler = _pencereler(
        len(satirlar), kayit["ust_sinir_satiri"], kayit["alt_sinir_satiri"], baglam
    )
    gosterim = []
    onceki = 0
    for bas, son in pencereler:
        if bas > onceki + 1:
            gosterim.append({"atlanan": bas - onceki - 1})
        for no in range(bas, son + 1):
            gosterim.append({
                "no": no,
                "kategori": _bolge_kategorisi(kayit["bolgeler"], no),
                "metin": _satir_metni(satirlar[no - 1]),
            })
        onceki = son
    if satirlar and onceki < len(satirlar):
        gosterim.append({"atlanan": len(satirlar) - onceki})
    gosterilen = sum(son - bas + 1 for bas, son in pencereler)
    return {
        **_ozet_alanlari(tarama, KAYIT_NOTU),
        "kayit": kayit,
        "baglam": baglam,
        "pencereler": pencereler,
        "gosterim": gosterim,
        "gosterilen_satir": gosterilen,
        "gosterilmeyen_satir": len(satirlar) - gosterilen,
        "sorular": list(SORULAR),
    }


def _kaynak(path) -> str:
    source = os.fspath(path)
    if not os.path.isfile(source):
        raise FileNotFoundError(f"Girdi dosyası bulunamadı: {source}")
    return source


def _tara(source, hedef=None) -> dict:
    # 1. geçiş clean_text_preview_jsonl'in ilk geçişiyle aynıdır; o fonksiyon şablon
    # kümesini dışa vermediği için aynı sabit ve yardımcılarla yeniden kurulur.
    ilk = text_quality._yeni_sayim()
    satir_df = {}
    makale_metinli = 0
    with open(source, "r", encoding="utf-8") as handle:
        for page, _candidate, sinif in text_quality._adaylar(handle, ilk):
            satirlar = text_quality._satirlar(page.get("text"))
            if sinif == ODAK_SINIF and satirlar:
                makale_metinli += 1
                for ozet in {text_quality._ozet(f) for _, f in satirlar
                             if text_quality._sablona_uygun(f)}:
                    satir_df[ozet] = satir_df.get(ozet, 0) + 1

    esik = max(
        text_quality.SABLON_EN_AZ_KAYIT,
        math.ceil(text_quality.SABLON_EN_AZ_ORAN * makale_metinli),
    )
    etkin = makale_metinli >= text_quality.SABLON_EN_AZ_MAKALE
    sablon = {o for o, n in satir_df.items() if n >= esik} if etkin else set()
    yuksek_esik = max(esik, math.ceil(clean.YUKSEK_SABLON_ORANI * makale_metinli))

    ikinci = text_quality._yeni_sayim()
    kayitlar = []
    secilen = None
    with open(source, "r", encoding="utf-8") as handle:
        for page, candidate, sinif in text_quality._adaylar(handle, ikinci):
            eslesti = hedef is not None and hedef(candidate)
            if eslesti:
                secilen = {"sinif": sinif}
            if sinif != ODAK_SINIF:
                continue
            text = page.get("text")
            sonuc = clean._kayit_siniri(text, satir_df, sablon, yuksek_esik, {}, {}, {})
            satirlar = text_quality._satirlar(text)
            kayit = {
                "kimlik": candidate["id"],
                "url": candidate["url"],
                "baslik": candidate["baslik"],
                **sonuc,
                "alt_sinir_basligi": _alt_sinir_basligi(satirlar, sonuc["alt_sinir_satiri"]),
            }
            kayitlar.append(kayit)
            if eslesti:
                secilen["kayit"] = kayit
                secilen["satirlar"] = [raw for raw, _ in satirlar]

    degisti = (
        ilk["okunan"] != ikinci["okunan"]
        or ilk["aday"] != ikinci["aday"]
        or ilk["atlanan"] != ikinci["atlanan"]
        or ilk["siniflar"] != ikinci["siniflar"]
        or ilk["ozet"].digest() != ikinci["ozet"].digest()
    )
    return {
        "ilk": ilk,
        "ikinci": ikinci,
        "degisti": degisti,
        "sablon": {
            "etkin": etkin,
            "makale_metinli": makale_metinli,
            "esik_kayit": esik,
            "yuksek_esik_kayit": yuksek_esik,
            "satir_sayisi": len(sablon),
        },
        "kayitlar": kayitlar,
        "secilen": secilen,
    }


def _ozet_alanlari(tarama, notu) -> dict:
    ikinci = tarama["ikinci"]
    guven = dict.fromkeys(GUVENLER, 0)
    for kayit in tarama["kayitlar"]:
        guven[kayit["sinir_guveni"]] += 1
    return {
        "not": notu,
        "durum": DURUM_NOTU,
        "okunan": ikinci["okunan"],
        "aday": ikinci["aday"],
        "atlanan": ikinci["atlanan"],
        "hatalar": ikinci["hatalar"],
        "bos_dosya": ikinci["okunan"] == 0,
        "okuma": {
            "gecis": 2,
            "yontem": OKUMA_YONTEMI,
            "dosya_degisti": tarama["degisti"],
            "ilk_gecis_okunan": tarama["ilk"]["okunan"],
        },
        "siniflar": dict(ikinci["siniflar"]),
        "sablon": tarama["sablon"],
        "makale": {"sayi": len(tarama["kayitlar"]), "guven": guven},
    }


def _alt_sinir_basligi(satirlar, alt_sinir_satiri) -> str:
    if alt_sinir_satiri is None:
        return BASLIK_YOK
    katli = satirlar[alt_sinir_satiri - 1][1].rstrip(clean._SON_NOKTALAMA)
    for baslik in clean.ALT_BASLIKLAR:
        if mapper._fold(baslik).rstrip(clean._SON_NOKTALAMA) == katli:
            return baslik
    raise RuntimeError(f"alt sınır satırı {alt_sinir_satiri} bilinen bir başlık değil")


def _satir_kategorileri(kayit, satirlar) -> list:
    # Geri çıkarım yok: kategoriler açık satır listesi ve bölge aralıklarından gelir.
    n = len(satirlar)
    sonuc = kayit.get("satir_kategorileri")
    tutarli = (
        isinstance(sonuc, list)
        and n == kayit["toplam_satir"]
        and len(sonuc) == n
        and all(k in KATEGORILER for k in sonuc)
    )
    if tutarli:
        for ad in KATEGORILER:
            idx = [i for i, k in enumerate(sonuc) if k == ad]
            beklenen = kayit["kategoriler"][ad]
            if len(idx) != beklenen["satir"] or sum(len(satirlar[i]) for i in idx) != beklenen["karakter"]:
                tutarli = False
                break
    if tutarli and _kategoriler_bolgelerden(kayit.get("bolgeler"), n) != sonuc:
        tutarli = False
    if not tutarli:
        raise RuntimeError(
            "satır kategorileri sınır sonucuyla tutarlı değil; dosya değişmiş olabilir, "
            "aracı yeniden çalıştırın"
        )
    return sonuc


def _kategoriler_bolgelerden(bolgeler, n):
    if not isinstance(bolgeler, list):
        return None
    kat = []
    beklenen = 1
    for item in bolgeler:
        if not (isinstance(item, (list, tuple)) and len(item) == 3):
            return None
        bas, son, ad = item
        if ad not in KATEGORILER or not isinstance(bas, int) or not isinstance(son, int):
            return None
        if bas != beklenen or son < bas or son > n:
            return None
        kat.extend([ad] * (son - bas + 1))
        beklenen = son + 1
    if beklenen != n + 1:
        return None
    return kat


def _bolge_kategorisi(bolgeler, no) -> str:
    for bas, son, ad in bolgeler:
        if bas <= no <= son:
            return ad
    raise RuntimeError(
        "satır kategorileri sınır sonucuyla tutarlı değil; dosya değişmiş olabilir, "
        "aracı yeniden çalıştırın"
    )


def _pencereler(n, ust, alt, baglam) -> list:
    araliklar = [(1, baglam), (n - baglam + 1, n)]
    for sinir in (ust, alt):
        if sinir:
            araliklar.append((sinir - baglam, sinir + baglam))
    birlesik = []
    for bas, son in sorted((max(1, b), min(n, s)) for b, s in araliklar):
        if bas > son:
            continue
        if birlesik and bas <= birlesik[-1][1] + 1:
            birlesik[-1] = (birlesik[-1][0], max(birlesik[-1][1], son))
        else:
            birlesik.append((bas, son))
    return birlesik


def _satir_metni(raw) -> str:
    masked = inventory._maskele(raw)
    if len(masked) <= SATIR_GOSTERIM_UZUNLUGU:
        return masked
    return (
        masked[:SATIR_GOSTERIM_UZUNLUGU]
        + f"… (+{len(masked) - SATIR_GOSTERIM_UZUNLUGU} karakter)"
    )


def _paylar(sayilar, limit) -> dict:
    pay = dict.fromkeys(GRUP_SIRASI, 0)
    kalan = min(limit, sum(sayilar.values()))
    while kalan:
        acik = [g for g in GRUP_SIRASI if pay[g] < sayilar[g]]
        taban, artik = divmod(kalan, len(acik))
        for i, grup in enumerate(acik):
            ek = min(taban + (1 if i < artik else 0), sayilar[grup] - pay[grup])
            pay[grup] += ek
            kalan -= ek
    return pay


def _uzunluk_sinifi(kayit) -> str:
    if kayit["metin_uzunlugu"] < KISA_UZUNLUK_SINIRI:
        return "kisa"
    if kayit["metin_uzunlugu"] < UZUN_UZUNLUK_SINIRI:
        return "orta"
    return "uzun"


def _risk_bilesimi(kayit) -> str:
    return "+".join(kayit["riskler"]) or RISK_YOK


_KATMANLAR = (_uzunluk_sinifi, lambda kayit: kayit["alt_sinir_basligi"], _risk_bilesimi)


def _sira_anahtari(kayit):
    return hashlib.sha256(kayit["url"].encode("utf-8")).hexdigest(), kayit["url"]


def _katmanli_sira(kayitlar, seviye=0) -> list:
    if seviye == len(_KATMANLAR):
        return sorted(kayitlar, key=_sira_anahtari)
    katmanlar = {}
    for kayit in kayitlar:
        katmanlar.setdefault(_KATMANLAR[seviye](kayit), []).append(kayit)
    if seviye == 0:
        anahtarlar = [a for a in UZUNLUK_SINIFLARI if a in katmanlar]
    else:
        anahtarlar = sorted(katmanlar, key=lambda a: (-len(katmanlar[a]), a))
    listeler = [_katmanli_sira(katmanlar[a], seviye + 1) for a in anahtarlar]
    sira = []
    for i in range(max((len(liste) for liste in listeler), default=0)):
        sira.extend(liste[i] for liste in listeler if i < len(liste))
    return sira


def _grup_dagilimi(kayitlar, secilen) -> dict:
    def say(anahtar, sira=None):
        sayim = {}
        for kume, alan in ((kayitlar, "toplam"), (secilen, "secilen")):
            for kayit in kume:
                for deger in anahtar(kayit):
                    sayim.setdefault(deger, {"toplam": 0, "secilen": 0})[alan] += 1
        if sira is None:
            sira = sorted(sayim, key=lambda a: (-sayim[a]["toplam"], a))
        return {a: sayim[a] for a in sira if a in sayim}

    return {
        "toplam": len(kayitlar),
        "secilen": len(secilen),
        "uzunluk": say(lambda k: [_uzunluk_sinifi(k)], UZUNLUK_SINIFLARI),
        "basliklar": say(lambda k: [k["alt_sinir_basligi"]]),
        "riskler": say(lambda k: k["riskler"] or [RISK_YOK], (*clean.RISKLER, RISK_YOK)),
    }


def _govde_araligi(kayit) -> str:
    kat = kayit.get("satir_kategorileri") or []
    araliklar = []
    i = 0
    n = len(kat)
    while i < n:
        if kat[i] != "korunacak_govde":
            i += 1
            continue
        j = i + 1
        while j < n and kat[j] == "korunacak_govde":
            j += 1
        bas, son = i + 1, j
        araliklar.append(f"{bas}" if bas == son else f"{bas}–{son}")
        i = j
    if not araliklar:
        return "yok (korunacak gövde satırı yok)"
    return "satır " + ", ".join(araliklar)


def _dagilim_metni(sayim) -> str:
    return ", ".join(f"{ad} {n['secilen']}/{n['toplam']}" for ad, n in sayim.items()) or "-"


def _okuma_satirlari(report) -> list:
    lines = [f"Okuma: {report['okuma']['yontem']}."]
    if report["okuma"]["dosya_degisti"]:
        lines.append(DEGISIM_UYARISI)
        lines.append(
            f"  1. geçiş okunan satır: {report['okuma']['ilk_gecis_okunan']}; "
            f"2. geçiş okunan satır: {report['okunan']}"
        )
    atlanan = ", ".join(f"{ad} {n}" for ad, n in report["atlanan"].items() if n) or "yok"
    lines.append(
        f"Okunan satır: {report['okunan']}; geçerli aday: {report['aday']}; "
        f"{ODAK_SINIF}: {report['makale']['sayi']}; atlanan: {atlanan}"
    )
    if report["bos_dosya"]:
        lines.append("Uyarı: girdi dosyası boş; tüm sayımlar sıfır.")
    if not report["sablon"]["etkin"]:
        lines.append(
            f"Şablon kuralı çalışmadı: metinli makale {report['sablon']['makale_metinli']} < "
            f"{text_quality.SABLON_EN_AZ_MAKALE}; hiçbir sınır üretilmedi."
        )
    return lines


def _hata_satirlari(report) -> list:
    if not report["hatalar"]:
        return []
    return ["Hatalar:", *(f"  {item}" for item in report["hatalar"])]


def _kayit_satirlari(kayit, girinti) -> list:
    kat = kayit["kategoriler"]
    lines = [
        f"url: {inventory._maskele(kayit['url'])}",
        f"baslik: {inventory._maskele(kayit['baslik'])!r}",
        f"toplam: {kayit['toplam_satir']} satır / {kayit['toplam_karakter']} karakter; "
        f"uzunluk katmanı: {_uzunluk_sinifi(kayit)}",
        f"önerilen gövde aralığı: {_govde_araligi(kayit)}",
        f"ust_sinir_satiri: {kayit['ust_sinir_satiri'] or '-'}; "
        f"alt_sinir_satiri: {kayit['alt_sinir_satiri'] or '-'}; "
        f"alt sınır başlığı: {kayit['alt_sinir_basligi']}",
        *([f"ust_neden: {kayit['ust_neden']}"] if kayit.get("ust_neden") else []),
        *([f"alt_on_bolge: {', '.join(kayit['alt_on_bolge'])}"] if kayit.get("alt_on_bolge") else []),
        f"sinir_guveni: {kayit['sinir_guveni']}",
        f"riskler: {', '.join(kayit['riskler']) or '-'}",
        *(f"{ad}: {kat[ad]['satir']} satır / {kat[ad]['karakter']} karakter" for ad in KATEGORILER),
    ]
    return [girinti + line for line in lines]


def format_samples(report) -> str:
    lines = [
        report["not"],
        "Rapor yalnızca ekrana basıldı; dosyaya yazılmadı; gövde satırı basılmadı; "
        "satır numaraları boş olmayan satır sırasıdır.",
        *_okuma_satirlari(report),
        "Sınır güveni: " + ", ".join(f"{g} {report['makale']['guven'][g]}" for g in GUVENLER),
        f"Seçim yöntemi: {report['secim']['yontem']}",
        f"Katman dağılımı (seçilen/toplam; limit {report['secim']['limit']}):",
    ]
    for grup in GRUP_SIRASI:
        dagilim = report["secim"]["gruplar"][grup]
        lines.append(f"  {grup}: toplam {dagilim['toplam']}, seçilen {dagilim['secilen']}")
        if not dagilim["toplam"]:
            continue
        lines.append(f"    uzunluk: {_dagilim_metni(dagilim['uzunluk'])}")
        lines.append(f"    alt sınır başlığı: {_dagilim_metni(dagilim['basliklar'])}")
        lines.append(f"    riskler: {_dagilim_metni(dagilim['riskler'])}")

    lines.append("")
    lines.append(f"Örnekler ({len(report['ornekler'])}; durum: {report['durum']}):")
    if not report["ornekler"]:
        lines.append("  örnek yok")
    for ornek in report["ornekler"]:
        lines.append(f"  {ornek['sira']}. {ornek['kimlik']} [{ornek['sinir_guveni']}]")
        lines.extend(_kayit_satirlari(ornek, "     "))
        lines.append(f"     incelemek için: {KOMUT_IPUCU.format(kimlik=ornek['kimlik'])}")
    lines.extend(_hata_satirlari(report))
    return "\n".join(lines)


def format_record(report) -> str:
    kayit = report["kayit"]
    baglam = report["baglam"]
    lines = [
        report["not"],
        "Çıktı yalnızca ekrana basıldı; dosyaya yazılmadı; tam metin basılmadı.",
        "İnsanın kontrol etmesi gerekenler (yanıtlar araç tarafından üretilmez):",
        *(f"  - {soru}" for soru in report["sorular"]),
        "Etiketler: " + "; ".join(f"{e} = {ad}" for ad, e in ETIKETLER.items()),
        *_okuma_satirlari(report),
        "",
        f"Kayıt: {kayit['kimlik']} (durum: {report['durum']})",
        *_kayit_satirlari(kayit, "  "),
        "",
        f"Pencereler (bağlam {baglam}, en fazla {EN_FAZLA_BAGLAM}): baştan {baglam} satır; "
        f"üst sınır ±{baglam}; alt sınır ±{baglam}; sondan {baglam} satır. Üst üste binen "
        "pencereler birleştirildi; sınırı olmayan pencere atlandı. Satırlar maskeli; "
        f"{SATIR_GOSTERIM_UZUNLUGU} karakteri aşan satırlar kısaltıldı.",
        f"Gösterilen satır: {report['gosterilen_satir']} / {kayit['toplam_satir']}; "
        f"gösterilmeyen: {report['gosterilmeyen_satir']}",
    ]
    if not report["gosterim"]:
        lines.append("  metin yok")
    for item in report["gosterim"]:
        if "atlanan" in item:
            lines.append(f"       … ({item['atlanan']} satır gösterilmedi)")
        else:
            lines.append(f"  {item['no']:>4} {ETIKETLER[item['kategori']]} {item['metin']}")
    lines.extend(_hata_satirlari(report))
    return "\n".join(lines)


def _baglam(value):
    try:
        number = int(value)
    except (TypeError, ValueError) as exc:
        raise argparse.ArgumentTypeError("baglam pozitif bir tamsayı olmalı") from exc
    if number < 1:
        raise argparse.ArgumentTypeError("baglam pozitif bir tamsayı olmalı")
    if number > EN_FAZLA_BAGLAM:
        raise argparse.ArgumentTypeError(f"baglam en fazla {EN_FAZLA_BAGLAM} olabilir")
    return number


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "olasi_makale metin sınırları için salt okunur insan incelemesi aracı. "
            "Dosyaya yazmaz; hiçbir kaydı onaylamaz, silmez, temizlemez veya değiştirmez."
        )
    )
    parser.add_argument("--input", required=True, help="Okunacak JSONL dosyası")
    parser.add_argument(
        "--limit",
        type=preview._positive_int,
        default=None,
        help=f"Gösterilecek örnek sayısı (varsayılan {VARSAYILAN_LIMIT}); analiz tüm adayları kapsar",
    )
    parser.add_argument("--url", help="Tek kaydı URL ile göster (tam eşleşme)")
    parser.add_argument("--id", dest="kayit_id", help="Tek kaydı CC-xxxxxxxxxxxx kimliğiyle göster")
    parser.add_argument(
        "--baglam",
        type=_baglam,
        default=None,
        help=f"Tek kayıt pencerelerinin satır sayısı (varsayılan {VARSAYILAN_BAGLAM}, "
        f"en fazla {EN_FAZLA_BAGLAM})",
    )
    args = parser.parse_args(argv)
    tek = args.url is not None or args.kayit_id is not None
    if args.url is not None and args.kayit_id is not None:
        parser.error("--url ve --id birlikte verilemez; yalnızca birini kullanın")
    if tek and args.limit is not None:
        parser.error("--limit yalnızca örnekleme modunda kullanılır; --url/--id ile verilemez")
    if not tek and args.baglam is not None:
        parser.error("--baglam yalnızca --url ya da --id ile kullanılır")
    try:
        if tek:
            report = review_record_jsonl(
                args.input,
                url=args.url,
                kayit_id=args.kayit_id,
                baglam=args.baglam or VARSAYILAN_BAGLAM,
            )
            print(format_record(report))
        else:
            report = review_samples_jsonl(args.input, limit=args.limit or VARSAYILAN_LIMIT)
            print(format_samples(report))
    except (FileNotFoundError, LookupError, ValueError) as exc:
        raise SystemExit(str(exc)) from exc
    return report


if __name__ == "__main__":
    main()
