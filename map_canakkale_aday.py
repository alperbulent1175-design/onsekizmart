# Scraper sayfa sözlüğünü henüz doğrulanmamış katalog adayına çevirir.
# Gövde, başlık listesi, görsel ve iç link kopyalanmaz. Dosyaya yazılmaz.
import hashlib
import re
import unicodedata
from urllib.parse import urlsplit

import import_catalog

KURUM = "canakkalecephesi.com"
KAYIT_TURU = "Web sayfası"
ERISIM_DURUMU = "Ham arşiv kopyası; içerik doğrulanamadı"
SITE_ADI = "Çanakkale Cephesi"

# Tire yalnızca iki yanında boşluk varsa ayırıcıdır; "Arıburnu-Kabatepe" bölünmez.
_AYIRICI = re.compile(r"(\s*\|\s*|\s+[-–—]\s+)")
_BAS_KIRP = " \t\r\n|-–—·•.,;:!?…"
_SON_KIRP = " \t\r\n|-–—·•.,;:…"


def candidate_from_page(page: dict) -> dict | None:
    if not isinstance(page, dict):
        return None
    url = _page_url(page)
    if url is None or _is_root(url):
        return None
    title, source = _title_with_source(page)
    if not title:
        return None
    ident = _technical_id(url)
    notes = _notes(page, url, ident)
    if source == "h1":
        notes += "; baslik_kaynagi=h1"
    return {
        "id": ident,
        "kurum": KURUM,
        "baslik": title,
        "kayit_no": "",
        "tarih": "",
        "kayit_turu": KAYIT_TURU,
        "url": url,
        "konu": "",
        "erisim_durumu": ERISIM_DURUMU,
        "notlar": notes,
    }


def normalize_title(page: dict) -> str:
    # Yalnızca HTML title ve level 1 başlıklar okunur. Gövde, link, görsel ve
    # URL slug'ı başlık kaynağı değildir. Anlamlı başlık yoksa "" döner.
    return _title_with_source(page)[0]


def _title_with_source(page) -> tuple[str, str | None]:
    if not isinstance(page, dict):
        return "", None
    title = _clean_title(page.get("title"))
    if title:
        return title, "title"
    headings = page.get("headings")
    if not isinstance(headings, list):
        return "", None
    for heading in headings:
        if not isinstance(heading, dict) or not _is_level_one(heading.get("level")):
            continue
        text = _clean_title(heading.get("text"))
        if text:
            return text, "h1"
    return "", None


def _is_level_one(level) -> bool:
    if isinstance(level, bool):
        return False
    if isinstance(level, int):
        return level == 1
    if isinstance(level, str):
        return level.strip().lower() in ("1", "h1")
    return False


def _clean_title(raw) -> str:
    if not isinstance(raw, str):
        return ""
    parts = _AYIRICI.split(" ".join(raw.split()))
    segments = []
    for index in range(0, len(parts), 2):
        sep = parts[index - 1].strip() if index else ""
        segments.append((sep, parts[index].lstrip(_BAS_KIRP).rstrip(_SON_KIRP)))
    segments = [(sep, text) for sep, text in segments if text]
    site = _fold(SITE_ADI)
    while segments and _fold(segments[-1][1]) == site:
        segments.pop()
    segments = [(sep, _collapse_words(text)) for sep, text in segments]
    deduped = []
    for sep, text in segments:
        if deduped and _fold(deduped[-1][1]) == _fold(text):
            continue
        deduped.append((sep, text))
    half = len(deduped) // 2
    if half and len(deduped) % 2 == 0:
        first = [_fold(text) for _, text in deduped[:half]]
        if first == [_fold(text) for _, text in deduped[half:]]:
            deduped = deduped[:half]
    if not deduped:
        return ""
    result = deduped[0][1]
    for sep, text in deduped[1:]:
        result += f" {sep} {text}"
    if not any(char.isalnum() for char in result) or _fold(result) == site:
        return ""
    return result


def _collapse_words(text: str) -> str:
    # "X X" biçimindeki tam tekrar tek kopyaya iner.
    words = text.split()
    half = len(words) // 2
    if half and len(words) % 2 == 0:
        if [_fold(w) for w in words[:half]] == [_fold(w) for w in words[half:]]:
            return " ".join(words[:half])
    return text


def _fold(text: str) -> str:
    # Karşılaştırma içindir: büyük/küçük harf, Türkçe İ/ı ve aksan farkı yok sayılır.
    decomposed = unicodedata.normalize("NFKD", text.replace("ı", "i").replace("I", "i"))
    plain = "".join(char for char in decomposed if not unicodedata.combining(char))
    return " ".join(plain.casefold().split())


def candidates_from_pages(pages) -> list:
    chosen = []
    seen = set()
    for page in pages:
        candidate = candidate_from_page(page)
        if candidate is None:
            continue
        url = candidate["url"]
        if url in seen:
            continue
        seen.add(url)
        chosen.append(candidate)
    return chosen


def _page_url(page: dict) -> str | None:
    raw = page.get("url")
    if not isinstance(raw, str):
        return None
    url = raw.strip()
    if not url or not import_catalog.valid_url(url):
        return None
    return url


def _is_root(url: str) -> bool:
    # Sorgu ve fragment yolu değiştirmez. Yalnızca şema+host kökü elenir.
    return urlsplit(url).path in ("", "/")


def _technical_id(url: str) -> str:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:12]
    return "CC-" + digest


def _notes(page: dict, url: str, ident: str) -> str:
    parts = [
        f"teknik_kimlik={ident}",
        "arşiv kayıt numarası değildir",
    ]
    fetched = page.get("fetched_at_utc")
    if isinstance(fetched, str) and fetched.strip():
        parts.append("cekim=" + fetched.strip())
    length = _length_note(page.get("text_length"))
    if length is not None:
        parts.append("uzunluk=" + length)
    canonical = page.get("canonical_url")
    if isinstance(canonical, str) and canonical.strip() and canonical.strip() != url:
        parts.append("kanonik=" + canonical.strip())
    # published_date olay tarihi değildir; ham metin yalnızca notta kalır.
    published = page.get("published_date")
    if isinstance(published, str) and published.strip():
        parts.append("yayin_metasi=" + published)
    return "; ".join(parts)


def _length_note(value) -> str | None:
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str) and value.strip():
        return value.strip()
    return None
