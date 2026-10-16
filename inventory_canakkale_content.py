# JSONL arşivindeki geçerli adayların alanlarını ve metin uzunluklarını URL
# sınıfı başına sayar. Salt okunur: dosyaya yazılmaz, kayıt değiştirilmez,
# durum yükseltilmez. Gövde metni ve HTML basılmaz, bellekte biriktirilmez.
import argparse
import json
import os
import re
import statistics

import map_canakkale_aday as mapper
import preview_canakkale_archive as preview
import quality_canakkale_archive as quality

BASLIK_NOTU = (
    "Salt okunur envanter; tarihsel iddia çıkarılmadı; "
    "tüm kayıtlar insan_incelemesi_gerekli"
)
DURUM_NOTU = preview.DURUM_NOTU
SINIF_SIRASI = (
    "olasi_makale",
    "olasi_ek_sayfasi",
    "belirsiz",
    "sorgu_parametreli_url",
)
# scrape_canakkalecephesi.extract() çıktısındaki üst düzey anahtarlar.
BEKLENEN_ANAHTARLAR = (
    "url",
    "canonical_url",
    "title",
    "published_date",
    "fetched_at_utc",
    "headings",
    "text",
    "internal_links",
    "images",
    "text_length",
)
# Scraper ham HTML yazmaz; bu adlar yalnızca gerçekten varsa sayılır.
HTML_ANAHTARLARI = frozenset(("html", "content", "body_html", "raw_html"))
LISTE_ALANLARI = ("headings", "internal_links", "images")
META_ALANLARI = ("canonical_url", "published_date", "fetched_at_utc")
YOK = "yok"

KOVALAR = ("yok/boş", "1-499", "500-1999", "2000-4999", "5000-19999", "20000+")
_KOVA_SINIRLARI = ((500, "1-499"), (2000, "500-1999"), (5000, "2000-4999"),
                   (20000, "5000-19999"))

ON_ETIKET_BASLIGI = "Ön etiketler (otomatik başlık eşleşmesi; doğrulanmadı)"
ON_ETIKET_NOTU = (
    "Etiket yalnızca normalize başlıkta anahtar kelimenin geçtiği kayıt sayısını "
    "gösterir; içeriğin gerçekte o konuda olduğunu kanıtlamaz. Gövde metni okunmaz."
)
# Başlıktaki her sözcüğün başı, katlanmış anahtar kelimeyle karşılaştırılır
# (Türkçe ekler için: "gemisi" -> gemi, "Boğazı" -> boğaz).
ON_ETIKETLER = {
    "deniz": ("gemi", "mayın", "boğaz", "zırhlı", "deniz"),
    "kara": ("alay", "tümen", "kolordu", "cephe", "taarruz", "çıkarma"),
    "kisi_biyografi": ("paşa", "komutan", "hayatı", "biyografi"),
    "yer": ("Arıburnu", "Seddülbahir", "Anafartalar", "Conkbayırı",
            "Kilitbahir", "Kabatepe"),
    "kaynak_belge": ("belge", "arşiv", "evrak", "günlük", "hatırat"),
}
_KATLI_ETIKETLER = {
    ad: tuple(mapper._fold(kelime) for kelime in kelimeler)
    for ad, kelimeler in ON_ETIKETLER.items()
}
_SOZCUK = re.compile(r"\w+")
_EPOSTA = re.compile(r"[\w.+-]+@[\w-]+(\.[\w-]+)+")
_TELEFON_ADAYI = re.compile(r"\+?\d[\d\s().-]{8,}\d")


