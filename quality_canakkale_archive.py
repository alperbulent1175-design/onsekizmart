# JSONL arşivinde başlık kalitesini ve yayın metaverisi dağılımını raporlar.
# Salt okunur: dosyaya yazılmaz, hiçbir başlık düzeltilmez, durum yükseltilmez.
# Bayraklar yalnızca insan incelemesi içindir; tarihsel çıkarım yapılmaz.
import argparse
import json
import os
import re
from urllib.parse import unquote, urlsplit

import map_canakkale_aday as mapper
import preview_canakkale_archive as preview

KISA_BASLIK_ESIGI = 5
YAYIN_YILI_ACIKLAMA = "Yayın yılı (web sayfası metaverisi; olay tarihi değildir)"
YIL_BILINMIYOR = "bilinmiyor"
YIL_GECERSIZ = "gecersiz"
_YIL = re.compile(r"(\d{4})(?!\d)")

BAYRAKLAR = (
    "parca_tekrari_silindi",
    "tek_kelime_tekrari_silindi",
    "tek_kelime_tekrari_korundu",
    "cok_kelime_tekrari_silindi",
    "h1_kaynakli",
    "kisa_baslik",
    "ayni_baslik_farkli_url",
    "h1_html_farkli",
)
BAYRAK_KURALLARI = {
    "parca_tekrari_silindi": "normalize başlıkta ham metinden daha az ayırıcı parçası var",
    "tek_kelime_tekrari_silindi": (
        "ham metindeki bitişik tek kelime tekrarı (boşlukla ya da ayırıcıyla) "
        "tek kopyaya inmiş; mapper bunu yapmaz, normalde 0 olmalı"
    ),
    "tek_kelime_tekrari_korundu": (
        "normalize başlıkta bitişik aynı tek kelime var ve korundu "
        "(örn. 'Bora Bora', 'Gelibolu – Gelibolu')"
    ),
    "cok_kelime_tekrari_silindi": (
        "ham parçada, ardışık parça dizisinde ya da site eki dışındaki başlığın "
        "tamamında en az iki kelimelik blok tekrarı tek kopyaya inmiş"
    ),
    "h1_kaynakli": "HTML title kullanılamadı, başlık H1'den alındı",
    "kisa_baslik": f"normalize başlık {KISA_BASLIK_ESIGI} karakterden kısa",
    "ayni_baslik_farkli_url": "aynı normalize başlık birden fazla farklı URL'de geçiyor",
    "h1_html_farkli": "HTML başlığı ile ilk geçerli H1 birbirini içermiyor",
}

