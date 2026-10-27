"""Create a local release inventory. Never uploads, commits, or contacts a host."""
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from build_pages import published_pages, expected_canonical

EXCLUDED = {"archive", "research", "tmp", "tests", "tools", "prototip", "node_modules"}
ASSETS = {"css", "js", "data", "images", "vendor"}
SUFFIXES = {".css", ".js", ".map", ".json", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".woff", ".woff2"}
ROOT_FILES = {".htaccess", "favicon.svg", "robots.txt", "sitemap.xml"}


def inventory(root):
    root = Path(root).resolve()
    paths = set(published_pages(root))
    paths.update(root / name for name in ROOT_FILES if (root / name).is_file())
    for directory in ASSETS:
        if (root / directory).is_dir():
            paths.update(p for p in (root / directory).rglob("*") if p.is_file() and
                         (p.suffix.lower() in SUFFIXES or (directory == "vendor" and p.name == "LICENSE")))
    rows = []
    for path in sorted(paths):
        relative = path.relative_to(root)
        if any(p in EXCLUDED or (p.startswith(".") and p != ".htaccess") for p in relative.parts):
            continue
        if path.resolve() != path.absolute() or not path.resolve().is_relative_to(root):
            raise ValueError(f"Linked path cannot enter release: {relative}")
        content = path.read_bytes()
        rows.append({"path": relative.as_posix(), "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()})
    return rows


def compare(current, previous):
    old = {r["path"]: r["sha256"] for r in previous}
    new = {r["path"]: r["sha256"] for r in current}
    return {
        "added": sorted(new.keys() - old.keys()),
        "changed": sorted(p for p in new.keys() & old.keys() if new[p] != old[p]),
        "removed": sorted(old.keys() - new.keys()),
    }


def page_coverage(root, rows):
    root = Path(root).resolve()
    pages = {expected_canonical(root, root / r["path"]) for r in rows if r["path"].endswith("index.html")}
    sitemap = root / "sitemap.xml"
    if not sitemap.is_file():
        return {"status": "missing_sitemap", "pages_missing_from_sitemap": sorted(pages), "sitemap_without_page": []}
    tree = ET.parse(sitemap)
    urls = {element.text.strip() for element in tree.iter() if element.tag.split("}")[-1] == "loc" and element.text}
    missing, extra = sorted(pages - urls), sorted(urls - pages)
    return {"status": "matched" if not missing and not extra else "mismatch",
            "pages_missing_from_sitemap": missing, "sitemap_without_page": extra}


def verify_inventory(root, frozen):
    current = inventory(root)
    difference = compare(current, frozen)
    return {"status": "matched" if not any(difference.values()) else "mismatch", **difference}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).parent)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--previous", type=Path)
    parser.add_argument("--verify", type=Path, help="Compare current files to a frozen inventory; never repairs files")
    args = parser.parse_args()
    for source in (args.previous, args.verify):
        if source is not None and args.output.resolve() == source.resolve():
            parser.error("Output must not overwrite the comparison inventory; choose a separate output path.")
    rows = inventory(args.root)
    result = {"mode": "local_inventory_only", "files": rows,
              "limits": "Inventory is not publication approval, image rights verification, or a remote backup."}
    result["page_coverage"] = page_coverage(args.root, rows)
    if args.previous:
        previous = json.loads(args.previous.read_text(encoding="utf-8"))
        result["difference"] = compare(rows, previous if isinstance(previous, list) else previous["files"])
    if args.verify:
        frozen = json.loads(args.verify.read_text(encoding="utf-8"))
        result["frozen_verification"] = verify_inventory(args.root, frozen if isinstance(frozen, list) else frozen["files"])
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Local inventory: {len(rows)} files; no publication performed.")
    if args.verify and result["frozen_verification"]["status"] != "matched":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