def inventory_jsonl(path, limit=20) -> dict:
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 1:
        raise ValueError("limit pozitif bir tamsayı olmalı")
    source = os.fspath(path)
    if not os.path.isfile(source):
        raise FileNotFoundError(f"Girdi dosyası bulunamadı: {source}")

    okunan = 0
    aday = 0
    atlanan = {neden: 0 for neden in preview.ATLANAN_NEDENLER}
    hatalar = []
    siniflar = {ad: _bos_sinif() for ad in SINIF_SIRASI}
    gorulen = set()

    # Döngü sırası preview_jsonl ile aynıdır; sayımlar birebir eşleşmelidir.
    with open(source, "r", encoding="utf-8") as handle:
        for satir_no, line in enumerate(handle, start=1):
            okunan += 1
            if not line.strip():
                atlanan["bos_satir"] += 1
                continue
            try:
                page = json.loads(line)
            except json.JSONDecodeError:
                atlanan["bozuk_json"] += 1
                hatalar.append(f"satır {satir_no}: bozuk_json")
                continue

            neden = preview._atla_nedeni(page)
            if neden is not None:
                atlanan[neden] += 1
                continue
            candidate = mapper.candidate_from_page(page)
            if candidate is None:
                raise RuntimeError(
                    f"satır {satir_no}: ön kontrolden geçen satır aday üretmedi"
                )
            url = candidate["url"]
            if url in gorulen:
                atlanan["yinelenen_url"] += 1
                continue
            gorulen.add(url)
            aday += 1

            h1_kaynak = "baslik_kaynagi=h1" in candidate["notlar"]
            _say(siniflar[quality.url_sinifi(url)], page, url,
                 mapper.normalize_title(page), h1_kaynak, limit)

    return {
        "not": BASLIK_NOTU,
        "okunan": okunan,
        "aday": aday,
        "atlanan": atlanan,
        "hatalar": hatalar,
        "bos_dosya": okunan == 0,
        "siniflar": {ad: _sonuc(sinif) for ad, sinif in siniflar.items()},
    }


def _bos_sinif() -> dict:
    return {
        "sayi": 0,
        "anahtarlar": {},
        "baslik": {"title_dolu": 0, "h1_var": 0, "baslik_kaynagi_h1": 0},
        "listeler": {ad: {"liste": 0, "dolu": 0, "toplam": 0} for ad in LISTE_ALANLARI},
        "html_uzunluklari": [],
        "kovalar": {kova: 0 for kova in KOVALAR},
        "uzunluklar": [],
        "text_length": {"var": 0, "uyusan": 0, "uyusmayan": 0, "karsilastirilamadi": 0},
        "etiketler": {ad: 0 for ad in ON_ETIKETLER},
        "etiketsiz": 0,
        "ornekler": [],
    }


def _say(sinif, page, url, baslik, h1_kaynak, limit):
    sinif["sayi"] += 1
    for anahtar, deger in page.items():
        alan = sinif["anahtarlar"].setdefault(anahtar, {"var": 0, "dolu": 0, "tipler": {}})
        alan["var"] += 1
        if _dolu(deger):
            alan["dolu"] += 1
        tip = _json_tipi(deger)
        alan["tipler"][tip] = alan["tipler"].get(tip, 0) + 1
        if _html_anahtari_mi(anahtar) and isinstance(deger, str):
            sinif["html_uzunluklari"].append(len(deger))

    baslik_ozeti = sinif["baslik"]
    if _dolu(page.get("title")) and isinstance(page.get("title"), str):
        baslik_ozeti["title_dolu"] += 1
    if _h1_var(page):
        baslik_ozeti["h1_var"] += 1
    if h1_kaynak:
        baslik_ozeti["baslik_kaynagi_h1"] += 1

    sayilar = {}
    for ad in LISTE_ALANLARI:
        deger = page.get(ad)
        sayilar[ad] = len(deger) if isinstance(deger, list) else 0
        if isinstance(deger, list):
            ozet = sinif["listeler"][ad]
            ozet["liste"] += 1
            ozet["toplam"] += len(deger)
            if deger:
                ozet["dolu"] += 1

    text = page.get("text")
    uzunluk = len(text) if isinstance(text, str) else None
    sinif["kovalar"][uzunluk_kovasi(uzunluk)] += 1
    if uzunluk:
        sinif["uzunluklar"].append(uzunluk)
    if "text_length" in page:
        _text_length_karsilastir(sinif["text_length"], page["text_length"], uzunluk)

    etiketler = on_etiketler(baslik)
    for ad in etiketler:
        sinif["etiketler"][ad] += 1
    if not etiketler:
        sinif["etiketsiz"] += 1

    if len(sinif["ornekler"]) < limit:
        sinif["ornekler"].append({
            "url": url,
            "baslik": baslik,
            "metin_uzunlugu": uzunluk,
            "headings": sayilar["headings"],
            "internal_links": sayilar["internal_links"],
            "images": sayilar["images"],
            "etiketler": etiketler,
        })


