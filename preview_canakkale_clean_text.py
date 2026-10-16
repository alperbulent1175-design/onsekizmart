# JSONL arşivindeki olasi_makale adaylarının text alanında arayüz blokları için
# başlangıç ve bitiş sınırı önerir; tekil satır silmez. Salt okunur: dosyaya
# yazılmaz, temizlenmiş metin üretilmez, kayıt değiştirilmez, durum
# yükseltilmez. Gövde metni basılmaz; yalnızca satır ve karakter sayıları ile
# şablon satırlarının kısaltılmış, maskeli hâli gösterilir.
import argparse
import math
import os
import re

import inventory_canakkale_content as inventory
import map_canakkale_aday as mapper
import preview_canakkale_archive as preview
import quality_canakkale_archive as quality
import quality_canakkale_text as text_quality

BASLIK_NOTU = (
    "Salt okunur temizleme önizlemesi; hiçbir metin değiştirilmedi veya yazılmadı; "
    "metin temizliği tarihsel doğrulama değildir; tüm kayıtlar insan_incelemesi_gerekli"
)
DURUM_NOTU = preview.DURUM_NOTU
ODAK_SINIF = text_quality.ODAK_SINIF
SINIF_SIRASI = text_quality.SINIF_SIRASI
KISA_METIN_ESIGI = text_quality.KISA_METIN_ESIGI

# Üst bloğun her satırı makalelerin en az bu oranında geçmeli.
YUKSEK_SABLON_ORANI = 0.5
# Kesintisiz üst bloktan sonra en fazla bu kadar şablon dışı satır atlanarak
# kısa şablon satırı aranır; bulunursa sınır belirsiz sayılır.
ARA_PENCERE = 2
UST_BOLUM_ORANI = 0.4
# Alt blok başlığı boş olmayan satırların son ALT_BOLUM_ORANI kısmında olmalı.
ALT_BOLUM_ORANI = 0.4
# Alt bloktaki satırların en az bu oranı şablon satırı olmalı.
ALT_SABLON_COGUNLUK = 0.5
KISA_SATIR_ESIGI = 40
UZUN_SATIR_ESIGI = 120
GOSTERIM_SAYISI = text_quality.SABLON_GOSTERIM_SAYISI

ALT_BASLIKLAR = (
    "BİR YORUM YAZIN",
    "Bir yanıt yazın",
    "BENZER KONULAR",
    "Benzer yazılar",
    "İlgili yazılar",
    "Henüz yorum yapılmamış.",
    "Tweetle",
    "Paylaş",
    "Bunu paylaş:",
)
_SON_NOKTALAMA = " .:!"
_KATLI_ALT_BASLIKLAR = frozenset(
    mapper._fold(baslik).rstrip(_SON_NOKTALAMA) for baslik in ALT_BASLIKLAR
)

_AYLAR = (
    "ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik"
)
# Katlanmış satır üzerinde aranır; bloğa düşen eşleşme sınırı belirsiz yapar.
KORUNAN_KALIPLAR = {
    "gun_ay": re.compile(rf"\b\d{{1,2}}\s+({_AYLAR})\b"),
    "ay_yil": re.compile(rf"\b({_AYLAR})\s+\d{{4}}\b"),
    "sayisal": re.compile(r"\b\d{1,2}[./]\d{1,2}[./]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b"),
    "kaynak_notu": re.compile(r"\b(kaynak\w*|dipnot\w*|atase|arsiv\w*)\b"),
}
KORUNAN_ACIKLAMA = (
    "gün ay [yıl] ('gg Mart yyyy' gibi), ay yıl, sayısal (gg.aa.yyyy, yyyy-aa-gg); "
    "'Kaynak:', 'Kaynaklar', 'Kaynakça', 'Dipnot', 'ATASE', 'Arşiv'"
)

