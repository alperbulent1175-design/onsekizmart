"""Local numeric-claim candidates; never verifies history or contacts sources."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from build_pages import published_pages

TAGS = {"p", "dd", "li", "td", "th", "h1", "h2", "h3", "figcaption"}
NUMBER = re.compile(r"\d|\b(?:bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on|yüz|bin)\b", re.I)
QUANTITY = re.compile(r"(?:\d[\d.,–—-]*|bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on|yüz|bin)\s*(?:(?:bin|milyon)\s+)?(?:kişi|asker|yaralı|ölü|şehit|kayıp|mermi|namlu|yatak|ton|top\b)", re.I)

class Blocks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = []
        self.rows = []
        self.ignored = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.ignored += 1
        if self.ignored:
            return
        attrs = dict(attrs)
        if tag in TAGS:
            self.active.append({"tag": tag, "line": self.getpos()[0], "text": [], "links": []})
        if tag == "a" and attrs.get("href"):
            for row in self.active:
                row["links"].append(attrs["href"])

    def handle_data(self, data):
        if not self.ignored:
            for row in self.active:
                row["text"].append(data)

    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.ignored:
            self.ignored -= 1
            return
        if self.ignored or tag not in TAGS:
            return
        for index in range(len(self.active)-1, -1, -1):
            if self.active[index]["tag"] == tag:
                row = self.active.pop(index)
                text = " ".join(" ".join(row["text"]).split())
                if NUMBER.search(text):
                    row.update(text=text, links=sorted(set(row["links"])),
                               quantity_candidate=bool(QUANTITY.search(text)),
                               text_sha256=hashlib.sha256(text.encode()).hexdigest(),
                               review_status="unreviewed_candidate")
                    self.rows.append(row)
                break

def audit(root):
    root = Path(root).resolve()
    rows = []
    pages = list(published_pages(root))
    for path in sorted(pages):
        parser = Blocks()
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()
        for row in parser.rows:
            rows.append({"page": path.relative_to(root).as_posix(), **row})
    return {"task": "R03", "pages": len(pages),
            "limits": "Static HTML only; includes quotations, dates and unit numbers. Links do not verify claims. Nested blocks may overlap. JS-rendered content requires separate audit.",
            "blocks": rows}

def apply_reviews(result, reviews):
    """Carry editorial triage only when page, element and exact text still match."""
    allowed = {"false_positive", "context_checked", "needs_evidence"}
    index = {}
    for review in reviews:
        key = (review["page"], review["tag"], review["text_sha256"])
        if review.get("review_status") not in allowed or not review.get("review_note", "").strip():
            raise ValueError("Review requires an editorial status and explanation")
        if key in index and index[key] != review:
            raise ValueError("Conflicting reviews for identical text")
        index[key] = review
    matched = set()
    for row in result["blocks"]:
        key = (row["page"], row["tag"], row["text_sha256"])
        if key in index:
            row.update(review_status=index[key]["review_status"], review_note=index[key]["review_note"])
            matched.add(key)
    result["stale_reviews"] = [review for key, review in index.items() if key not in matched]
    result["review_limits"] = "Editorial triage only, never historical claim verification. Changed text requires renewed review."
    return result

if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--root", type=Path, default=Path(__file__).parent)
    cli.add_argument("--output", type=Path, required=True)
    cli.add_argument("--reviews", type=Path, help="Editorial review list; exact text hashes must match")
    args = cli.parse_args()
    if args.reviews and args.output.resolve() == args.reviews.resolve():
        cli.error("--output must differ from --reviews; review source must remain unchanged")
    result = audit(args.root)
    if args.reviews:
        result = apply_reviews(result, json.loads(args.reviews.read_text(encoding="utf-8")))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(f"{result['pages']} pages; {len(result['blocks'])} candidates; no historical verification performed.")
