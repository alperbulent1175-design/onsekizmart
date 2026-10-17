#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Resumable, same-domain-only Çanakkale archive scraper (Python 3.9+)."""
import argparse
import csv
import json
import os
import re
import sys
import time
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag, urlunparse
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

import requests
from bs4 import BeautifulSoup

BASE = "https://www.canakkalecephesi.com/"
HOSTS = {"canakkalecephesi.com", "www.canakkalecephesi.com"}
UA = "OnsekizmartResearchBot/1.2 (historical research; low-rate crawler)"
FIELDS = ["url", "status", "title", "note"]


def norm(url):
    if not isinstance(url, str) or not url.strip():
        return None
    url, _ = urldefrag(url.strip())
    p = urlparse(url)
    if p.scheme not in ("http", "https") or (p.hostname or "").lower() not in HOSTS:
        return None
    query = [item for item in p.query.split("&") if item and
             not item.split("=", 1)[0].lower().startswith("utm_") and
             item.split("=", 1)[0].lower() not in {"fbclid", "gclid", "replytocom"}]
    return urlunparse(("https", "www.canakkalecephesi.com",
                       re.sub(r"/{2,}", "/", p.path or "/"), "", "&".join(query), ""))


def content_url(url):
    """Exclude profile, account and media URLs; keep indexes for discovery."""
    url = norm(url)
    if not url:
        return False
    path = urlparse(url).path.lower()
    if any(part in path for part in ("/profil/", "/wp-content/", "/wp-admin/", "/wp-login", "/uyelik", "/icerik-ekle", "/icerik-duzenle", "/icerik-yonetimi")):
        return False
    if re.search(r"\.(?:jpg|jpeg|png|gif|webp|pdf|zip|mp4|mp3)$", path):
        return False
    # WordPress attachment pages append another slug to the dated article path.
    if re.match(r"^/index\.php/\d{4}/\d{2}/\d{2}/[^/]+/[^/]+", path):
        return False
    return True


def sitemap(session, url, timeout, seen, allowed):
    url = norm(url)
    if not url or url in seen or not allowed(url):
        return []
    seen.add(url)
    try:
        response = session.get(url, timeout=timeout, allow_redirects=False)
    except requests.RequestException as exc:
        print("[WARN] Sitemap:", url, exc)
        return []
    if response.status_code in (403, 429):
        raise RuntimeError(f"Sitemap HTTP {response.status_code}; tarama durduruldu")
    if response.status_code != 200:
        return []
    try:
        root = ET.fromstring(response.content)
    except ET.ParseError:
        return []
    results = []
    for node in root.iter():
        if not node.tag.lower().endswith("loc") or not node.text:
            continue
        target = norm(node.text.strip())
        if not target or not allowed(target):
            continue
        if target.lower().endswith(".xml") or "sitemap" in target.lower():
            results.extend(sitemap(session, target, timeout, seen, allowed))
        else:
            results.append(target)
    return list(dict.fromkeys(results))


def extract(html, url):
    soup = BeautifulSoup(html, "html.parser")
    for element in soup(["script", "style", "noscript", "svg", "iframe", "form"]):
        element.decompose()
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    canonical = soup.select_one('link[rel="canonical"]')
    published = ""
    for selector, attr in [('meta[property="article:published_time"]', "content"),
                           ('meta[name="date"]', "content"), ("time[datetime]", "datetime")]:
        element = soup.select_one(selector)
        if element and element.get(attr):
            published = element[attr].strip()
            break
    content = None
    for selector in ["article", ".entry-content", ".post-content", ".article-content",
                     ".td-post-content", "main", "#content"]:
        element = soup.select_one(selector)
        if element and len(element.get_text(" ", strip=True)) > 200:
            content = element
            break
    if content is None:
        content = soup.body or soup
    text = re.sub(r"\n{3,}", "\n\n", content.get_text("\n", strip=True))
    links = []
    for anchor in soup.find_all("a", href=True):
        target = norm(urljoin(url, anchor["href"]))
        if target:
            links.append({"url": target, "text": anchor.get_text(" ", strip=True)[:300]})
    images = []
    for element in content.find_all("img"):
        src = element.get("src") or element.get("data-src") or element.get("data-lazy-src")
        if src:
            images.append({"url": urljoin(url, src), "alt": (element.get("alt") or "").strip()})
    return {
        "url": url,
        "canonical_url": norm(canonical.get("href", "")) if canonical else "",
        "title": title,
        "published_date": published,
        "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
        "headings": [{"level": h.name, "text": h.get_text(" ", strip=True)}
                     for h in content.select("h1,h2,h3,h4") if h.get_text(" ", strip=True)],
        "text": text,
        "internal_links": list({item["url"]: item for item in links}.values()),
        "images": images,
        "text_length": len(text),
    }


