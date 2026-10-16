# JSONL arşivindeki geçerli adayların text alanında çıkarım riski işaretlerini
# sayar (menü, altbilgi, yorum, şablon satırı, tekrar eden blok, kısa metin).
# Salt okunur: dosyaya yazılmaz, metin temizlenmez ya da kırpılmaz, kayıt
# silinmez ya da birleştirilmez, durum yükseltilmez. Gövde metni basılmaz ve
# kayıt başına saklanmaz; yalnızca normalize satır özetleri (hash) sayılır.
# İşaretler tarihsel doğruluk hakkında hiçbir şey söylemez.
import argparse
import hashlib
import json
import math
import os
import re
import statistics

import inventory_canakkale_content as inventory
import map_canakkale_aday as mapper
import preview_canakkale_archive as preview
import quality_canakkale_archive as quality

BASLIK_NOTU = (
    "Salt okunur metin kalitesi raporu; içerik/çıkarım kalitesi ölçülür, "
    "tarihsel doğruluk değil; tüm kayıtlar insan_incelemesi_gerekli"
)
DURUM_NOTU = preview.DURUM_NOTU
ODAK_SINIF = "olasi_makale"
SINIF_SIRASI = inventory.SINIF_SIRASI

KISA_METIN_ESIGI = 300
# Şablon satırı: makale adaylarının en az SABLON_EN_AZ_ORAN kadarında ve en az
# SABLON_EN_AZ_KAYIT farklı kayıtta geçen normalize satır. Metni olan makale
# sayısı SABLON_EN_AZ_MAKALE altındaysa kural çalışmaz.
SABLON_EN_AZ_KAYIT = 2
SABLON_EN_AZ_ORAN = 0.20
SABLON_EN_AZ_MAKALE = 5
SABLON_GOSTERIM_SAYISI = 10
SABLON_GOSTERIM_UZUNLUGU = 60
BLOK_SATIR_SAYISI = 3
MENU_PENCERE = 15
MENU_KISA_SATIR = 25
MENU_EN_AZ_KISA = 8
MENU_EN_AZ_DESTEK = 4
ALTBILGI_PENCERE = 10
ALTBILGI_SATIR_SINIRI = 120
YORUM_KISA_SATIR = 40

ISARETLER = (
    "asiri_kisa_metin",
    "yinelenen_sablon_satiri",
    "yinelenen_baslangic",
    "yinelenen_son",
    "olasi_menu",
    "olasi_altbilgi",
    "olasi_yorum",
    "metin_baslik_icermiyor",
)
ISARET_KURALLARI = {
    "asiri_kisa_metin": f"len(text) {KISA_METIN_ESIGI} karakterden kısa (text yoksa 0 sayılır)",
    "yinelenen_sablon_satiri": "metinde en az bir şablon satırı var (şablon kuralı aşağıda)",
    "yinelenen_baslangic": (
        f"ilk {BLOK_SATIR_SAYISI} normalize satırın blok özeti en az 2 geçerli adayda aynı"
    ),
    "yinelenen_son": (
        f"son {BLOK_SATIR_SAYISI} normalize satırın blok özeti en az 2 geçerli adayda aynı"
    ),
    "olasi_menu": (
        f"ilk ya da son {MENU_PENCERE} satırın en az {MENU_EN_AZ_KISA} tanesi "
        f"{MENU_KISA_SATIR} karakterden kısa ve bu kısa satırların en az "
        f"{MENU_EN_AZ_DESTEK} tanesi internal_links metniyle birebir eşleşiyor ya da şablon satırı"
    ),
    "olasi_altbilgi": (
        f"son {ALTBILGI_PENCERE} satırdan {ALTBILGI_SATIR_SINIRI} karakteri aşmayan birinde "
        "©, copyright, 'tüm hakları saklıdır', 'all rights reserved', 'powered by' "
        "ya da 'wordpress' geçiyor"
    ),
    "olasi_yorum": (
        "'yorum yap', 'bir yanıt yazın', 'bir yorum yazın', 'says:', 'dedi ki:' satır "
        f"başında ya da {YORUM_KISA_SATIR} karakteri aşmayan satırda; tek kelimelik "
        "'yorum', 'yorumlar', 'cevapla', 'yanıtla' yalnızca satırın tamamıysa "
        "(önünde sayı olabilir, örn. '3 yorum')"
    ),
    "metin_baslik_icermiyor": "bilgi: normalize başlık katlanmış metinde geçmiyor",
}
OKUMA_YONTEMI = (
    "iki geçiş, ikisi de salt okunur; 1. geçişte yalnızca normalize satır ve "
    "blok özetleri (8 baytlık blake2b) ile sayaçlar tutuldu, 2. geçişte işaretler "
    "hesaplandı; tam gövde metni kayıt başına saklanmadı"
)
DEGISIM_UYARISI = (
    "Uyarı: dosya iki geçiş arasında değişmiş görünüyor (satır sayısı, sayım ya da "
    "içerik özeti farklı); işaretler güvenilir değil, aracı yeniden çalıştırın."
)