# URL sınıfı yalnızca adresin yapısından çıkarılan bir sezgidir. Başlık, gövde
# veya başka alan okunmaz; sayfanın gerçek içerik türünü belirtmez.
URL_YAPISI_ACIKLAMA = "URL yapısı (sezgi; içerik türü değildir)"
URL_SINIFLARI = (
    "olasi_makale",
    "olasi_ek_sayfasi",
    "sorgu_parametreli_url",
    "belirsiz",
)
# Öncelik sırası: kurallar yukarıdan aşağı denenir, ilk eşleşen kazanır.
URL_ONEK_NOTU = (
    "yolun başındaki tek 'index.php' parçası 2. adımdan önce ayrılır; başka yerdeki "
    "'index.php' ayrılmaz. Tarihli yol: önekten sonra YYYY/MM/DD biçiminde üç parça; "
    "yalnızca biçim denetlenir, takvim denetlenmez, olay ya da yayın tarihi sayılmaz"
)
URL_SINIF_KURALLARI = (
    ("sorgu_parametreli_url", "adreste boş olmayan ?sorgu var (örn. ?replytocom=); /attachment/ olsa da bu sınıf"),
    ("olasi_ek_sayfasi", "yolda 'attachment' parçası var ya da son parça görsel dosya adını andırıyor"),
    ("belirsiz", "yolda liste/arşiv parçası var (category, tag, author, page, feed, wp-* ...) ya da yalnızca rakamlı yol"),
    ("olasi_makale", "tarihli yol; tarihten sonra tek parça, en az 3 harfli slug, isteğe bağlı .html/.htm"),
    ("olasi_ek_sayfasi", "tarihli yol; tarihten sonra iki parça, ikincisi ek izlenimi veriyor (1-1, kapak2-1, image_750x_<hex>, yalnızca rakam)"),
    ("belirsiz", "diğer tarihli yollar (tarihten sonra 0, 3+ parça ya da ek izlenimi vermeyen iki parça)"),
    ("belirsiz", "tarihsiz 'index.php' önekli yol (örn. /index.php/hakkimizda/; eski sonuç korunur)"),
    ("olasi_makale", "1-4 parçalı yol; son parça en az 3 harfli slug, isteğe bağlı .html/.htm"),
    ("belirsiz", "diğer her şey"),
)
SORGUSUZ_URL_DE_VAR_KURALI = (
    "sorgulu adresin sorgusuz hali (sondaki / farkı yok sayılır) de aday; "
    "ikisi de sayıldı, hiçbiri birleştirilmedi"
)
_GORSEL_UZANTI = re.compile(r"\.(jpe?g|png|gif|webp|bmp|tiff?|svg)$")
_WP_EK_SLUG = re.compile(r"[-_](jpe?g|png|gif|webp|bmp|tiff?)(-\d+)?$")
_KAMERA_ADI = re.compile(r"^(img|image|dsc|dscn|dscf|pict|photo|foto|resim)[-_]?\d{2,}(-\d+)?$")
_LISTE_YOLLARI = frozenset((
    "category", "tag", "author", "page", "feed", "comments", "trackback",
    "embed", "search", "kategori", "etiket", "yazar",
    "wp-content", "wp-includes", "wp-admin", "wp-json",
))
_SLUG = re.compile(r"^[\w-]+$")
_MAKALE_UZANTI = re.compile(r"\.html?$")
_TARIH_PARCALARI = (re.compile(r"\d{4}"), re.compile(r"\d{2}"), re.compile(r"\d{2}"))
# Yalnızca tarihli yolun ikinci alt parçasında denenir; tek başına bir slug
# ("57-alay", "kapak2-1") makale olabileceği için orada uygulanmaz.
_ALT_EK = re.compile(r"^(\d+-\d+|[^\W\d_]+\d+-\d+|image_\d+x\d*_[0-9a-f]+|\d+)$")


def quality_jsonl(path, limit=20) -> dict:
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 1:
        raise ValueError("limit pozitif bir tamsayı olmalı")
    source = os.fspath(path)
    if not os.path.isfile(source):
        raise FileNotFoundError(f"Girdi dosyası bulunamadı: {source}")

    okunan = 0
    aday = 0
    atlanan = {neden: 0 for neden in preview.ATLANAN_NEDENLER}
    hatalar = []
    kaynak = {"html": 0, "h1": 0}
    bayraklar = {ad: {"sayi": 0, "ornekler": []} for ad in BAYRAKLAR}
    yalnizca_kelime = 0
    yalnizca_tek_kelime = 0
    yillar = {}
    url_siniflari = {ad: {"sayi": 0, "ornekler": []} for ad in URL_SINIFLARI}
    sorgusuz_anahtarlar = set()
    sorgulu = []
    gorulen = set()
    # Aynı başlık kontrolü dosya sonunda yapılabildiği için başlık başına
    # yalnızca url ve kısa başlık metinleri tutulur; gövde tutulmaz.
    basliklar = {}

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

            baslik = candidate["baslik"]
            h1_kaynak = "baslik_kaynagi=h1" in candidate["notlar"]
            kaynak["h1" if h1_kaynak else "html"] += 1
            ornek = _ornek(page, url, baslik, h1_kaynak)

            bulunan = _satir_bayraklari(page, baslik, h1_kaynak)
            for ad in bulunan:
                _ekle(bayraklar[ad], ornek, limit)
            kelime = bulunan & {"tek_kelime_tekrari_silindi", "cok_kelime_tekrari_silindi"}
            if kelime and "parca_tekrari_silindi" not in bulunan:
                yalnizca_kelime += 1
                if kelime == {"tek_kelime_tekrari_silindi"}:
                    yalnizca_tek_kelime += 1

            basliklar.setdefault(mapper._fold(baslik), []).append(ornek)
            yil = yayin_yili(page.get("published_date"))
            yillar[yil] = yillar.get(yil, 0) + 1

            sinif = url_sinifi(url)
            url_ornegi = {"url": url, "baslik": baslik}
            _ekle(url_siniflari[sinif], url_ornegi, limit)
            if urlsplit(url).query:
                sorgulu.append(url_ornegi)
            else:
                sorgusuz_anahtarlar.add(_sorgusuz_anahtar(url))

    for grup in basliklar.values():
        if len(grup) > 1:
            for ornek in grup:
                _ekle(bayraklar["ayni_baslik_farkli_url"], ornek, limit)

    sorgusuz_de_var = {"sayi": 0, "ornekler": []}
    for url_ornegi in sorgulu:
        if _sorgusuz_anahtar(url_ornegi["url"]) in sorgusuz_anahtarlar:
            _ekle(sorgusuz_de_var, url_ornegi, limit)

    return {
        "okunan": okunan,
        "aday": aday,
        "atlanan": atlanan,
        "hatalar": hatalar,
        "bos_dosya": okunan == 0,
        "baslik_kaynagi": kaynak,
        "bayraklar": bayraklar,
        "kelime_tekrari_ozeti": {
            "yalnizca_kelime_tekrari": yalnizca_kelime,
            "yalnizca_tek_kelime_tekrari": yalnizca_tek_kelime,
        },
        "yayin_yili": {
            "aciklama": YAYIN_YILI_ACIKLAMA,
            "dagilim": dict(sorted(yillar.items())),
        },
        "url_yapisi": {
            "aciklama": URL_YAPISI_ACIKLAMA,
            "siniflar": url_siniflari,
            "sorgusuz_url_de_var": sorgusuz_de_var,
        },
    }


