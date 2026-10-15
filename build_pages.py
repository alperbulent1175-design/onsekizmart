# -*- coding: utf-8 -*-
from pathlib import Path

root = Path(r"C:\Users\crawi\Desktop\onsekizmart-atlas")
shell = (root / "page-shell.html").read_text(encoding="utf-8")

pages = {
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
        "Bu sürümde kamuya açık bir yazışma adresi yoktur.",
        "https://onsekizmart.com/iletisim/",
        """<p class="kicker">Yazışma</p>
<h1>İletişim</h1>
<div class="prose">
<p>Bu sürümde kamuya açık bir yazışma adresi ve iletişim formu yoktur. Çalışmayan bir form konmadı.</p>
<p>Düzeltme, ancak yayımlanmış bir kaynağa dayanıyorsa sonraki sürüme eklenir. Kaynağı olmayan bir iddia sessizce kesinleştirilmez.</p>
</div>""",
    ),
    "gizlilik/index.html": (
        "Gizlilik",
        "Sitede hesap yoktur. Harita karoları ve yazı tipleri üçüncü taraf sunucularından gelir.",
        "https://onsekizmart.com/gizlilik/",
        """<p class="kicker">Veri</p>
<h1>Gizlilik</h1>
<div class="prose">
<p>Sitede üyelik ve hesap yoktur. Ziyaretçi adı, parola veya ödeme bilgisi istenmez.</p>
<p>Yazı tipleri Google Fonts üzerinden, harita karoları OpenStreetMap ve Esri üzerinden yüklenir. Bu istekler o hizmetlerin kendi kayıtlarına düşebilir. Sitenin ayrıca bir analiz aracı bu sayfada ilan edilmemiştir; ilan edilmeyen bir araç çalışıyor sayılmaz.</p>
</div>""",
    ),
}

for rel, (title, desc, canon, body) in pages.items():
    html = shell.replace("TITLE", title).replace("DESC", desc).replace("CANON", canon).replace("BODY", body)
    dest = root / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding="utf-8", newline="\n")
    print(dest)

sm = (root / "sitemap.xml").read_text(encoding="utf-8")
block = """
  <url>
    <loc>https://onsekizmart.com/hakkinda/</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://onsekizmart.com/kaynak-politikasi/</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://onsekizmart.com/telif/</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://onsekizmart.com/iletisim/</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://onsekizmart.com/gizlilik/</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
"""
if "hakkinda/" not in sm:
    sm = sm.replace("</urlset>", block + "</urlset>")
    (root / "sitemap.xml").write_text(sm, encoding="utf-8", newline="\n")
    print("sitemap")