def _text_length_karsilastir(ozet, deger, uzunluk):
    ozet["var"] += 1
    if uzunluk is None or isinstance(deger, bool) or not isinstance(deger, int):
        ozet["karsilastirilamadi"] += 1
    elif deger == uzunluk:
        ozet["uyusan"] += 1
    else:
        ozet["uyusmayan"] += 1


def _sonuc(sinif) -> dict:
    anahtarlar = sinif["anahtarlar"]
    html_anahtarlari = sorted(a for a in anahtarlar if _html_anahtari_mi(a))
    alan_ozeti = {
        "text": _alan(anahtarlar, "text"),
        "html": (
            {
                "anahtarlar": html_anahtarlari,
                "var": sum(anahtarlar[a]["var"] for a in html_anahtarlari),
                "dolu": sum(anahtarlar[a]["dolu"] for a in html_anahtarlari),
                "uzunluk": _dagilim(sinif["html_uzunluklari"]),
            }
            if html_anahtarlari else YOK
        ),
        "title": _alan(anahtarlar, "title"),
        "baslik": dict(sinif["baslik"]),
        "listeler": sinif["listeler"],
    }
    for ad in META_ALANLARI:
        alan_ozeti[ad] = _alan(anahtarlar, ad)
    return {
        "sayi": sinif["sayi"],
        "anahtarlar": {
            ad: {"var": v["var"], "dolu": v["dolu"], "tipler": dict(sorted(v["tipler"].items()))}
            for ad, v in sorted(anahtarlar.items())
        },
        "beklenmeyen_anahtarlar": sorted(
            a for a in anahtarlar if a not in BEKLENEN_ANAHTARLAR
        ),
        "eksik_beklenen_anahtarlar": [
            a for a in BEKLENEN_ANAHTARLAR if a not in anahtarlar
        ] if sinif["sayi"] else [],
        "alan_ozeti": alan_ozeti,
        "uzunluk": {"kovalar": sinif["kovalar"], **_dagilim(sinif["uzunluklar"])},
        "text_length": sinif["text_length"],
        "etiketler": sinif["etiketler"],
        "etiketsiz": sinif["etiketsiz"],
        "ornekler": sinif["ornekler"],
    }


def _alan(anahtarlar, ad):
    if ad not in anahtarlar:
        return YOK
    return {"var": anahtarlar[ad]["var"], "dolu": anahtarlar[ad]["dolu"]}


def _dagilim(uzunluklar) -> dict:
    if not uzunluklar:
        return {"min": None, "medyan": None, "max": None}
    return {
        "min": min(uzunluklar),
        "medyan": statistics.median(uzunluklar),
        "max": max(uzunluklar),
    }


def uzunluk_kovasi(uzunluk) -> str:
    if not uzunluk:
        return "yok/boş"
    for sinir, kova in _KOVA_SINIRLARI:
        if uzunluk < sinir:
            return kova
    return "20000+"


def on_etiketler(baslik) -> list:
    # Yalnızca normalize başlık okunur; gövde, link ve görsel okunmaz.
    if not isinstance(baslik, str):
        return []
    sozcukler = _SOZCUK.findall(mapper._fold(baslik))
    return [
        ad
        for ad, kelimeler in _KATLI_ETIKETLER.items()
        if any(s.startswith(k) for s in sozcukler for k in kelimeler)
    ]


