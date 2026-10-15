# Scraper sayfa sözlüğünü henüz doğrulanmamış katalog adayına çevirir.
# Gövde, başlık listesi, görsel ve iç link kopyalanmaz. Dosyaya yazılmaz.
import hashlib
from urllib.parse import urlsplit

import import_catalog

KURUM = "canakkalecephesi.com"
KAYIT_TURU = "Web sayfası"
ERISIM_DURUMU = "Ham arşiv kopyası; içerik doğrulanamadı"


def candidate_from_page(page: dict) -> dict | None:
    if not isinstance(page, dict):
        return None
    url = _page_url(page)
    if url is None or _is_root(url):
        return None
    title = page.get("title")
    if not isinstance(title, str) or not title.strip():
        return None
    ident = _technical_id(url)
    return {
        "id": ident,
        "kurum": KURUM,
        "baslik": title.strip(),
        "kayit_no": "",
        "tarih": "",
        "kayit_turu": KAYIT_TURU,
        "url": url,
        "konu": "",
        "erisim_durumu": ERISIM_DURUMU,
        "notlar": _notes(page, url, ident),
    }


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
