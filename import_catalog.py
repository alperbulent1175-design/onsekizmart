# Kaynak kataloğunu CSV'den tekrar üretilebilir JSON ve kaynakça bloğuna çevirir.
# Katalog satırı bir iddianın doğrulandığı anlamına gelmez.
import csv
import html
import json
import shutil
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "research" / "gelibolu"
SNAPSHOT = OUT_DIR / "kaynak-katalogu-2026-10-15.csv"
CATALOG_JSON = OUT_DIR / "katalog.json"
ACCESS_JSON = OUT_DIR / "erisim-denemesi.json"
KAYNAKCA = ROOT / "kaynakca" / "index.html"
PACKAGE_CSV = Path(
    r"C:\Users\crawi\Desktop\cursor-gelibolu-aktarim-paketi"
    r"\gelibolu-kaynak-arsivi\kaynak-katalogu.csv"
)

COLUMNS = [
    "id",
    "kurum",
    "baslik",
    "kayit_no",
    "tarih",
    "kayit_turu",
    "url",
    "konu",
    "erisim_durumu",
    "notlar",
]
STATUSES = {
    "bulundu",
    "metadata_kontrol_edildi",
    "belge_acildi",
    "iddia_dogrulandi",
    "insan_incelemesi_gerekli",
}
STATUS_LABEL = {
    "bulundu": "Bulundu",
    "metadata_kontrol_edildi": "Üst veri kontrol edildi",
    "belge_acildi": "Belge açıldı",
    "iddia_dogrulandi": "İddia doğrulandı",
    "insan_incelemesi_gerekli": "İnsan incelemesi gerekli",
}
MARK_START = "<!-- KATALOG:BAS -->"
MARK_END = "<!-- KATALOG:SON -->"
MARK_DEVAM_START = "<!-- DEVAM:BAS -->"
MARK_DEVAM_END = "<!-- DEVAM:SON -->"
DEVAM_JSON = OUT_DIR / "arsiv" / "devam" / "tarama.json"


def read_rows(path):
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        header = list(reader.fieldnames or [])
        missing = [name for name in COLUMNS if name not in header]
        if missing:
            raise SystemExit("CSV başlığında eksik sütun: " + ", ".join(missing))
        return [dict(row) for row in reader]


def valid_url(value):
    text = (value or "").strip()
    if not text:
        return True
    lower = text.lower()
    if lower.startswith("javascript:") or lower.startswith("data:"):
        return False
    if text.startswith("//") or any(ch.isspace() or ord(ch) < 32 for ch in text):
        return False
    return lower.startswith("https://") or lower.startswith("http://")


def base_status(row):
    access = (row.get("erisim_durumu") or "").lower()
    url = (row.get("url") or "").strip()
    if not url or "doğrulanamadı" in access or "kısıtlı" in access:
        return "insan_incelemesi_gerekli"
    return "bulundu"


def convert(rows):
    seen = set()
    urls = {}
    for row in rows:
        ident = (row.get("id") or "").strip()
        title = (row.get("baslik") or "").strip()
        url = (row.get("url") or "").strip()
        if not ident:
            raise ValueError("Kimliği boş satır var.")
        if ident in seen:
            raise ValueError("Yinelenen kayıt kimliği: " + ident)
        seen.add(ident)
        if not title:
            raise ValueError("Başlığı boş kayıt: " + ident)
        if not valid_url(url):
            raise ValueError("Geçersiz adres: " + ident)
        if url:
            urls[url] = urls.get(url, 0) + 1
    records = []
    for row in rows:
        url = (row.get("url") or "").strip()
        status = base_status(row)
        if status not in STATUSES:
            raise ValueError("İzin verilmeyen durum.")
        records.append(
            {
                "id": row["id"].strip(),
                "kurum": (row.get("kurum") or "").strip(),
                "baslik": row["baslik"].strip(),
                "kayit_no": (row.get("kayit_no") or "").strip(),
                "tarih": (row.get("tarih") or "").strip(),
                "kayit_turu": (row.get("kayit_turu") or "").strip(),
                "url": url,
                "konu": (row.get("konu") or "").strip(),
                "erisim_durumu": (row.get("erisim_durumu") or "").strip(),
                "notlar": (row.get("notlar") or "").strip(),
                "durum": status,
                "url_paylasilan": bool(url) and urls[url] > 1,
                "iddia_destegi": False,
            }
        )
    return {
        "arastirma_tarihi": "2026-10-15",
        "kaynak_csv": "research/gelibolu/kaynak-katalogu-2026-10-15.csv",
        "uyari": (
            "Katalog satırı bir iddiayı belgelemez. "
            "Bu dönüşüm belge açmaz ve iddia_dogrulandi vermez."
        ),
        "kayitlar": records,
    }