def _h1_var(page) -> bool:
    headings = page.get("headings")
    if not isinstance(headings, list):
        return False
    return any(
        isinstance(h, dict)
        and mapper._is_level_one(h.get("level"))
        and _dolu(h.get("text"))
        for h in headings
    )


def _html_anahtari_mi(anahtar) -> bool:
    return anahtar in HTML_ANAHTARLARI or "html" in anahtar.casefold()


def _dolu(deger) -> bool:
    if deger is None:
        return False
    if isinstance(deger, str):
        return bool(deger.strip())
    if isinstance(deger, (list, dict)):
        return bool(deger)
    return True


def _json_tipi(deger) -> str:
    if deger is None:
        return "null"
    if isinstance(deger, bool):
        return "boolean"
    if isinstance(deger, (int, float)):
        return "number"
    if isinstance(deger, str):
        return "string"
    if isinstance(deger, list):
        return "array"
    if isinstance(deger, dict):
        return "object"
    return type(deger).__name__


def _maskele(text) -> str:
    # Başlık ve URL basılırken e-posta ve 10+ haneli numaralar gizlenir.
    text = _EPOSTA.sub("[e-posta gizlendi]", text)
    return _TELEFON_ADAYI.sub(
        lambda m: "[numara gizlendi]"
        if sum(c.isdigit() for c in m.group()) >= 10 else m.group(),
        text,
    )


def _sayi(deger) -> str:
    if deger is None:
        return "-"
    if isinstance(deger, float) and deger.is_integer():
        return str(int(deger))
    return str(deger)


def _var_dolu(ozet) -> str:
    if ozet == YOK:
        return YOK
    return f"{ozet['var']} kayıtta var, {ozet['dolu']} kayıtta dolu"


def format_report(report) -> str:
    lines = [
        BASLIK_NOTU,
        "Dosyaya yazılmadı; hiçbir kayıt silinmedi, birleştirilmedi veya değiştirilmedi.",
        f"Okunan satır: {report['okunan']}",
        f"Geçerli aday: {report['aday']}",
        "Atlanan:",
    ]
    for neden in preview.ATLANAN_NEDENLER:
        lines.append(f"  {neden}: {report['atlanan'][neden]}")
    if report["bos_dosya"]:
        lines.append("Uyarı: girdi dosyası boş; tüm sayımlar sıfır.")
    lines.append(f"Sınıflar: {quality.URL_YAPISI_ACIKLAMA}")
    lines.append(f"{ON_ETIKET_BASLIGI}: {ON_ETIKET_NOTU}")
    for ad in SINIF_SIRASI:
        lines.extend(_sinif_satirlari(ad, report["siniflar"][ad]))
    if report["hatalar"]:
        lines.append("Hatalar:")
        lines.extend(f"  {item}" for item in report["hatalar"])
    return "\n".join(lines)