def url_sinifi(url) -> str:
    # Yalnızca URL okunur. Öncelik URL_SINIF_KURALLARI sırasıdır.
    parts = urlsplit(url)
    if parts.query:
        return "sorgu_parametreli_url"
    segments = [unquote(s).lower() for s in parts.path.split("/") if s]
    onekli = bool(segments) and segments[0] == "index.php"
    if onekli:
        segments = segments[1:]
    if not segments:
        return "belirsiz"
    last = segments[-1]
    if (
        "attachment" in segments
        or _GORSEL_UZANTI.search(last)
        or _WP_EK_SLUG.search(last)
        or _KAMERA_ADI.match(last)
    ):
        return "olasi_ek_sayfasi"
    if any(s in _LISTE_YOLLARI for s in segments) or all(s.isdigit() for s in segments):
        return "belirsiz"
    if len(segments) >= 3 and all(
        desen.fullmatch(s) for desen, s in zip(_TARIH_PARCALARI, segments)
    ):
        alt = segments[3:]
        if len(alt) == 1 and _makale_slug_mu(alt[0]):
            return "olasi_makale"
        if len(alt) == 2 and _ALT_EK.match(alt[1]):
            return "olasi_ek_sayfasi"
        return "belirsiz"
    if onekli:
        return "belirsiz"
    if len(segments) <= 4 and all(_SLUG.match(s) for s in segments[:-1]) and _makale_slug_mu(last):
        return "olasi_makale"
    return "belirsiz"


def _makale_slug_mu(segment) -> bool:
    slug = _MAKALE_UZANTI.sub("", segment)
    return bool(_SLUG.match(slug)) and sum(1 for char in slug if char.isalpha()) >= 3


def _sorgusuz_anahtar(url):
    parts = urlsplit(url)
    return (parts.scheme.lower(), parts.netloc.lower(), parts.path.rstrip("/"))


def yayin_yili(value) -> str:
    # Yalnızca published_date metninin başındaki dört hane alınır.
    if value is None or (isinstance(value, str) and not value.strip()):
        return YIL_BILINMIYOR
    if not isinstance(value, str):
        return YIL_GECERSIZ
    match = _YIL.match(value.strip())
    return match.group(1) if match else YIL_GECERSIZ


def _ekle(bayrak, ornek, limit):
    bayrak["sayi"] += 1
    if len(bayrak["ornekler"]) < limit:
        bayrak["ornekler"].append(ornek)


def _ornek(page, url, baslik, h1_kaynak) -> dict:
    ham = page.get("title")
    ornek = {"url": url, "ham_title": ham if isinstance(ham, str) else "", "baslik": baslik}
    if h1_kaynak:
        ornek["ham_h1"] = _kaynak_h1(page, baslik) or ""
    return ornek