_ALTBILGI_KALIPLARI = (
    "©", "copyright", "tum haklari saklidir", "all rights reserved",
    "powered by", "wordpress",
)
_YORUM_IFADELERI = (
    "yorum yap", "bir yanit yazin", "bir yorum yazin", "says:", "dedi ki:",
)
_YORUM_TEK_SATIR = re.compile(
    r"^(\d+\s+)?(yorum|yorumlar|yorum yok|cevapla|yanitla)[\s:.!]*$"
)


def text_quality_jsonl(path, limit=20) -> dict:
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 1:
        raise ValueError("limit pozitif bir tamsayı olmalı")
    source = os.fspath(path)
    if not os.path.isfile(source):
        raise FileNotFoundError(f"Girdi dosyası bulunamadı: {source}")

    ilk = _yeni_sayim()
    satir_df = {}
    bas_df = {}
    son_df = {}
    makale_metinli = 0
    with open(source, "r", encoding="utf-8") as handle:
        for page, candidate, sinif in _adaylar(handle, ilk):
            satirlar = _satirlar(page.get("text"))
            _blok_say(bas_df, son_df, satirlar)
            if sinif == ODAK_SINIF and satirlar:
                makale_metinli += 1
                for ozet in {_ozet(f) for _, f in satirlar if _sablona_uygun(f)}:
                    satir_df[ozet] = satir_df.get(ozet, 0) + 1

    esik = max(SABLON_EN_AZ_KAYIT, math.ceil(SABLON_EN_AZ_ORAN * makale_metinli))
    etkin = makale_metinli >= SABLON_EN_AZ_MAKALE
    sablon = {o: n for o, n in satir_df.items() if n >= esik} if etkin else {}
    del satir_df

    ikinci = _yeni_sayim()
    siniflar = {ad: {"sayi": 0, "isaretler": dict.fromkeys(ISARETLER, 0)} for ad in SINIF_SIRASI}
    metin_yok = 0
    paylar = []
    ornekler = []
    sablon_metni = {}
    with open(source, "r", encoding="utf-8") as handle:
        for page, candidate, sinif in _adaylar(handle, ikinci):
            kayit = _kayit_isaretleri(page, candidate["baslik"], sablon, bas_df, son_df, sablon_metni)
            ozet = siniflar[sinif]
            ozet["sayi"] += 1
            for ad in kayit["isaretler"]:
                ozet["isaretler"][ad] += 1
            if sinif != ODAK_SINIF:
                continue
            if kayit["metin_uzunlugu"] == 0:
                metin_yok += 1
            else:
                paylar.append(kayit["sablon_payi"])
            if kayit["isaretler"] and len(ornekler) < limit:
                ornekler.append({"url": candidate["url"], "baslik": candidate["baslik"], **kayit})

    degisti = (
        ilk["okunan"] != ikinci["okunan"]
        or ilk["aday"] != ikinci["aday"]
        or ilk["atlanan"] != ikinci["atlanan"]
        or ilk["siniflar"] != ikinci["siniflar"]
        or ilk["ozet"].digest() != ikinci["ozet"].digest()
    )
    en_sik = sorted(sablon.items(), key=lambda item: (-item[1], sablon_metni.get(item[0], "")))
    makale = siniflar[ODAK_SINIF]
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
        "sablon": {
            "etkin": etkin,
            "makale_metinli": makale_metinli,
            "esik_kayit": esik,
            "satir_sayisi": len(sablon),
            "en_sik": [
                {"satir": sablon_metni.get(o, ""), "kayit": n}
                for o, n in en_sik[:SABLON_GOSTERIM_SAYISI]
            ],
        },
        "siniflar": siniflar,
        "makale": {
            "sayi": makale["sayi"],
            "isaretler": {
                ad: {"sayi": n, "oran": _oran(n, makale["sayi"])}
                for ad, n in makale["isaretler"].items()
            },
            "metin_yok": metin_yok,
            "sablon_payi": _dagilim(paylar),
            "ornekler": ornekler,
        },
    }