def _sinif_satirlari(ad, sinif) -> list:
    lines = ["", f"== {ad}: {sinif['sayi']} kayıt =="]
    if not sinif["sayi"]:
        return lines
    lines.append("  Üst düzey anahtarlar (kayıtta var / dolu / JSON tipleri):")
    for anahtar, alan in sinif["anahtarlar"].items():
        tipler = ", ".join(f"{t}={n}" for t, n in alan["tipler"].items())
        lines.append(f"    {anahtar}: {alan['var']} / {alan['dolu']} / {tipler}")
    lines.append(
        "  Beklenmeyen ek anahtarlar: "
        + (", ".join(sinif["beklenmeyen_anahtarlar"]) or YOK)
    )
    lines.append(
        "  Hiç görülmeyen beklenen anahtarlar: "
        + (", ".join(sinif["eksik_beklenen_anahtarlar"]) or YOK)
    )

    ozet = sinif["alan_ozeti"]
    lines.append("  Alan özeti:")
    lines.append(f"    metin (text): {_var_dolu(ozet['text'])}")
    html = ozet["html"]
    if html == YOK:
        lines.append(f"    HTML: {YOK}")
    else:
        uz = html["uzunluk"]
        lines.append(
            f"    HTML ({', '.join(html['anahtarlar'])}): {html['var']} kayıtta var, "
            f"{html['dolu']} kayıtta dolu; uzunluk min {_sayi(uz['min'])}, "
            f"medyan {_sayi(uz['medyan'])}, max {_sayi(uz['max'])} (içerik basılmadı)"
        )
    baslik = ozet["baslik"]
    lines.append(
        f"    başlık: title {_var_dolu(ozet['title'])}; geçerli H1 içeren "
        f"{baslik['h1_var']}; normalize başlığı H1'den gelen {baslik['baslik_kaynagi_h1']}"
    )
    for liste in LISTE_ALANLARI:
        l_ozet = ozet["listeler"][liste]
        lines.append(
            f"    {liste}: {l_ozet['liste']} kayıtta liste, {l_ozet['dolu']} kayıtta "
            f"boş değil, toplam öğe {l_ozet['toplam']}"
        )
    for meta in META_ALANLARI:
        lines.append(f"    {meta}: {_var_dolu(ozet[meta])}")

    uzunluk = sinif["uzunluk"]
    lines.append("  Metin uzunluğu (len(text), karakter):")
    for kova in KOVALAR:
        lines.append(f"    {kova}: {uzunluk['kovalar'][kova]}")
    lines.append(
        f"    boş olmayan metinde min {_sayi(uzunluk['min'])}, "
        f"medyan {_sayi(uzunluk['medyan'])}, max {_sayi(uzunluk['max'])}"
    )
    tl = sinif["text_length"]
    if tl["var"]:
        lines.append(
            f"    text_length alanı (bilgi): {tl['var']} kayıtta var; len(text) ile "
            f"uyuşan {tl['uyusan']}, uyuşmayan {tl['uyusmayan']}, "
            f"karşılaştırılamayan {tl['karsilastirilamadi']}"
        )
    else:
        lines.append(f"    text_length alanı: {YOK}")

    lines.append(f"  {ON_ETIKET_BASLIGI}:")
    for etiket, sayi in sinif["etiketler"].items():
        lines.append(f"    {etiket}: {sayi}")
    lines.append(f"    etiketsiz: {sinif['etiketsiz']}")

    lines.append(f"  Örnekler ({len(sinif['ornekler'])}; durum: {DURUM_NOTU}):")
    for index, ornek in enumerate(sinif["ornekler"], start=1):
        lines.append(f"    {index}. {_maskele(ornek['url'])}")
        lines.append(f"       baslik: {_maskele(ornek['baslik'])!r}")
        lines.append(
            f"       metin_uzunlugu: {_sayi(ornek['metin_uzunlugu'])}; "
            f"headings: {ornek['headings']}; internal_links: {ornek['internal_links']}; "
            f"images: {ornek['images']}"
        )
        lines.append(f"       on_etiketler: {', '.join(ornek['etiketler']) or '-'}")
    return lines


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "JSONL arşivi için salt okunur alan ve içerik uzunluğu envanteri. "
            "Dosyaya yazmaz, hiçbir kaydı değiştirmez."
        )
    )
    parser.add_argument("--input", required=True, help="Okunacak JSONL dosyası")
    parser.add_argument(
        "--limit",
        type=preview._positive_int,
        default=20,
        help="Her URL sınıfında listelenecek en fazla örnek (sayım dosyanın tamamını tarar)",
    )
    args = parser.parse_args(argv)
    try:
        report = inventory_jsonl(args.input, limit=args.limit)
    except FileNotFoundError as exc:
        raise SystemExit(str(exc)) from exc
    print(format_report(report))
    return report


if __name__ == "__main__":
    main()
