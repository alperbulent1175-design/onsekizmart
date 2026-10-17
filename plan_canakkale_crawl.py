"""Salt okunur tarama kuyruğu incelemesi; ağ isteği ve dosyaya yazma yapmaz."""
import argparse
import csv
import json
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

HOSTS = {"canakkalecephesi.com", "www.canakkalecephesi.com"}


def valid_url(value):
    if not isinstance(value, str):
        return None
    value = value.strip()
    try:
        parsed = urlsplit(value)
        if parsed.scheme not in {"https", "http"} or parsed.hostname not in HOSTS:
            return None
        if parsed.username or parsed.password:
            return None
    except ValueError:
        return None
    return value


def inspect_queue(folder, retry_missing=False):
    folder = Path(folder)
    archived = set()
    known = set()
    malformed = 0
    with (folder / "pages.jsonl").open(encoding="utf-8-sig") as handle:
        for line in handle:
            if not line.strip():
                continue
            try:
                record = json.loads(line)
                if not isinstance(record, dict):
                    raise ValueError("record")
            except (ValueError, TypeError):
                malformed += 1
                continue
            url = valid_url(record.get("url"))
            if url:
                archived.add(url)
            links = record.get("internal_links", [])
            if isinstance(links, list):
                for link in links:
                    target = valid_url(link.get("url")) if isinstance(link, dict) else None
                    if target:
                        known.add(target)
    with (folder / "url_inventory.txt").open(encoding="utf-8-sig") as handle:
        for line in handle:
            url = valid_url(line)
            if url:
                known.add(url)
    latest = {}
    with (folder / "crawl_report.csv").open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not {"url", "status", "note"}.issubset(reader.fieldnames or []):
            raise ValueError("Tarama raporunda url, status, note sütunları gerekli")
        for row in reader:
            url = valid_url(row.get("url"))
            if url:
                latest[url] = row
    pending = known - archived
    missing = {url for url in pending if latest.get(url, {}).get("status") in {"404", "410"}}
    non_html = {url for url in pending if latest.get(url, {}).get("status") == "200"
                and latest[url].get("note") == "HTML değil"}
    candidates = pending - non_html - (set() if retry_missing else missing)
    counts = Counter("medya_adresi" if "/wp-content/" in urlsplit(url).path
                     else "profil_adresi" if "/profil/" in urlsplit(url).path
                     else "diger_adres" for url in candidates)
    return {"arsivlenmis_url": len(archived), "bekleyen_url": len(pending),
            "onceki_404_410": len(missing), "onceki_html_olmayan": len(non_html),
            "aday_url": len(candidates), "aday_adres_turleri": dict(counts),
            "bozuk_arsiv_satiri": malformed,
            "not": "Salt okunur öneri; robots.txt ve güncel erişim kontrolü yapılmadı. Aday URL makale veya doğrulanmış bilgi demek değildir. Mevcut scraper kuyruğu değiştirilmedi.",
            "ornek_adresler": sorted(candidates)[:10]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", required=True, type=Path)
    parser.add_argument("--retry-missing", action="store_true", help="Önceki 404/410 adreslerini öneriye dahil et")
    args = parser.parse_args()
    try:
        result = inspect_queue(args.archive, args.retry_missing)
    except (OSError, ValueError) as exc:
        parser.exit(2, str(exc) + "\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