def apply_access(catalog, access_rows):
    by_id = {row["id"]: row for row in access_rows}
    updated = json.loads(json.dumps(catalog, ensure_ascii=False))
    for record in updated["kayitlar"]:
        probe = by_id.get(record["id"])
        if not probe:
            continue
        http = probe.get("http")
        matched = bool(probe.get("govde_eslesti"))
        if record["durum"] != "bulundu":
            if http == 200 and record["durum"] == "insan_incelemesi_gerekli":
                record["erisim_notu"] = "Katalog sayfası yanıt verdi. Metin veya görsel bu turda açılmadı."
            continue
        if http in (404, 410) or (http is None and probe.get("hata") not in ("", "adres_yok")):
            record["durum"] = "insan_incelemesi_gerekli"
            record["erisim_notu"] = "15 Ekim 2026 denemesinde adres açılmadı."
            continue
        if http == 200 and matched and record["url_paylasilan"]:
            record["erisim_notu"] = "Başlık paylaşılan liste sayfasında görüldü. Ayrı kayıt açılmadı."
            continue
        if http == 200 and matched and record["durum"] == "bulundu":
            record["durum"] = "metadata_kontrol_edildi"
            record["erisim_notu"] = "Katalog sayfasında başlık görüldü. Belge sayfa sayfa okunmadı."
            continue
        if http == 200 and record["durum"] == "bulundu":
            record["erisim_notu"] = "Adres yanıt verdi. Başlık ilk yanıtta bulunamadı."
    return updated


def render_block(catalog):
    parts = [
        MARK_START,
        "<h2>Katalog kayıtları</h2>",
        '<div class="prose">',
        "<p>Aşağıdaki liste, 15 Ekim 2026 tarihli ilk keşif kataloğudur. "
        "Satır, belgenin açıldığı veya bir iddianın doğrulandığı anlamına gelmez. "
        "Kurum ana sayfaları yukarıda kalır; onlar tek bir fiş değildir.</p>",
        "</div>",
        '<ul class="source-list" id="katalog">',
    ]
    parts.append(_render_items(catalog["kayitlar"]))
    parts.append("</ul>")
    parts.append(MARK_END)
    return "\n".join(parts)


def render_devam(payload):
    records = payload["kayitlar"]
    parts = [
        MARK_DEVAM_START,
        "<h2>Bu turda açılan katalog künyeleri</h2>",
        '<div class="prose">',
        "<p>15 Ekim 2026 devam turunda açılan Imperial War Museums künye sayfalarıdır. "
        "Görsel, mektup ve ses kaydı açılmadı. Satır bir iddiayı doğrulamaz. "
        "Önceki kurum taramalarının tamamı bu listede değildir.</p>",
        "</div>",
        '<ul class="source-list" id="katalog-devam">',
    ]
    parts.append(_render_items(records))
    parts.append("</ul>")
    parts.append(MARK_DEVAM_END)
    return "\n".join(parts)


def _render_items(records):
    chunks = []
    for record in records:
        status = record["durum"]
        if status not in STATUSES:
            raise ValueError("İzin verilmeyen durum: " + status)
        label = STATUS_LABEL[status]
        bits = [
            html.escape(record["kurum"], quote=False),
            html.escape(record.get("kayit_turu") or "Tür yazılmamış", quote=False),
            html.escape(label, quote=False),
        ]
        if record.get("kayit_no"):
            bits.append(html.escape(record["kayit_no"], quote=False))
        item = [
            f'<li id="{html.escape(record["id"], quote=True)}" data-status="{html.escape(status, quote=True)}">',
            f"<p><strong>{html.escape(record['baslik'], quote=False)}</strong></p>",
            f"<p>{' · '.join(bits)}</p>",
        ]
        url = (record.get("url") or "").strip()
        if url:
            item.append(f'<p><a href="{html.escape(url, quote=True)}">Kayıt sayfası</a></p>')
        else:
            item.append("<p>Doğrudan adres yok.</p>")
        if record.get("notlar"):
            item.append(f"<p>{html.escape(record['notlar'], quote=False)}</p>")
        if record.get("erisim_notu"):
            item.append(f"<p>{html.escape(record['erisim_notu'], quote=False)}</p>")
        item.append("</li>")
        chunks.append("".join(item))
    return "\n".join(chunks)