def _satir_bayraklari(page, baslik, h1_kaynak) -> set:
    found = set()
    if h1_kaynak:
        found.add("h1_kaynakli")
        ham = _kaynak_h1(page, baslik)
    else:
        ham = page.get("title")
        h1 = _ilk_gecerli_h1(page)
        if h1 and _birbirini_icermiyor(h1, baslik):
            found.add("h1_html_farkli")
    if len(baslik.strip()) < KISA_BASLIK_ESIGI:
        found.add("kisa_baslik")
    if isinstance(ham, str):
        found |= _tekrar_bayraklari(ham, baslik)
    return found


def _tekrar_bayraklari(ham, baslik) -> set:
    # Ham metin ile normalize sonucu aynı basit ayrıştırmayla karşılaştırılır.
    ham_parcalar = _parcalar(ham)
    son_parcalar = _parcalar(baslik)
    found = set()
    if len(son_parcalar) < len(ham_parcalar):
        found.add("parca_tekrari_silindi")
    if _tek_kelime_tekrari_var(son_parcalar):
        found.add("tek_kelime_tekrari_korundu")
    # Başlığın tamamı "S S" ise kopya ayırıcıyla parçalara bölünür; parça içi
    # kontrol bunu görmez, düz kelime dizisi karşılaştırılır.
    ham_duz = [word for parca in ham_parcalar for word in parca]
    son_duz = [word for parca in son_parcalar for word in parca]
    if len(son_duz) >= 2 and ham_duz == son_duz * 2:
        found.add("cok_kelime_tekrari_silindi")
    silinen = []
    for parca in ham_parcalar:
        silinen += [
            len(blok)
            for blok in _silinen_tekrarlar(
                parca, lambda b: any(_icinde(p, b) for p in son_parcalar)
            )
        ]
    # "Gelibolu – Gelibolu" gibi ayırıcıyla yazılmış tekrarlar parça düzeyindedir.
    silinen += [
        sum(len(p) for p in blok)
        for blok in _silinen_tekrarlar(ham_parcalar, lambda b: _icinde(son_parcalar, b))
    ]
    for kelime in silinen:
        found.add(
            "tek_kelime_tekrari_silindi" if kelime == 1 else "cok_kelime_tekrari_silindi"
        )
    return found


def _tek_kelime_tekrari_var(parcalar) -> bool:
    for parca in parcalar:
        if any(parca[i] == parca[i + 1] for i in range(len(parca) - 1)):
            return True
    return any(len(a) == 1 and a == b for a, b in zip(parcalar, parcalar[1:]))