def _yeni_sayim() -> dict:
    return {
        "okunan": 0,
        "aday": 0,
        "atlanan": {neden: 0 for neden in preview.ATLANAN_NEDENLER},
        "hatalar": [],
        "siniflar": {ad: 0 for ad in SINIF_SIRASI},
        "ozet": hashlib.sha256(),
    }


def _adaylar(handle, sayim):
    # Döngü sırası preview_jsonl ile aynıdır; sayımlar birebir eşleşmelidir.
    gorulen = set()
    for satir_no, line in enumerate(handle, start=1):
        sayim["okunan"] += 1
        sayim["ozet"].update(line.encode("utf-8"))
        if not line.strip():
            sayim["atlanan"]["bos_satir"] += 1
            continue
        try:
            page = json.loads(line)
        except json.JSONDecodeError:
            sayim["atlanan"]["bozuk_json"] += 1
            sayim["hatalar"].append(f"satır {satir_no}: bozuk_json")
            continue

        neden = preview._atla_nedeni(page)
        if neden is not None:
            sayim["atlanan"][neden] += 1
            continue
        candidate = mapper.candidate_from_page(page)
        if candidate is None:
            raise RuntimeError(
                f"satır {satir_no}: ön kontrolden geçen satır aday üretmedi"
            )
        url = candidate["url"]
        if url in gorulen:
            sayim["atlanan"]["yinelenen_url"] += 1
            continue
        gorulen.add(url)
        sayim["aday"] += 1
        sinif = quality.url_sinifi(url)
        sayim["siniflar"][sinif] += 1
        yield page, candidate, sinif


def _satirlar(text) -> list:
    # Boş olmayan satırlar (kırpılmış ham, katlanmış) çifti olarak döner.
    # Kayıttaki metin değiştirilmez; bu liste yalnızca o kayıt işlenirken yaşar.
    if not isinstance(text, str):
        return []
    satirlar = []
    for raw in text.split("\n"):
        stripped = raw.strip()
        if stripped:
            satirlar.append((stripped, mapper._fold(stripped)))
    return satirlar


def _ozet(text) -> bytes:
    return hashlib.blake2b(text.encode("utf-8"), digest_size=8).digest()


def _blok_ozetleri(satirlar):
    if not satirlar:
        return None, None
    bas = "\n".join(f for _, f in satirlar[:BLOK_SATIR_SAYISI])
    son = "\n".join(f for _, f in satirlar[-BLOK_SATIR_SAYISI:])
    return _ozet(bas), _ozet(son)


def _blok_say(bas_df, son_df, satirlar):
    bas, son = _blok_ozetleri(satirlar)
    if bas is None:
        return
    bas_df[bas] = bas_df.get(bas, 0) + 1
    son_df[son] = son_df.get(son, 0) + 1


def _sablona_uygun(folded) -> bool:
    return sum(1 for char in folded if char.isalnum()) >= 2