KATEGORILER = ("yuksek_guvenli_arayuz", "belirsiz_insan_incelemesi", "korunacak_govde")
GUVENLER = ("yuksek", "belirsiz", "sinir_bulunamadi")
ONERI_VAR = "ileride otomatik temizleme düşünülebilir"
ONERI_YOK = "otomatik temizleme önerilmez"
RISKLER = (
    "metin_yok",
    "kisa_metin",
    "kisa_govde",
    "ust_blok_kesintili",
    "ust_blok_dusuk_oran",
    "ust_blokta_korunan_satir",
    "ust_blokta_uzun_satir",
    "alt_blokta_korunan_satir",
    "alt_blokta_uzun_satir",
    "alt_blok_sablon_azinlikta",
    "tekrarlanan_uzun_satir_korundu",
)
BELIRSIZLIK_RISKLERI = frozenset(r for r in RISKLER if r.startswith(("ust_", "alt_")))
OKUMA_YONTEMI = (
    "iki geçiş, ikisi de salt okunur; 1. geçişte yalnızca normalize satır özetleri "
    "(8 baytlık blake2b) sayıldı, 2. geçişte sınırlar hesaplandı; gövde saklanmadı"
)
DEGISIM_UYARISI = (
    "Uyarı: dosya iki geçiş arasında değişmiş görünüyor (satır sayısı, sayım ya da "
    "içerik özeti farklı); sınırlar güvenilir değil, aracı yeniden çalıştırın."
)


def clean_text_preview_jsonl(path, limit=20) -> dict:
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 1:
        raise ValueError("limit pozitif bir tamsayı olmalı")
    source = os.fspath(path)
    if not os.path.isfile(source):
        raise FileNotFoundError(f"Girdi dosyası bulunamadı: {source}")

    # Şablon kuralı quality_canakkale_text ile aynıdır (aynı sabitler ve yardımcılar).
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
    yuksek_esik = max(esik, math.ceil(YUKSEK_SABLON_ORANI * makale_metinli))

    ikinci = text_quality._yeni_sayim()
    guvenler = dict.fromkeys(GUVENLER, 0)
    riskler = dict.fromkeys(RISKLER, 0)
    oneri = 0
    paylar = {"govde": [], "arayuz": [], "belirsiz": []}
    ust_satirlari = {}
    alt_basliklari = {}
    gosterim = {}
    ornekler = []
    with open(source, "r", encoding="utf-8") as handle:
        for page, candidate, sinif in text_quality._adaylar(handle, ikinci):
            if sinif != ODAK_SINIF:
                continue
            kayit = _kayit_siniri(page.get("text"), satir_df, sablon, yuksek_esik,
                                  ust_satirlari, alt_basliklari, gosterim)
            guvenler[kayit["sinir_guveni"]] += 1
            for risk in kayit["riskler"]:
                riskler[risk] += 1
            if kayit["oneri"] == ONERI_VAR:
                oneri += 1
            if kayit["toplam_karakter"]:
                toplam = kayit["toplam_karakter"]
                kat = kayit["kategoriler"]
                paylar["govde"].append(kat["korunacak_govde"]["karakter"] / toplam)
                paylar["arayuz"].append(kat["yuksek_guvenli_arayuz"]["karakter"] / toplam)
                paylar["belirsiz"].append(kat["belirsiz_insan_incelemesi"]["karakter"] / toplam)
            if len(ornekler) < limit:
                ornekler.append({"url": candidate["url"], "baslik": candidate["baslik"], **kayit})

    degisti = (
        ilk["okunan"] != ikinci["okunan"]
        or ilk["aday"] != ikinci["aday"]
        or ilk["atlanan"] != ikinci["atlanan"]
        or ilk["siniflar"] != ikinci["siniflar"]
        or ilk["ozet"].digest() != ikinci["ozet"].digest()
    )
    return {
        "not": BASLIK_NOTU,
        "okunan": ikinci["okunan"],
        "aday": ikinci["aday"],
        "atlanan": ikinci["atlanan"],
        "hatalar": ikinci["hatalar"],
        "bos_dosya": ikinci["okunan"] == 0,
        "okuma": {
            "gecis": 2,
            "yontem": OKUMA_YONTEMI,
            "dosya_degisti": degisti,
            "ilk_gecis_okunan": ilk["okunan"],
        },
        "siniflar": dict(ikinci["siniflar"]),
        "kapsam_disi": sum(n for ad, n in ikinci["siniflar"].items() if ad != ODAK_SINIF),
        "sablon": {
            "etkin": etkin,
            "makale_metinli": makale_metinli,
            "esik_kayit": esik,
            "yuksek_esik_kayit": yuksek_esik,
            "satir_sayisi": len(sablon),
        },
        "makale": {
            "sayi": ikinci["siniflar"][ODAK_SINIF],
            "guven": guvenler,
            "oneri_dusunulebilir": oneri,
            "oneri_yok": ikinci["siniflar"][ODAK_SINIF] - oneri,
            "riskler": riskler,
            "govde_payi": text_quality._dagilim(paylar["govde"]),
            "arayuz_payi": text_quality._dagilim(paylar["arayuz"]),
            "belirsiz_payi": text_quality._dagilim(paylar["belirsiz"]),
            "ust_blok_satirlari": _en_sik(ust_satirlari, gosterim),
            "alt_sinir_basliklari": _en_sik(alt_basliklari, gosterim),
            "ornekler": ornekler,
        },
    }