def _silinen_tekrarlar(dizi, kaldi_mi):
    # Bitişik "X X" bloklarından tek kopyası sonuçta kalan ama çifti kalmayanlar.
    for size in range(1, len(dizi) // 2 + 1):
        for start in range(len(dizi) - 2 * size + 1):
            blok = dizi[start:start + size]
            if blok != dizi[start + size:start + 2 * size]:
                continue
            if kaldi_mi(blok) and not kaldi_mi(blok + blok):
                yield blok


def _parcalar(text) -> list:
    # Harf/rakam içermeyen her sözcük ("|", "-", "–") ayırıcı sayılır.
    # Site adı parçaları sayılmaz; site eki silinmesi tekrar değildir.
    site = mapper._fold(mapper.SITE_ADI)
    parcalar = [[]]
    for token in text.replace("|", " | ").split():
        word = _kirp(token)
        if word:
            parcalar[-1].append(mapper._fold(word))
        elif parcalar[-1]:
            parcalar.append([])
    return [tuple(p) for p in parcalar if p and " ".join(p) != site]


def _kirp(token) -> str:
    start, end = 0, len(token)
    while start < end and not token[start].isalnum():
        start += 1
    while end > start and not token[end - 1].isalnum():
        end -= 1
    return token[start:end]


def _icinde(parca, alt) -> bool:
    size = len(alt)
    return any(parca[i:i + size] == alt for i in range(len(parca) - size + 1))


def _kaynak_h1(page, baslik):
    # H1 kaynaklı kayıtta normalize sonucu veren ilk başlık metni ham kaynaktır.
    for heading in _basliklar(page):
        text = heading.get("text")
        if isinstance(text, str) and mapper.normalize_title({"title": text}) == baslik:
            return text
    return None


def _ilk_gecerli_h1(page):
    for heading in _basliklar(page):
        if not mapper._is_level_one(heading.get("level")):
            continue
        cleaned = mapper.normalize_title({"title": heading.get("text")})
        if cleaned:
            return cleaned
    return None


def _basliklar(page):
    headings = page.get("headings")
    if not isinstance(headings, list):
        return []
    return [h for h in headings if isinstance(h, dict)]


def _birbirini_icermiyor(first, second) -> bool:
    a, b = mapper._fold(first), mapper._fold(second)
    return a not in b and b not in a


def format_report(report) -> str:
    lines = [
        f"Okunan satır: {report['okunan']}",
        f"Geçerli aday: {report['aday']}",
        "Atlanan:",
    ]
    for neden in preview.ATLANAN_NEDENLER:
        lines.append(f"  {neden}: {report['atlanan'][neden]}")
    if report["bos_dosya"]:
        lines.append("Uyarı: girdi dosyası boş; tüm sayımlar sıfır.")
    lines.append("Başlık kaynağı:")
    for ad, sayi in report["baslik_kaynagi"].items():
        lines.append(f"  {ad}: {sayi}")
    lines.append(
        "Şüpheli başlıklar (yalnızca inceleme içindir; hiçbir kayıt düzeltilmedi):"
    )
    for ad in BAYRAKLAR:
        bayrak = report["bayraklar"][ad]
        lines.append(f"  {ad}: {bayrak['sayi']}  ({BAYRAK_KURALLARI[ad]})")
        for ornek in bayrak["ornekler"]:
            lines.append(f"    - {ornek['url']}")
            lines.append(f"      ham_title: {ornek['ham_title']!r}")
            if "ham_h1" in ornek:
                lines.append(f"      ham_h1: {ornek['ham_h1']!r}")
            lines.append(f"      baslik: {ornek['baslik']!r}")
    ozet = report["kelime_tekrari_ozeti"]
    lines.append(
        "Yalnızca kelime tekrarı kuralıyla değişen kayıt: "
        f"{ozet['yalnizca_kelime_tekrari']}"
    )
    lines.append(
        "  bunlardan yalnızca tek kelime tekrarı (normalde 0; 'Bora Bora' korunur): "
        f"{ozet['yalnizca_tek_kelime_tekrari']}"
    )
    lines.append(report["yayin_yili"]["aciklama"] + ":")
    if not report["yayin_yili"]["dagilim"]:
        lines.append("  kayıt yok")
    for yil, sayi in report["yayin_yili"]["dagilim"].items():
        lines.append(f"  {yil}: {sayi}")
    yapi = report["url_yapisi"]
    lines.append(
        yapi["aciklama"] + " (yalnızca geçerli adaylar; hiçbir kayıt birleştirilmedi):"
    )
    lines.append(f"  Önek ve tarih: {URL_ONEK_NOTU}")
    lines.append("  Kurallar (öncelik sırasıyla, ilk eşleşen kazanır):")
    for sira, (ad, kural) in enumerate(URL_SINIF_KURALLARI, start=1):
        lines.append(f"    {sira}. {ad}: {kural}")
    for ad in URL_SINIFLARI:
        sinif = yapi["siniflar"][ad]
        lines.append(f"  {ad}: {sinif['sayi']}")
        for ornek in sinif["ornekler"]:
            lines.append(f"    - {ornek['url']}")
            lines.append(f"      baslik: {ornek['baslik']!r}")
    ek = yapi["sorgusuz_url_de_var"]
    lines.append(f"  sorgusuz_url_de_var: {ek['sayi']}  ({SORGUSUZ_URL_DE_VAR_KURALI})")
    for ornek in ek["ornekler"]:
        lines.append(f"    - {ornek['url']}")
        lines.append(f"      baslik: {ornek['baslik']!r}")
    if report["hatalar"]:
        lines.append("Hatalar:")
        lines.extend(f"  {item}" for item in report["hatalar"])
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "JSONL arşivi için başlık kalitesi ve yayın metaverisi raporu. "
            "Dosyaya yazmaz, hiçbir kaydı düzeltmez."
        )
    )
    parser.add_argument("--input", required=True, help="Okunacak JSONL dosyası")
    parser.add_argument(
        "--limit",
        type=preview._positive_int,
        default=20,
        help=(
            "Her bayrakta ve URL sınıfında listelenecek en fazla örnek "
            "(sayım dosyanın tamamını tarar)"
        ),
    )
    args = parser.parse_args(argv)
    try:
        report = quality_jsonl(args.input, limit=args.limit)
    except FileNotFoundError as exc:
        raise SystemExit(str(exc)) from exc
    print(format_report(report))
    return report


if __name__ == "__main__":
    main()