def _kayit_isaretleri(page, baslik, sablon, bas_df, son_df, sablon_metni) -> dict:
    text = page.get("text")
    uzunluk = len(text) if isinstance(text, str) else 0
    satirlar = _satirlar(text)
    isaretler = []
    if uzunluk < KISA_METIN_ESIGI:
        isaretler.append("asiri_kisa_metin")

    sablon_satiri = 0
    sablon_karakter = 0
    for raw, folded in satirlar:
        ozet = _ozet(folded)
        if ozet in sablon:
            sablon_satiri += 1
            sablon_karakter += len(raw)
            if ozet not in sablon_metni:
                sablon_metni[ozet] = _kisalt(raw)
    toplam_karakter = sum(len(raw) for raw, _ in satirlar)
    if sablon_satiri:
        isaretler.append("yinelenen_sablon_satiri")

    bas, son = _blok_ozetleri(satirlar)
    if bas is not None and bas_df.get(bas, 0) >= 2:
        isaretler.append("yinelenen_baslangic")
    if son is not None and son_df.get(son, 0) >= 2:
        isaretler.append("yinelenen_son")
    if _olasi_menu(satirlar, _link_metinleri(page), sablon):
        isaretler.append("olasi_menu")
    if _olasi_altbilgi(satirlar):
        isaretler.append("olasi_altbilgi")
    if any(_yorum_satiri(folded) for _, folded in satirlar):
        isaretler.append("olasi_yorum")
    if uzunluk and mapper._fold(baslik) not in mapper._fold(text):
        isaretler.append("metin_baslik_icermiyor")

    return {
        "metin_uzunlugu": uzunluk,
        "satir_sayisi": len(satirlar),
        "isaretler": isaretler,
        "sablon_satiri": sablon_satiri,
        "sablon_payi": sablon_karakter / toplam_karakter if toplam_karakter else 0.0,
    }


def _link_metinleri(page) -> set:
    links = page.get("internal_links")
    if not isinstance(links, list):
        return set()
    return {
        mapper._fold(link["text"])
        for link in links
        if isinstance(link, dict) and isinstance(link.get("text"), str) and link["text"].strip()
    }


def _olasi_menu(satirlar, link_metinleri, sablon) -> bool:
    for pencere in (satirlar[:MENU_PENCERE], satirlar[-MENU_PENCERE:]):
        kisa = [folded for raw, folded in pencere if len(raw) < MENU_KISA_SATIR]
        if len(kisa) < MENU_EN_AZ_KISA:
            continue
        destek = sum(1 for f in kisa if f in link_metinleri or _ozet(f) in sablon)
        if destek >= MENU_EN_AZ_DESTEK:
            return True
    return False


def _olasi_altbilgi(satirlar) -> bool:
    return any(
        len(raw) <= ALTBILGI_SATIR_SINIRI and any(k in folded for k in _ALTBILGI_KALIPLARI)
        for raw, folded in satirlar[-ALTBILGI_PENCERE:]
    )


def _yorum_satiri(folded) -> bool:
    if _YORUM_TEK_SATIR.match(folded):
        return True
    kisa = len(folded) <= YORUM_KISA_SATIR
    return any(folded.startswith(k) or (kisa and k in folded) for k in _YORUM_IFADELERI)


def _kisalt(raw) -> str:
    masked = inventory._maskele(raw)
    if len(masked) <= SABLON_GOSTERIM_UZUNLUGU:
        return masked
    return masked[:SABLON_GOSTERIM_UZUNLUGU] + "…"


def _oran(sayi, toplam):
    return sayi / toplam if toplam else 0.0


def _dagilim(degerler) -> dict:
    if not degerler:
        return {"min": None, "medyan": None, "max": None}
    return {
        "min": min(degerler),
        "medyan": statistics.median(degerler),
        "max": max(degerler),
    }


def _yuzde(deger) -> str:
    return "-" if deger is None else f"%{deger * 100:.1f}"


def _isaret_metni(sayi, toplam) -> str:
    if not sayi:
        return f"0/{toplam} (işaret yok)"
    return f"{sayi}/{toplam} ({_yuzde(sayi / toplam)})"


