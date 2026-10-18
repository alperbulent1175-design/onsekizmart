# -*- coding: utf-8 -*-
"""Yasal sayfaları şablondan üretir ve site haritasını yayımlanan sayfalardan kurar."""
from pathlib import Path
import argparse
import sys
from xml.sax.saxutils import escape
import xml.etree.ElementTree as ET

SITE = "https://onsekizmart.com"
SKIP_PARTS = {".git", "tests", "css", "js", "archive", "research", "prototip", "node_modules"}
CONTACT_BODY = """<p class="kicker">Yazışma</p>
<h1>İletişim</h1>
<div class="prose">
<p>Yazışma adresi <a href="mailto:iletisim@onsekizmart.com">iletisim@onsekizmart.com</a>. Bu bağlantı kendi posta programınızı açar; notu site sunucusuna kendiliğinden göndermez. Aşağıdaki not yalnızca bu cihazda hazırlanır. Bir sunucuya gönderilmez ve çalışan bir form gibi davranmaz.</p>
<p>Düzeltme, ancak yayımlanmış bir kaynağa dayanıyorsa sonraki sürüme eklenir. Kaynağı olmayan bir iddia sessizce kesinleştirilmez.</p>
<form class="contact-note" id="contact-note" data-mailto="iletisim@onsekizmart.com" action="#">
<p id="contact-status" role="status"></p>
<label for="contact-page">İlgili sayfa adresi</label>
<input id="contact-page" name="sayfa" type="url" inputmode="url" autocomplete="off">
<label for="contact-event">Olay adı</label>
<input id="contact-event" name="olay" type="text" autocomplete="off">
<label for="contact-source">Kaynak bağlantısı</label>
<input id="contact-source" name="kaynak" type="url" inputmode="url" autocomplete="off">
<label for="contact-body">Düzeltme notu</label>
<textarea id="contact-body" name="not" rows="5"></textarea>
<button class="btn" type="button" id="contact-copy">Notu kopyala</button>
<p><a id="contact-mail" hidden rel="noopener noreferrer"></a></p>
<pre id="contact-preview" hidden></pre>
</form>
</div>
<script>
(function () {
  var form = document.getElementById("contact-note");
  if (!form) return;
  var status = document.getElementById("contact-status");
  var preview = document.getElementById("contact-preview");
  var mail = document.getElementById("contact-mail");
  function clip(value, kind) {
    var s = String(value || "").replace(/^[\\s\\u0000-\\u001F]+|[\\s\\u0000-\\u001F]+$/g, "");
    if (!s) return "";
    if (kind === "text") return s.slice(0, 500);
    if (s.charAt(0) === "/" && s.indexOf("//") !== 0) return s.slice(0, 500);
    if (/^https:\\/\\/onsekizmart\\.com\\//i.test(s)) return s.slice(0, 500);
    if (kind === "source" && /^https:\\/\\//i.test(s)) return s.slice(0, 500);
    return "";
  }
  var params;
  try { params = new URLSearchParams(window.location.search); } catch (err) { params = null; }
  if (params) {
    document.getElementById("contact-page").value = clip(params.get("sayfa"), "page");
    document.getElementById("contact-event").value = clip(params.get("olay"), "text");
    document.getElementById("contact-source").value = clip(params.get("kaynak"), "source");
  }
  var raw = (form.getAttribute("data-mailto") || "").trim();
  if (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(raw)) {
    mail.hidden = false;
    mail.href = "mailto:" + raw;
    mail.textContent = "E-posta taslağını aç";
  }
  function packet() {
    return [
      "Sayfa: " + (document.getElementById("contact-page").value || "—"),
      "Olay: " + (document.getElementById("contact-event").value || "—"),
      "Kaynak: " + (document.getElementById("contact-source").value || "—"),
      "",
      document.getElementById("contact-body").value || ""
    ].join("\\n");
  }
  function say(text) { status.textContent = text; }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    say("Form bir sunucuya gönderilmedi.");
  });
  document.getElementById("contact-copy").addEventListener("click", function () {
    var text = packet();
    var sent = " Bir sunucuya gönderilmedi.";
    var address = mail.hidden ? " Yazışma adresi tanımlı değil." : " Bağlantı kendi posta programınızı açar; kopyalanan metin buradan gönderilmez.";
    function showLocal() {
      preview.hidden = false;
      preview.textContent = text;
      say("Kopyalanamadı; metin aşağıda." + sent + address);
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) { showLocal(); return; }
    navigator.clipboard.writeText(text).then(function () {
      preview.hidden = true;
      say("Metin panoya kopyalandı." + sent + address);
    }).catch(showLocal);
  });
})();
</script>"""