def _kayit_siniri(text, satir_df, sablon, yuksek_esik, ust_satirlari, alt_basliklari, gosterim):
    satirlar = text_quality._satirlar(text)
    n = len(satirlar)
    ozetler = [text_quality._ozet(f) for _, f in satirlar]
    sab = [o in sablon for o in ozetler]
    korunan = [_korunan_mi(f) for _, f in satirlar]
    riskler = set()

    run = 0
    while run < n and sab[run]:
        run += 1
    ust_son = run
    if run:
        bosluk = 0
        for i in range(run, min(n, math.ceil(n * UST_BOLUM_ORANI))):
            if sab[i] and len(satirlar[i][0]) <= KISA_SATIR_ESIGI:
                ust_son = i + 1
                bosluk = 0
            else:
                bosluk += 1
                if bosluk > ARA_PENCERE:
                    break
    ust_yuksek = run
    if run:
        if ust_son > run:
            riskler.add("ust_blok_kesintili")
        if any(satir_df.get(ozetler[i], 0) < yuksek_esik for i in range(run)):
            riskler.add("ust_blok_dusuk_oran")
        if any(korunan[:ust_son]):
            riskler.add("ust_blokta_korunan_satir")
        if any(len(raw) > UZUN_SATIR_ESIGI for raw, _ in satirlar[:ust_son]):
            riskler.add("ust_blokta_uzun_satir")
        if riskler - {"ust_blok_kesintili"}:
            ust_yuksek = 0
        for i in range(ust_son):
            if sab[i] and not korunan[i]:
                _say(ust_satirlari, gosterim, ozetler[i], satirlar[i][0])

    alt_bas = None
    alt_alani = n * (1 - ALT_BOLUM_ORANI)
    for i in range(ust_son, n):
        if i >= alt_alani and sab[i] and _alt_basligi_mi(satirlar[i][1]):
            alt_bas = i
            break
    alt_uzun = 0
    alt_yuksek = False
    if alt_bas is not None:
        _say(alt_basliklari, gosterim, ozetler[alt_bas], satirlar[alt_bas][0])
        blok = range(alt_bas, n)
        alt_uzun = sum(
            1 for i in blok if not sab[i] and len(satirlar[i][0]) > KISA_SATIR_ESIGI
        )
        if alt_uzun:
            riskler.add("alt_blokta_uzun_satir")
        if any(korunan[i] for i in blok):
            riskler.add("alt_blokta_korunan_satir")
        if sum(sab[i] for i in blok) / len(blok) < ALT_SABLON_COGUNLUK:
            riskler.add("alt_blok_sablon_azinlikta")
        alt_yuksek = not riskler & {
            "alt_blokta_uzun_satir", "alt_blokta_korunan_satir", "alt_blok_sablon_azinlikta"
        }

    govde_son = n if alt_bas is None else alt_bas
    alt = range(govde_son, n)
    bolumler = {
        "yuksek_guvenli_arayuz": [*range(ust_yuksek), *(alt if alt_yuksek else ())],
        "belirsiz_insan_incelemesi": [*range(ust_yuksek, ust_son), *(() if alt_yuksek else alt)],
        "korunacak_govde": list(range(ust_son, govde_son)),
    }
    kategoriler = {
        ad: {"satir": len(idx), "karakter": sum(len(satirlar[i][0]) for i in idx)}
        for ad, idx in bolumler.items()
    }
    tekrarlanan = sum(
        1 for i in bolumler["korunacak_govde"]
        if len(satirlar[i][0]) > UZUN_SATIR_ESIGI
        and satir_df.get(ozetler[i], 0) >= text_quality.SABLON_EN_AZ_KAYIT
    )
    if tekrarlanan:
        riskler.add("tekrarlanan_uzun_satir_korundu")

    if kategoriler["belirsiz_insan_incelemesi"]["satir"]:
        guven = "belirsiz"
    elif kategoriler["yuksek_guvenli_arayuz"]["satir"]:
        guven = "yuksek"
    else:
        guven = "sinir_bulunamadi"
    uzunluk = len(text) if isinstance(text, str) else 0
    if not n:
        riskler.add("metin_yok")
    elif uzunluk < KISA_METIN_ESIGI:
        riskler.add("kisa_metin")
    if guven != "sinir_bulunamadi" and kategoriler["korunacak_govde"]["karakter"] < KISA_METIN_ESIGI:
        riskler.add("kisa_govde")
    uygun = guven == "yuksek" and not riskler & {"kisa_metin", "kisa_govde", "metin_yok"}

    return {
        "metin_uzunlugu": uzunluk,
        "toplam_satir": n,
        "toplam_karakter": sum(len(raw) for raw, _ in satirlar),
        "kategoriler": kategoriler,
        "ust_sinir_satiri": ust_son or None,
        "alt_sinir_satiri": None if alt_bas is None else alt_bas + 1,
        "sinir_guveni": guven,
        "alt_blok_uzun_satir": alt_uzun,
        "tekrarlanan_uzun_satir_korundu": tekrarlanan,
        "riskler": [r for r in RISKLER if r in riskler],
        "oneri": ONERI_VAR if uygun else ONERI_YOK,
    }


