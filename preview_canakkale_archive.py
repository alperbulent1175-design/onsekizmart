# JSONL arşivini satır satır tarar ve doğrulanmamış aday raporu üretir.
# Dosyaya yazılmaz. Durum yükseltilmez. Gövde kopyalanmaz.
import argparse
import json
import os

import map_canakkale_aday as mapper

DURUM_NOTU = "insan_incelemesi_gerekli"
ATLANAN_NEDENLER = (
    "bos_satir",
    "bozuk_json",
    "gecersiz_veya_eksik_url",
    "kok_sayfa",
    "eksik_baslik",
    "yinelenen_url",
)


def preview_jsonl(path, limit=20) -> dict:
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 1:
        raise ValueError("limit pozitif bir tamsayı olmalı")
    source = os.fspath(path)
    if not os.path.isfile(source):
        raise FileNotFoundError(f"Girdi dosyası bulunamadı: {source}")

    okunan = 0
    aday = 0
    atlanan = {neden: 0 for neden in ATLANAN_NEDENLER}
    adaylar = []
    hatalar = []
    # candidates_from_pages yineleneni sessizce bırakır. Nedeni saymak için
    # adresler burada tutulur. Aday listesi en fazla limit kadar yer kaplar.
    gorulen = set()

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

            neden = _atla_nedeni(page)
            if neden is not None:
                atlanan[neden] += 1
                continue
            candidate = mapper.candidate_from_page(page)
            if candidate is None:
                # Ön kontrol ile mapper ayrışırsa satır yanlış nedene sayılmaz.
                raise RuntimeError(
                    f"satır {satir_no}: ön kontrolden geçen satır aday üretmedi"
                )

            url = candidate["url"]
            if url in gorulen:
                atlanan["yinelenen_url"] += 1
                continue
            gorulen.add(url)
            aday += 1
            if len(adaylar) < limit:
                adaylar.append(_aday_satiri(candidate))

    return {
        "okunan": okunan,
        "aday": aday,
        "atlanan": atlanan,
        "adaylar": adaylar,
        "hatalar": hatalar,
    }


def _atla_nedeni(page) -> str | None:
    # candidate_from_page ile aynı sıra: url, kök, başlık. Geçerli satırda None.
    url_nedeni = _url_nedeni(page)
    if url_nedeni is not None:
        return url_nedeni
    if not mapper.normalize_title(page):
        return "eksik_baslik"
    return None


def _url_nedeni(page) -> str | None:
    if not isinstance(page, dict):
        return "gecersiz_veya_eksik_url"
    url = mapper._page_url(page)
    if url is None:
        return "gecersiz_veya_eksik_url"
    if mapper._is_root(url):
        return "kok_sayfa"
    return None


def _aday_satiri(candidate) -> dict:
    return {
        "id": candidate["id"],
        "url": candidate["url"],
        "baslik": candidate["baslik"],
        "tarih": candidate["tarih"],
        "erisim_durumu": candidate["erisim_durumu"],
        "durum_notu": DURUM_NOTU,
    }


def format_report(report) -> str:
    lines = [
        f"Okunan satır: {report['okunan']}",
        f"Geçerli aday: {report['aday']}",
        "Atlanan:",
    ]
    for neden in ATLANAN_NEDENLER:
        lines.append(f"  {neden}: {report['atlanan'][neden]}")
    lines.append(f"Listelenen aday ({len(report['adaylar'])}):")
    if not report["adaylar"]:
        lines.append("  aday 0")
    for index, row in enumerate(report["adaylar"], start=1):
        lines.append(f"  {index}. {row['url']}")
        lines.append(f"     baslik: {row['baslik']}")
        lines.append(f"     durum_notu: {row['durum_notu']}")
    if report["hatalar"]:
        lines.append("Hatalar:")
        lines.extend(f"  {item}" for item in report["hatalar"])
    return "\n".join(lines)


def _positive_int(value):
    try:
        number = int(value)
    except (TypeError, ValueError) as exc:
        raise argparse.ArgumentTypeError(
            "limit pozitif bir tamsayı olmalı"
        ) from exc
    if number < 1:
        raise argparse.ArgumentTypeError("limit pozitif bir tamsayı olmalı")
    return number


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "JSONL arşivinden doğrulanmamış kaynak adayı önizlemesi. "
            "Dosyaya yazmaz."
        )
    )
    parser.add_argument("--input", required=True, help="Okunacak JSONL dosyası")
    parser.add_argument(
        "--limit",
        type=_positive_int,
        default=20,
        help="Raporda listelenecek en fazla aday (sayım dosyanın tamamını tarar)",
    )
    args = parser.parse_args(argv)
    try:
        report = preview_jsonl(args.input, limit=args.limit)
    except FileNotFoundError as exc:
        raise SystemExit(str(exc)) from exc
    print(format_report(report))
    return report


if __name__ == "__main__":
    main()