PAGES = {
    "hakkinda/index.html": (
        "Hakkında",
        "onsekizmart.com, Çanakkale Cephesi için eğitim amaçlı bir harita ve kronolojidir.",
        "https://onsekizmart.com/hakkinda/",
        """<p class="kicker">Proje</p>
<h1>Hakkında</h1>
<div class="prose">
<p>onsekizmart.com, Çanakkale Cephesi’ni harita ve kronoloji üzerinden okumak için kurulmuş bir eğitim sitesidir. Resmî bir kurum, müze veya birlik cetveli değildir.</p>
<p>Yayımlanan kayıtlar sitedeki olay, komutan ve gemi sayfalarıdır. Doğrulanmamış bir gün için olay üretilmez. Haritadaki noktalar yaklaşık işaretlenmiştir.</p>
<p>Eksik duran bölümler — belge arşivi, birlik kataloğu, site geneli arama — bu sürümde yoktur. Olmayan bir araç, düğme gibi gösterilmez.</p>
</div>""",
    ),
    "kaynak-politikasi/index.html": (
        "Kaynak politikası",
        "Tarihsel iddialar kaynakla ayrılır. Konumu belirsiz olan nokta kesin koordinat gibi yazılmaz.",
        "https://onsekizmart.com/kaynak-politikasi/",
        """<p class="kicker">Dayanak</p>
<h1>Kaynak politikası</h1>
<div class="prose">
<p>Kurum adları <a href="/kaynakca/">Kaynakça</a> sayfasındadır: Genelkurmay ATASE özetleri, Australian War Memorial ve Imperial War Museum. Bunlar ikincil çerçevenin kamuya açık yüzüdür. Tek bir sayfa numarası uydurulmaz.</p>
<p>Birincil belge (harp ceridesi, emir, harita) sitede yoksa, metin o belgeyi görmüş gibi yazılmaz. Kaynaklar çelişirse tek anlatı seçilip kesinleştirilmez.</p>
<p>Saati bilinmeyen olaya saat verilmez. Konumu yaklaşık olan işaret, yayımlanmış bir enkaz noktası gibi sunulmaz. Modern uydu görüntüsü 1915 mevzisi değildir.</p>
<p>Taslak metin, kaynakta doğrulanmadan yayımlanmış sayılmaz.</p>
</div>""",
    ),
    "telif/index.html": (
        "Telif",
        "Site metni onsekizmart.com yayınıdır. Harita karoları OpenStreetMap ve Esri’ye aittir.",
        "https://onsekizmart.com/telif/",
        """<p class="kicker">Kullanım</p>
<h1>Telif</h1>
<div class="prose">
<p>Sayfa metinleri onsekizmart.com yayınıdır. Kopyalarken site adı ve ilgili olayın adresi belirtilmelidir.</p>
<p>Yol haritası karoları OpenStreetMap katkıda bulunanlara, uydu görüntüsü Esri’ye aittir. Atıf, haritanın köşesindedir. Bu karolar sitenin malı değildir.</p>
<p>Üçüncü taraf arşivinden fotoğraf, mektup veya harita, kullanım hakkı yazılmadan sayfaya konmaz. Hakkı bilinmeyen belge serbest sayılmaz.</p>
</div>""",
    ),
    "iletisim/index.html": (
        "İletişim",
        "Yazışma adresi iletisim@onsekizmart.com. Düzeltme notu yalnızca bu cihazda hazırlanır; form bir sunucuya gönderilmez.",
        "https://onsekizmart.com/iletisim/",
        CONTACT_BODY,
    ),
    "gizlilik/index.html": (
        "Gizlilik",
        "Sitede hesap yoktur. Harita karoları ve yazı tipleri üçüncü taraf sunucularından gelir.",
        "https://onsekizmart.com/gizlilik/",
        """<p class="kicker">Veri</p>
<h1>Gizlilik</h1>
<div class="prose">
<p>Sitede üyelik ve hesap yoktur. Ziyaretçi adı, parola veya ödeme bilgisi istenmez.</p>
<p>Yazı tipleri Google Fonts üzerinden, harita karoları OpenStreetMap ve Esri üzerinden yüklenir. Bu istekler o hizmetlerin kendi kayıtlarına düşebilir. Sayfa görüntülemeleri Google Analytics 4 ile ölçülür. Başka bir analiz aracı ilan edilmemiştir.</p>
</div>""",
    ),
}