def _korunan_mi(folded) -> bool:
    return any(kalip.search(folded) for kalip in KORUNAN_KALIPLAR.values())


def _alt_basligi_mi(folded) -> bool:
    return folded.rstrip(_SON_NOKTALAMA) in _KATLI_ALT_BASLIKLAR


def _say(sayac, gosterim, ozet, raw):
    sayac[ozet] = sayac.get(ozet, 0) + 1
    if ozet not in gosterim:
        gosterim[ozet] = text_quality._kisalt(raw)


def _en_sik(sayac, gosterim) -> list:
    sirali = sorted(sayac.items(), key=lambda item: (-item[1], gosterim[item[0]]))
    return [{"satir": gosterim[o], "kayit": n} for o, n in sirali[:GOSTERIM_SAYISI]]


def _kategori_metni(kategori) -> str:
    return f"{kategori['satir']} satır / {kategori['karakter']} karakter"


def _pay_metni(dagilim) -> str:
    return text_quality._yuzde(dagilim["medyan"])


def format_report(report) -> str:
    lines = [
        BASLIK_NOTU,
        "Rapor yalnızca ekrana basıldı; dosyaya yazılmadı, temizlenmiş metin üretilmedi, "
        "hiçbir kayıt silinmedi veya değiştirilmedi.",
        "Sınırlar çıkarım riskine dair öneridir (scraper metnine menü, paylaşım ya da yorum "
        "girmiş olabilir); tarihsel hata ya da doğrulama değildir.",
        f"Okuma: {report['okuma']['yontem']}.",
    ]
    if report["okuma"]["dosya_degisti"]:
        lines.append(DEGISIM_UYARISI)
        lines.append(
            f"  1. geçiş okunan satır: {report['okuma']['ilk_gecis_okunan']}; "
            f"2. geçiş okunan satır: {report['okunan']}"
        )
    lines += [
        f"Okunan satır: {report['okunan']}",
        f"Geçerli aday: {report['aday']}",
        "Atlanan:",
    ]
    for neden in preview.ATLANAN_NEDENLER:
        lines.append(f"  {neden}: {report['atlanan'][neden]}")
    if report["bos_dosya"]:
        lines.append("Uyarı: girdi dosyası boş; tüm sayımlar sıfır.")
    lines.append(f"Sınıflar: {quality.URL_YAPISI_ACIKLAMA}")
    for ad in SINIF_SIRASI:
        lines.append(f"  {ad}: {report['siniflar'][ad]}")
    lines.append(f"Kapsam dışı (yalnızca sayı; {ODAK_SINIF} dışındaki sınıflar): {report['kapsam_disi']}")

    sablon = report["sablon"]
    lines.append(
        "Şablon satırı kuralı (quality_canakkale_text ile aynı): metni olan makale adaylarının "
        f"en az %{text_quality.SABLON_EN_AZ_ORAN * 100:.0f}'sinde ve en az "
        f"{text_quality.SABLON_EN_AZ_KAYIT} kayıtta geçen normalize satır; en az "
        f"{text_quality.SABLON_EN_AZ_MAKALE} metinli makale yoksa kural çalışmaz."
    )
    if sablon["etkin"]:
        lines.append(
            f"  Metinli makale {sablon['makale_metinli']}; şablon eşiği {sablon['esik_kayit']} kayıt; "
            f"yüksek oran eşiği {sablon['yuksek_esik_kayit']} kayıt "
            f"(%{YUKSEK_SABLON_ORANI * 100:.0f}); şablon satırı {sablon['satir_sayisi']}"
        )
    else:
        lines.append(
            f"  Kural çalışmadı: metinli makale {sablon['makale_metinli']} < "
            f"{text_quality.SABLON_EN_AZ_MAKALE}; hiçbir sınır üretilmedi."
        )
    lines += [
        "Sınır kuralları:",
        "  Üst blok: metnin başından kesintisiz şablon satırları; her satır yüksek oran "
        "eşiğinde olmalı. Sonrasında en fazla "
        f"{ARA_PENCERE} şablon dışı satır atlanarak kısa şablon satırı bulunursa (ilk "
        f"%{UST_BOLUM_ORANI * 100:.0f} içinde) blok kesintili ve o kısım belirsiz sayılır.",
        "  Alt blok: aşağıdaki başlıklardan biri tam satır (Türkçe katlama) olarak, şablon "
        f"satırı olarak ve son %{ALT_BOLUM_ORANI * 100:.0f} içinde ilk göründüğü yerden sona "
        f"kadar. Blokta en az %{ALT_SABLON_COGUNLUK * 100:.0f} şablon satırı olmalı ve "
        f"{KISA_SATIR_ESIGI} karakteri aşan şablon dışı satır olmamalı; yoksa belirsiz.",
        f"  Alt blok başlıkları: {', '.join(repr(b) for b in ALT_BASLIKLAR)}",
        f"  Korunacak kalıplar (bloğa düşerse blok belirsiz olur): {KORUNAN_ACIKLAMA}",
        "  'admin', 'Anasayfa', sayı, kişi adı gibi genel satırlar tek başına sınır belirlemez; "
        "iki blok arasındaki her satır korunacak gövdedir.",
        f"  {UZUN_SATIR_ESIGI} karakteri aşan ve birden çok makalede geçen gövde satırları "
        "korunur ve tekrarlanan_uzun_satir_korundu olarak sayılır.",
    ]

    makale = report["makale"]
    toplam = makale["sayi"]
    lines.append("")
    lines.append(f"== {ODAK_SINIF}: {toplam} kayıt ==")
    lines.append("  Sınır güveni:")
    for ad in GUVENLER:
        lines.append(f"    {ad}: {makale['guven'][ad]}")
    lines.append(f"  İleride otomatik temizleme düşünülebilir: {makale['oneri_dusunulebilir']}")
    lines.append(f"  Otomatik temizleme önerilmez: {makale['oneri_yok']}")
    lines.append("  Riskler (kayıt sayısı):")
    for ad in RISKLER:
        lines.append(f"    {ad}: {makale['riskler'][ad]}")
    lines.append(
        "  Karakter payı ortancası (metinli kayıtlarda): "
        f"korunacak_govde {_pay_metni(makale['govde_payi'])}, "
        f"yuksek_guvenli_arayuz {_pay_metni(makale['arayuz_payi'])}, "
        f"belirsiz_insan_incelemesi {_pay_metni(makale['belirsiz_payi'])}"
    )
    for anahtar, baslik in (
        ("alt_sinir_basliklari", "Alt sınırı belirleyen başlıklar"),
        ("ust_blok_satirlari", "En sık üst blok satırları"),
    ):
        lines.append(
            f"  {baslik} (yalnızca şablon satırları; ilk "
            f"{text_quality.SABLON_GOSTERIM_UZUNLUGU} karakter, maskeli):"
        )
        if not makale[anahtar]:
            lines.append("    yok")
        for satir in makale[anahtar]:
            lines.append(f"    {satir['kayit']} kayıt: {satir['satir']!r}")

    lines.append(
        f"  Örnekler ({len(makale['ornekler'])}; durum: {DURUM_NOTU}; gövde basılmadı; "
        "satır numaraları boş olmayan satır sırasıdır):"
    )
    if not makale["ornekler"]:
        lines.append("    örnek yok")
    for index, ornek in enumerate(makale["ornekler"], start=1):
        kat = ornek["kategoriler"]
        lines.append(f"    {index}. {inventory._maskele(ornek['url'])}")
        lines.append(f"       baslik: {inventory._maskele(ornek['baslik'])!r}")
        lines.append(
            f"       toplam: {ornek['toplam_satir']} satır / {ornek['toplam_karakter']} karakter"
        )
        for ad in KATEGORILER:
            lines.append(f"       {ad}: {_kategori_metni(kat[ad])}")
        lines.append(
            f"       ust_sinir_satiri: {ornek['ust_sinir_satiri'] or '-'}; "
            f"alt_sinir_satiri: {ornek['alt_sinir_satiri'] or '-'}; "
            f"sinir_guveni: {ornek['sinir_guveni']}"
        )
        lines.append(
            f"       alt_blok_uzun_satir: {ornek['alt_blok_uzun_satir']}; "
            f"tekrarlanan_uzun_satir_korundu: {ornek['tekrarlanan_uzun_satir_korundu']}"
        )
        lines.append(f"       riskler: {', '.join(ornek['riskler']) or '-'}")
        lines.append(f"       öneri: {ornek['oneri']}")

    if report["hatalar"]:
        lines.append("Hatalar:")
        lines.extend(f"  {item}" for item in report["hatalar"])
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "JSONL arşivi için salt okunur metin temizleme sınırı önizlemesi. "
            "Dosyaya yazmaz, temizlenmiş metin üretmez, hiçbir kaydı değiştirmez."
        )
    )
    parser.add_argument("--input", required=True, help="Okunacak JSONL dosyası")
    parser.add_argument(
        "--limit",
        type=preview._positive_int,
        default=20,
        help="Listelenecek en fazla makale örneği (sayım dosyanın tamamını tarar)",
    )
    args = parser.parse_args(argv)
    try:
        report = clean_text_preview_jsonl(args.input, limit=args.limit)
    except FileNotFoundError as exc:
        raise SystemExit(str(exc)) from exc
    print(format_report(report))
    return report


if __name__ == "__main__":
    main()