def load_archive(path):
    archived = set()
    discovered = set()
    if not path.exists():
        return archived, discovered
    with path.open("r", encoding="utf-8-sig") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                print(f"[WARN] Arşiv satırı {line_number} okunamadı, atlandı")
                continue
            u = norm(record.get("url"))
            if u:
                archived.add(u)
            for link in record.get("internal_links", []):
                if isinstance(link, dict):
                    target = norm(link.get("url"))
                    if target:
                        discovered.add(target)
    return archived, discovered


def load_inventory(path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig") as handle:
        return [u for line in handle if (u := norm(line.strip()))]


def load_report(path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def main():
    parser = argparse.ArgumentParser(description="Arşivi silmeden kaldığı yerden devam eder")
    parser.add_argument("--max-pages", type=int, default=200,
                        help="Bu çalıştırmada en fazla yeni URL denemesi; 0=sınırsız")
    parser.add_argument("--delay", type=float, default=2.0)
    parser.add_argument("--timeout", type=int, default=20)
    parser.add_argument("--out", default="archive")
    parser.add_argument("--retry-missing", action="store_true", help="Retry previous 404/410 responses explicitly")
    args = parser.parse_args()
    if args.max_pages < 0 or args.delay < 1 or args.timeout < 1:
        parser.error("--max-pages >= 0, --delay >= 1 ve --timeout >= 1 olmalı")
    folder = Path(args.out)
    folder.mkdir(parents=True, exist_ok=True)
    pages = folder / "pages.jsonl"
    inventory = folder / "url_inventory.txt"
    report = folder / "crawl_report.csv"
    archived, from_archive = load_archive(pages)
    prior_inventory = load_inventory(inventory)
    print(f"[INFO] Önceden arşivlenen benzersiz URL: {len(archived)}")

    session = requests.Session()
    session.headers.update({"User-Agent": UA,
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"})
    try:
        robots_response = session.get(urljoin(BASE, "robots.txt"),
                                      timeout=args.timeout, allow_redirects=False)
    except requests.RequestException as exc:
        print("[STOP] robots.txt okunamadı; güvenli şekilde duruldu:", exc)
        return 2
    if robots_response.status_code in (403, 429):
        print(f"[STOP] robots.txt HTTP {robots_response.status_code}")
        return 2
    if robots_response.status_code == 200:
        robots_text = robots_response.text
        rp = RobotFileParser()
        rp.parse(robots_text.splitlines())
    elif robots_response.status_code == 404:
        robots_text = ""
        rp = RobotFileParser()
        rp.parse(["User-agent: *", "Allow: /"])
    else:
        print(f"[STOP] robots.txt HTTP {robots_response.status_code}; tarama yapılmadı")
        return 2

    previous_status = {norm(row.get("url")): str(row.get("status", "")) for row in load_report(report)}
    skipped_missing = {url for url, status in previous_status.items() if status in {"404", "410"}}
    print(f"[INFO] Previous missing URLs excluded: {0 if args.retry_missing else len(skipped_missing)}")

    def allowed(url):
        return (content_url(url) and rp.can_fetch(UA, url)
                and (args.retry_missing or norm(url) not in skipped_missing))

    sitemap_candidates = [line.split(":", 1)[1].strip()
                          for line in robots_text.splitlines()
                          if line.lower().startswith("sitemap:")]
    sitemap_candidates.extend(urljoin(BASE, name) for name in
                              ("sitemap.xml", "sitemap_index.xml", "wp-sitemap.xml"))
    site_urls = []
    seen_sitemaps = set()
    try:
        for candidate in dict.fromkeys(sitemap_candidates):
            site_urls.extend(sitemap(session, candidate, args.timeout, seen_sitemaps, allowed))
    except RuntimeError as exc:
        print("[STOP]", exc)
        return 2

    seeds = prior_inventory + sorted(from_archive) + site_urls + [BASE]
    queue = deque()
    known = set(archived)
    for raw in seeds:
        url = norm(raw)
        if url and url not in known and allowed(url):
            queue.append(url)
            known.add(url)
    rows = load_report(report)
    attempted = 0
    saved = 0
    blocked = False
    # Append: existing archive records remain intact.
    with pages.open("a", encoding="utf-8") as output:
        while queue and (args.max_pages == 0 or attempted < args.max_pages):
            url = queue.popleft()
            if url in archived or not allowed(url):
                continue
            attempted += 1
            try:
                response = session.get(url, timeout=args.timeout, allow_redirects=False)
                print(f"[{response.status_code}] {url}")
                if response.status_code in (403, 429):
                    rows.append({"url": url, "status": response.status_code,
                                 "title": "", "note": "Erişim engeli / hız sınırı; duruldu"})
                    blocked = True
                    break
                if 300 <= response.status_code < 400:
                    location = response.headers.get("Location", "")
                    target = norm(urljoin(url, location))
                    rows.append({"url": url, "status": response.status_code,
                                 "title": "", "note": f"Yönlendirme: {target or 'alan dışı/geçersiz'}"})
                    if target and allowed(target) and target not in known:
                        queue.append(target)
                        known.add(target)
                elif response.status_code != 200:
                    rows.append({"url": url, "status": response.status_code,
                                 "title": "", "note": "Arşivlenmedi"})
                elif "html" not in response.headers.get("Content-Type", "").lower():
                    rows.append({"url": url, "status": 200, "title": "", "note": "HTML değil"})
                else:
                    record = extract(response.text, url)
                    output.write(json.dumps(record, ensure_ascii=False) + "\n")
                    output.flush()
                    archived.add(url)
                    saved += 1
                    rows.append({"url": url, "status": 200, "title": record["title"],
                                 "note": f"text_length={record['text_length']}"})
                    for item in record["internal_links"]:
                        target = norm(item["url"])
                        if target and target not in known and allowed(target):
                            queue.append(target)
                            known.add(target)
            except requests.RequestException as exc:
                rows.append({"url": url, "status": "ERROR", "title": "", "note": str(exc)})
            time.sleep(args.delay)

    # Persist all known URLs, including those remaining in queue, for later runs.
    with inventory.open("w", encoding="utf-8") as handle:
        for url in sorted(known):
            handle.write(url + "\n")
    with report.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    print(f"Yeni denenen URL: {attempted}")
    print(f"Yeni arşivlenen sayfa: {saved}")
    print(f"Toplam benzersiz arşiv URL'si: {len(archived)}")
    print(f"Keşfedilen URL: {len(known)}")
    if blocked:
        print("[STOP] 403/429 alındı; erişim kontrolünü aşmaya çalışmayın")
    elif queue:
        print(f"[INFO] {len(queue)} URL sırada kaldı; tekrar çalıştırarak devam edebilirsiniz")
    else:
        print("[INFO] Bilinen kuyruk tükendi; bu, sitedeki tüm sayfaların bulunduğunu garanti etmez")
    return 2 if blocked else 0


if __name__ == "__main__":
    sys.exit(main())