def write_devam():
    if not DEVAM_JSON.is_file():
        return
    payload = json.loads(DEVAM_JSON.read_text(encoding="utf-8"))
    block = render_devam(payload)
    text = KAYNAKCA.read_text(encoding="utf-8")
    start = text.find(MARK_DEVAM_START)
    end = text.find(MARK_DEVAM_END)
    if start == -1 or end == -1 or end < start:
        anchor = text.find(MARK_END)
        if anchor == -1:
            raise SystemExit("kaynakca/index.html içinde katalog son işareti yok.")
        anchor = anchor + len(MARK_END)
        text = text[:anchor] + "\n" + block + text[anchor:]
    else:
        end = end + len(MARK_DEVAM_END)
        text = text[:start] + block + text[end:]
    if text != KAYNAKCA.read_text(encoding="utf-8"):
        KAYNAKCA.write_text(text, encoding="utf-8", newline="\n")


def write_kaynakca(catalog):
    text = KAYNAKCA.read_text(encoding="utf-8")
    block = render_block(catalog)
    start = text.find(MARK_START)
    end = text.find(MARK_END)
    if start == -1 or end == -1 or end < start:
        raise SystemExit("kaynakca/index.html içinde katalog işaretleri yok.")
    end = end + len(MARK_END)
    updated = text[:start] + block + text[end:]
    if updated != text:
        KAYNAKCA.write_text(updated, encoding="utf-8", newline="\n")


def dump(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def body_matches(record, text):
    haystack = (text or "").lower()
    title = (record.get("baslik") or "").strip().lower()
    return bool(haystack) and len(title) >= 12 and title in haystack


def probe(url):
    request = urllib.request.Request(
        url,
        method="GET",
        headers={"User-Agent": "Mozilla/5.0 (compatible; onsekizmart-catalog-check/1.0)"},
    )
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            raw = response.read(120000)
            text = raw.decode("utf-8", errors="ignore")
            return {"http": response.status, "hata": "", "metin": text}
    except urllib.error.HTTPError as error:
        return {"http": error.code, "hata": "http", "metin": ""}
    except Exception as error:
        return {"http": None, "hata": error.__class__.__name__, "metin": ""}


def check_urls(catalog):
    rows = []
    seen = {}
    for record in catalog["kayitlar"]:
        url = record["url"]
        if not url:
            rows.append({"id": record["id"], "url": "", "http": None, "hata": "adres_yok"})
            continue
        if url not in seen:
            seen[url] = probe(url)
        result = seen[url]
        rows.append(
            {
                "id": record["id"],
                "url": url,
                "http": result["http"],
                "hata": result["hata"],
                "govde_eslesti": body_matches(record, result.get("metin", "")),
            }
        )
    return rows


def main(argv):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if PACKAGE_CSV.is_file():
        shutil.copyfile(PACKAGE_CSV, SNAPSHOT)
    if not SNAPSHOT.is_file():
        raise SystemExit("Katalog CSV bulunamadı.")
    catalog = convert(read_rows(SNAPSHOT))
    if "--check-urls" in argv:
        access_rows = check_urls(catalog)
        dump(ACCESS_JSON, {"tarih": "2026-10-15", "denemeler": access_rows})
    elif ACCESS_JSON.is_file():
        access_rows = json.loads(ACCESS_JSON.read_text(encoding="utf-8"))["denemeler"]
    else:
        access_rows = None
    if access_rows is not None:
        catalog = apply_access(catalog, access_rows)
    dump(CATALOG_JSON, catalog)
    write_kaynakca(catalog)
    write_devam()
    return catalog


if __name__ == "__main__":
    main(sys.argv[1:])