def project_root():
    return Path(__file__).resolve().parent


def fill_shell(shell, title, desc, canon, body):
    if shell.count("BODY") != 1:
        raise ValueError("Şablonda tam bir BODY yer tutucusu olmalı.")
    for token in ("TITLE", "DESC", "CANON"):
        if token not in shell.split("BODY", 1)[0]:
            raise ValueError(f"Şablonda {token} yer tutucusu yok.")
    head, tail = shell.split("BODY", 1)
    head = head.replace("TITLE", title).replace("DESC", desc).replace("CANON", canon)
    leftover = [token for token in ("TITLE", "DESC", "CANON") if token in head]
    if leftover:
        raise ValueError("Şablon yer tutucusu doldurulamadı: " + ", ".join(leftover))
    html = head + body + tail
    if "<html" not in html or "</html>" not in html or html.count("<h1>") != 1:
        raise ValueError("Üretilen HTML yapısal olarak geçersiz.")
    return html


def write_if_changed(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file():
        current = path.read_text(encoding="utf-8")
        if current == text or current.replace("\r\n", "\n") == text:
            return False
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def build_pages(root, pages=None, shell_name="page-shell.html"):
    root = Path(root)
    shell_path = root / shell_name
    if not shell_path.is_file():
        raise FileNotFoundError(f"Sayfa şablonu yok: {shell_path}")
    shell = shell_path.read_text(encoding="utf-8")
    written = []
    for rel, (title, desc, canon, body) in (pages or PAGES).items():
        if not str(canon).startswith(SITE + "/"):
            raise ValueError(f"Canonical adres site kökünde değil: {canon}")
        dest = root / rel
        if write_if_changed(dest, fill_shell(shell, title, desc, canon, body)):
            written.append(dest)
    return written


def published_pages(root):
    root = Path(root)
    pages = []
    for path in sorted(root.rglob("index.html")):
        if any(part in SKIP_PARTS or part.startswith(".") for part in path.relative_to(root).parts):
            continue
        pages.append(path)
    return pages


def expected_canonical(root, path):
    rel = path.relative_to(root).as_posix()
    if rel == "index.html":
        return SITE + "/"
    if not rel.endswith("/index.html"):
        raise ValueError(f"Yayımlanan sayfa index.html değil: {rel}")
    return SITE + "/" + rel[: -len("index.html")]


def canonical_of(html):
    start = html.find('rel="canonical" href="')
    if start < 0:
        return None
    start += len('rel="canonical" href="')
    end = html.find('"', start)
    if end < 0:
        return None
    return html[start:end]


def sitemap_entries(root):
    root = Path(root)
    found = {}
    for path in published_pages(root):
        html = path.read_text(encoding="utf-8")
        if 'content="noindex' in html:
            continue
        canon = canonical_of(html)
        if not canon:
            raise ValueError(f"Canonical adresi yok: {path}")
        expect = expected_canonical(root, path)
        if canon != expect:
            raise ValueError(f"Canonical adres dosyayla uyuşmuyor: {path} -> {canon}")
        if canon in found:
            raise ValueError(f"Mükerrer canonical: {canon}")
        found[canon] = True
    return sorted(found, key=lambda loc: (loc != SITE + "/", loc))


def render_sitemap(entries):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc in entries:
        lines.extend([
            "  <url>",
            f"    <loc>{escape(loc)}</loc>",
            "  </url>",
        ])
    lines.append("</urlset>")
    lines.append("")
    return "\n".join(lines)


def write_sitemap(root):
    root = Path(root)
    xml = render_sitemap(sitemap_entries(root))
    ET.fromstring(xml)
    dest = root / "sitemap.xml"
    write_if_changed(dest, xml)
    return dest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sitemap-only", action="store_true",
                        help="Sayfa içeriklerini değiştirmeden yalnız sitemap.xml üretir.")
    args = parser.parse_args()
    root = project_root()
    try:
        written = [] if args.sitemap_only else build_pages(root)
        sitemap = write_sitemap(root)
    except (OSError, ValueError) as exc:
        print(f"Hata: {exc}", file=sys.stderr)
        return 1
    for path in written:
        print(path)
    print(sitemap)
    return 0


if __name__ == "__main__":
    sys.exit(main())