def format_report(report) -> str:
    lines = [
        BASLIK_NOTU,
        "Dosyaya yazılmadı; hiçbir metin temizlenmedi, kırpılmadı veya değiştirilmedi; "
        "hiçbir kayıt silinmedi veya birleştirilmedi.",
        "İşaretler çıkarım riskidir (scraper metnine menü, altbilgi ya da yorum girmiş "
        "olabilir); tarihsel hata değildir.",
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
        lines.append(f"  {ad}: {report['siniflar'][ad]['sayi']}")

    sablon = report["sablon"]
    lines.append(
        f"Şablon satırı kuralı: metni olan makale adaylarının en az %{SABLON_EN_AZ_ORAN * 100:.0f}'sinde "
        f"ve en az {SABLON_EN_AZ_KAYIT} farklı kayıtta geçen normalize satır; en az "
        f"{SABLON_EN_AZ_MAKALE} metinli makale yoksa kural çalışmaz."
    )
    if not sablon["etkin"]:
        lines.append(
            f"  Kural çalışmadı: metinli makale {sablon['makale_metinli']} < {SABLON_EN_AZ_MAKALE}."
        )
    else:
        lines.append(
            f"  Metinli makale {sablon['makale_metinli']}; eşik {sablon['esik_kayit']} kayıt; "
            f"şablon satırı {sablon['satir_sayisi']}"
        )
        lines.append(
            f"  En sık şablon satırları (ilk {SABLON_GOSTERIM_UZUNLUGU} karakter, maskeli; "
            "site şablonu, gövde değil):"
        )
        if not sablon["en_sik"]:
            lines.append("    işaret yok")
        for satir in sablon["en_sik"]:
            lines.append(f"    {satir['kayit']} kayıt: {satir['satir']!r}")

    makale = report["makale"]
    toplam = makale["sayi"]
    lines.append("")
    lines.append(f"== {ODAK_SINIF}: {toplam} kayıt (ayrıntılı) ==")
    lines.append("  Çıkarım riski işaretleri (kayıt / oran):")
    for ad in ISARETLER:
        sayi = makale["isaretler"][ad]["sayi"]
        lines.append(f"    {ad}: {_isaret_metni(sayi, toplam)}  ({ISARET_KURALLARI[ad]})")
    lines.append(f"  text alanı boş ya da yok: {makale['metin_yok']}")
    pay = makale["sablon_payi"]
    lines.append(
        "  Şablon satırı karakter payı (metinli kayıtlarda): "
        f"min {_yuzde(pay['min'])}, medyan {_yuzde(pay['medyan'])}, max {_yuzde(pay['max'])}"
    )
    lines.append(
        f"  İşaretli örnekler ({len(makale['ornekler'])}; durum: {DURUM_NOTU}; gövde basılmadı):"
    )
    if not makale["ornekler"]:
        lines.append("    işaret yok")
    for index, ornek in enumerate(makale["ornekler"], start=1):
        lines.append(f"    {index}. {inventory._maskele(ornek['url'])}")
        lines.append(f"       baslik: {inventory._maskele(ornek['baslik'])!r}")
        lines.append(
            f"       metin_uzunlugu: {ornek['metin_uzunlugu']}; satir_sayisi: {ornek['satir_sayisi']}; "
            f"sablon_satiri: {ornek['sablon_satiri']}; sablon_payi: {_yuzde(ornek['sablon_payi'])}"
        )
        lines.append(f"       isaretler: {', '.join(ornek['isaretler'])}")

    for ad in SINIF_SIRASI:
        if ad == ODAK_SINIF:
            continue
        sinif = report["siniflar"][ad]
        lines.append("")
        lines.append(f"== {ad}: {sinif['sayi']} kayıt (yalnızca özet) ==")
        bulunan = [
            f"{isaret}={n}" for isaret, n in sinif["isaretler"].items() if n
        ]
        lines.append("  " + (", ".join(bulunan) if bulunan else "işaret yok"))

    if report["hatalar"]:
        lines.append("Hatalar:")
        lines.extend(f"  {item}" for item in report["hatalar"])
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "JSONL arşivi için salt okunur metin/çıkarım kalitesi raporu. "
            "Dosyaya yazmaz, hiçbir metni ya da kaydı değiştirmez."
        )
    )
    parser.add_argument("--input", required=True, help="Okunacak JSONL dosyası")
    parser.add_argument(
        "--limit",
        type=preview._positive_int,
        default=20,
        help="Listelenecek en fazla işaretli makale örneği (sayım dosyanın tamamını tarar)",
    )
    args = parser.parse_args(argv)
    try:
        report = text_quality_jsonl(args.input, limit=args.limit)
    except FileNotFoundError as exc:
        raise SystemExit(str(exc)) from exc
    print(format_report(report))
    return report


if __name__ == "__main__":
    main()
