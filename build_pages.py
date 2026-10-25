# -*- coding: utf-8 -*-
"""Yasal sayfaları şablondan üretir ve site haritasını yayımlanan sayfalardan kurar."""
from pathlib import Path
import argparse
import json
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
<h2 id="kaynak-durumlari">Kaynak uyarıları ne anlama gelir?</h2>
<p>Bir metnin sitede görünmesi, bütün ayrıntılarının doğrulandığı anlamına gelmez. Kaynak incelemesi süren kayıtlarda, hangi bilginin desteklendiğine ve hangi soruların açık kaldığına bakın.</p>
<ul>
<li><strong>Katalog kaydı:</strong> Eserin veya belgenin künyesi bulunmuştur. İçeriği okunmuş sayılmaz.</li>
<li><strong>Akademik aktarım:</strong> Bir araştırmacının belgeye dayanan anlatısı incelenmiştir. Özgün belge ayrıca görülmediyse bu sınır belirtilir.</li>
<li><strong>Belge görüntüsü veya kanıt pasajı:</strong> İncelenen sayfa ve kısa kanıt gösterilir. Kanıt yalnız ilişkilendirildiği bilgiyi destekler; olay kartının tamamını doğrulamaz.</li>
<li><strong>Açık kalan bilgi:</strong> Kaynaklar uyuşmuyor veya yeterli kanıt yoktur. Eksik saat, sayı ya da koordinat tahminle tamamlanmaz.</li>
</ul>
<h2 id="kaniti-okuma">Bir olayın dayanağını nasıl okuyabilirsiniz?</h2>
<p>Olay kartındaki “Kanıt metinleri ve açık kalanlar” bağlantısını izleyin. İlgili kaynakta belge veya yayın tarihini, incelenen sayfayı, kanıt pasajını ve incelemenin sınırını birlikte değerlendirin. Kaynakçaya bir kitap eklemek, o kitaptaki her iddianın kontrol edildiği anlamına gelmez.</p>
<p>Bir malzemenin istenmesi teslim edildiğini; geminin hareket etmesi varışını; hastane kapasitesi tedavi edilen kişi sayısını göstermez. Aynı belgeyi aktaran iki yayın da bağımsız iki tanık sayılmaz.</p>
<p>Olayın anlatısı, haritadaki konum dayanağı ve fotoğrafın kullanım hakkı ayrı ayrı incelenir. Metni destekleyen bir belge, haritadaki sayısal noktayı veya görselin serbest kullanımını kendiliğinden doğrulamaz.</p>
</div>""",
    ),
    "cephede-beslenme/index.html": (
        "Cephede beslenme ve iaşe",
        "Osmanlı birlik kayıtları, Anzak günlüğü aktarımı ve Kızılay belgeleriyle Çanakkale Cephesi’nde beslenme.",
        "https://onsekizmart.com/cephede-beslenme/",
        """<p class="kicker">Cephede gündelik hayat</p>
<h1>Cephede beslenme ve iaşe</h1>
<div class="prose">
<p>Askerin yiyeceği nasıl hazırlanıyor, siperlere nasıl ulaşıyordu? Bir yemek bildirimi, bir ikmal şikâyeti ve bir askerin günlüğü bu sorunun farklı yanlarını gösterir. İaşe, yiyeceğin sağlanması ve dağıtılmasıdır; kâğıttaki erzak ile askerin eline geçen öğün aynı şey olmayabilir.</p>
<p><strong>Kapsam:</strong> Osmanlı tarafında belirli birlik kayıtları, İtilaf tarafında Avustralyalı bir Anzak askerinin deneyimi ve Britanya iaşe subayı Gillam’ın tanıklığı ele alınıyor. Bu örnekler bütün Osmanlı veya İtilaf askerlerinin her gün aynı yemeği yediği anlamına gelmez. Fransız hekim Vassal’ın bir öğüne ilişkin tanıklığı ve dönem basınından su ikmali örneği de var. Birliklerin günlük dağıtım cetvelleri için araştırma sürüyor.</p>
<nav aria-label="Beslenme anlatısının bölümleri"><ul><li><a href="#osmanli">Osmanlı birliklerinde yemek ve ikmal</a></li><li><a href="#anzak">Anzak tarafında erzak ve erişim</a></li><li><a href="#britanya">Britanya tarafında ekmek ve çeşitlilik arayışı</a></li><li><a href="#fransiz-yemek">Fransız tarafta bir öğün</a></li><li><a href="#su-ikmali">Fransız dönem basınında su ikmali</a></li><li><a href="#yarali">Yaralıların yolculuğunda beslenme</a></li><li><a href="#kaynak-notu">Belgeler ve doğrulama sınırları</a></li></ul></nav>
<h2 id="osmanli" tabindex="-1">Osmanlı birliklerinde yemek ve ikmal</h2>
<p>11 Mayıs 1915 tarihli bir istihkâm bölüğü bildirimi, sabah kavurmalı bulgur çorbası, öğlen çay, akşam kavurmalı bulgurlu pırasa verildiğini aktarır. Bu, o bölük ve gün için bildirilen yemektir; bütün cephenin standart menüsü değildir. <a href="#borlat-kaynagi">Kaynak: yayımlanmış birlik kaydı, s.25</a>.</p>
<p>Aynı günün başka bir yazısında, 14. Alay’ın başka taburla birlikte bulunan iki bölüğünün iaşesinin sağlanamadığı şikâyeti aktarılır. Yazı, iaşenin sağlanmasını ve sonucun bildirilmesini ister. Böylece yemek verildiğini bildiren bir kaydın yanında, ikmalin aksadığına dair bir şikâyet de görülür. Bu emir, sorunun çözüldüğünü tek başına kanıtlamaz. <a href="#borlat-kaynagi">Kaynak: 11 Mayıs 1915, 05.40 yazısı, s.16</a>.</p>
<p>11 Mayıs saat 21.07 tarihli başka bir rapor, 14. Alay’a yemek verildiğini bildirir. Ancak alay için yapılan bu genel bildirim, sabah şikâyet edilen iki bölüğün de yemek aldığını açıkça söylemez. Bu nedenle şikâyetin çözüldüğü sonucu çıkarılamaz; rapor saati de yemeğin yenildiği saat değildir. <a href="#borlat-kaynagi">Kaynak: aynı günün akşam raporu, s.31</a>.</p>
<h2 id="anzak" tabindex="-1">Anzak tarafında erzak ve erişim</h2>
<p>Australian War Memorial’ın Apcar De Vine günlüğünden yaptığı aktarım, çıkarma öncesinde konserve sığır eti, peksimet türü sert asker bisküvisi, çay ve şeker gibi yiyeceklerin taşınmak üzere hazırlandığını anlatır. Ancak De Vine, yiyeceklerini içeren çantasını çıkarma sırasında sahilde bıraktığını, daha sonra bulamadığını da kaydeder. Hazırlanan erzak ile yenebilen öğün arasındaki fark burada kişisel bir deneyimle görünür olur. <a href="#devine-kaynagi">Kaynak: AWM’nin günlük aktarımı</a>.</p>
<p>Aynı aktarımda De Vine, 12 Mayıs’ta siper gerisinde mutfak kurulmasından ve sıcak yemek verilmesinden söz eder. Bu kayıt bir askerin bulunduğu yerdeki deneyimidir; bütün İtilaf cephesinin beslenme durumunu veya ordular arasında bir üstünlüğü kanıtlamaz.</p>
<h2 id="britanya" tabindex="-1">Britanya tarafında ekmek ve çeşitlilik arayışı</h2>
<p>29. Tümen çevresindeki iaşe hizmetini anlatan John Graham Gillam, 26 Mayıs 1915 kaydında saha fırınının çalıştığını ve günlük ekmek aldıklarını yazar. Ekmek payının tamamlanmadığını, bisküviyle desteklendiğini de belirtir. Bu, belirli bir yerdeki hizmete ilişkin iaşe subayı tanıklığıdır; bütün Britanya birliklerinin aynı miktarda ekmek aldığını göstermez. <a href="#gillam-kaynagi">Kaynak: Gillam, 26 Mayıs kaydı, s.103–104</a>.</p>
<p>Ian Hamilton, yayımlanmış günlüğünün 20 Ağustos 1915 kaydında Seddülbahir, Anzak ve Suvla’daki kantin işinin hızlandırılmasını istediğini anlatır. Burada kantin, askerin olağan tayınının yanında yiyecek satın alabilmesiyle ilgilidir. Bu kayıt, beslenmede çeşitlilik arayışını komuta düzeyinden gösterir. <a href="#hamilton-kaynagi">Kaynak: Hamilton, Cilt II, s.123–124</a>.</p>
<p>Bir düzenlemeyi hızlandırma isteği, kantinlerin o gün açıldığını veya yiyeceklerin askerlere dağıtıldığını kanıtlamaz. Bu pasaj Britanya erlerinin günlük yemek cetveli değildir; Hamilton’ın yayımladığı anlatıdaki değerlendirmesidir.</p>
<p>Birdwood’un Hamilton’a yazdığı mektuplar, ek yiyeceğin sahalara ulaştırılmasındaki başka bir aşamayı gösterir. 20 Ağustos 1915 tarihli metin beklenen kantin gemisinin henüz gelmediğini belirtir. 23 Ağustos metni ise sandıkların Anzak sahasına ve Seddülbahir’e gönderilişini, ayrıca ek malzeme yollanacağı haberini aktarır. Bu yazışmalar gönderimle ilgilidir; her askerin ek yiyeceği teslim aldığını göstermez. <a href="#birdwood-kaynagi">Kaynak: Birdwood yazışmaları, PDF12–13</a>.</p>
<h2 id="fransiz-yemek" tabindex="-1">Fransız tarafta bir öğün</h2>
<p>Fransız hekim Joseph Vassal, 5 Haziran 1915 tarihli kaydında bir önceki akşam konserve sığır eti yedikten sonra çadırlarını yeniden kurabildiklerini anlatır. Böylece anlatılan öğün 4 Haziran akşamına aittir; kaydın yazıldığı günle yemeğin günü farklıdır. Bu, savaş koşullarındaki belirli bir öğüne ilişkin yayımlanmış tanıklıktır; bütün Fransız birliklerinin günlük menüsünü veya beslenmenin yeterliliğini göstermez. <a href="#vassal-kaynagi">Kaynak: Vassal, s.153–154</a>.</p>
<h2 id="su-ikmali" tabindex="-1">Fransız dönem basınında su ikmali</h2>
<p>16 Ekim 1915 tarihli <em>Excelsior</em> sayısının “La Guerre scientifique” bölümündeki fotoğraflı sayfa, içme suyunun Gharb gemisinde damıtıldığını, Étang adlı gemiye aktarıldığını ve Seddülbahir’deki su depolarına taşındığını anlatır. Altyazıya göre birliklerin gönderdiği su taşıma ekipleri bu depolardan su alıyordu. <a href="#fransiz-su-kaynagi">Kaynak: “L’eau potable aux Dardanelles”</a>.</p>
<p>Bu, dönem yayınının anlattığı bir ikmal zinciridir. Fotoğrafların kesin çekim günü, taşınan su miktarı ve her birliğe ulaşan pay belirtilmez. Yayının suyu bütünüyle arınmış gösteren ifadesi bağımsız su analizi değildir; ikmal düzeninin anlatılması bütün askerlerin yeterli su aldığı anlamına gelmez.</p>
<h2 id="yarali" tabindex="-1">Yaralıların yolculuğunda beslenme</h2>
<p>Beslenme desteği yaralı sevkinde de sürüyordu. Şirket-i Hayriye’nin 12 Mayıs 1915 tarihli yazısı, vapurlarıyla gelen yaralı gazilere çay, gevrek, süt ve ayran gibi ikramlarda bulunulduğunu bildirir. Lapseki’den 7 Ağustos’ta gönderilen ayrı yazı ise iskelede ve vapurlarda dağıtılan yoğurdun sarfiyat belgelerini merkeze sunar. Bunlar birliğin günlük tayın cetveli değildir. İncelenen üst yazıda miktar cetvelleri bulunmadığından toplam tüketim veya yararlanan kişi sayısı çıkarılmadı. <a href="#kizilay-kaynagi">Kaynak: Kızılay 90/6 ve 270/58</a>.</p>
<h2 id="kaynak-notu" tabindex="-1">Belgeler ve doğrulama sınırları</h2>
<h3 id="borlat-kaynagi" tabindex="-1">Osmanlı birlik kayıtlarının yayımlanmış aktarımı</h3>
<p>Barış Borlat (ed.), <em>Çanakkale Cephesi’nde Askerî Kayıtlara Göre 19 Mayıs 1915 Türk Taarruzu</em>, Cilt I, Kültür ve Turizm Bakanlığı / Çanakkale Savaşları Gelibolu Tarihi Alan Başkanlığı, 2020, s.16, 25 ve31. <a href="https://drive.google.com/file/d/16Dk4kS_4jjxrQ9bp1c9HZEk457GsIEHh/view">İncelenen dijital nüsha</a>.</p>
<p><strong>Olay: 11 Mayıs 1915. İnceleme: 24 Ekim 2026.</strong> 16 ve25. sayfalar 24 Ekim, 31. sayfa 25 Ekim 2026’da görüntüden kontrol edildi. 31. sayfadaki 21.07 raporu alaya yemek verildiğini bildirir; iki bölüğe teslimi ayrıca göstermez. Kısa kanıtlar: “iâşeleri temîn edilmediği” ve “kavurmalı bulgur çorbası”. Bunlar modern yayındaki belge aktarımlarıdır; özgün Osmanlıca ceridelerin bağımsız çevriyazısı yapılmadı. Buradaki inceleme belirtilen sayfalarla sınırlıdır.</p>
<p><a href="#osmanli">↑ Osmanlı birlikleri anlatısına dön</a></p>
<h3 id="devine-kaynagi" tabindex="-1">Avustralyalı bir askerin günlüğünden kurum aktarımı</h3>
<p>Robyn Van Dyk, <em>Rations for the landing, 25 April 1915 – the diary of Sergeant Apcar De Vine</em>, Australian War Memorial, 24 Nisan 2014. <a href="https://www.awm.gov.au/articles/blog/rations-landing-25-april-1915-c3a2e282ace2809c-diary-sergeant-apcar-de-vine">Günlük pasajlarını aktaran kurum yazısı</a> · <a href="https://www.awm.gov.au/collection/C1304506">1915 günlüğünün koleksiyon kaydı</a>.</p>
<p><strong>Olaylar: Nisan–Mayıs 1915. Kurum yazısına erişim: 24 Ekim 2026. Günlük görüntülerinin incelenmesi: 25 Ekim 2026.</strong> AWM RCDIG0000330 günlüğünün PDF28 sağ sayfasındaki 24 Nisan kaydında üç günlük erzak verilmesi, PDF38 sol sayfasındaki 12 Mayıs kaydında sıcak yemek alınması görüntüden kontrol edildi. Kısa kanıtlar: “rations for three days served out” ve “got a hot dinner today”. <a href="https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG0000330/bundled/RCDIG0000330.pdf#page=38">Günlük taraması, sıcak yemek kaydı</a>.</p>
<p>Üç günlük erzak verilmesi, üç gün boyunca düzenli yemek yenildiğini göstermez. Mutfakların kurulması ve kayıp yiyecek çantası anlatısı burada kurumun aktarımına dayanır; bu pasajların tam el yazısı karşılaştırması tamamlanmadı. Bütün günlük okunmadı. Bu kişisel deneyim bütün İtilaf birliklerini temsil etmez; günlük görüntüleri siteye alınmadı.</p>
<p><a href="#anzak">↑ Anzak anlatısına dön</a></p>
<h3 id="gillam-kaynagi" tabindex="-1">Britanya iaşe subayının yayımlanmış tanıklığı</h3>
<p>John Graham Gillam, <em>Gallipoli Diary</em>, Londra: George Allen & Unwin, 1918, 26 Mayıs 1915 kaydı, s.103–104. <a href="https://www.gutenberg.org/files/67661/67661-h/67661-h.htm">Project Gutenberg metni, e-kitap 67661</a>.</p>
<p><strong>Erişim ve inceleme: 25 Ekim 2026.</strong> Kısa kanıt: “The field bakery is in working order now”. Tarihli girişin yayımlanmış metin aktarımı okundu; özgün el yazısı ve baskı görüntüsü karşılaştırılmadı, bütün kitap okunmadı. Yazarın hizmete ilişkin değerlendirmesi bağımsız iaşe denetimi değildir. Fırın kapasitesinden fiilen beslenen kişi sayısı hesaplanmadı.</p>
<p><a href="#britanya">↑ Britanya anlatısına dön</a></p>
<h3 id="hamilton-kaynagi" tabindex="-1">Britanya komutanının yayımlanmış günlüğü</h3>
<p>Ian Hamilton, <em>Gallipoli Diary</em>, Cilt II, New York: George H. Doran Company, 1920, 20 Ağustos 1915 kaydı, s.123–124. <a href="https://www.gutenberg.org/files/22021/22021-h/22021-h.htm">Project Gutenberg metni, e-kitap 22021</a>.</p>
<p><strong>Erişim ve inceleme: 24 Ekim 2026.</strong> Kısa kanıt: “hurry up with his canteens at Helles, Anzac and Suvla”. Yayımlanmış metin aktarımı okundu; özgün el yazısı, kantin sevk ve teslim belgeleri görülmedi. 1920 yayın tarihi, 1915 olay tarihinden ayrıdır; bütün cilt okunmadı.</p>
<p><a href="#britanya">↑ Britanya anlatısına dön</a></p>
<h3 id="birdwood-kaynagi" tabindex="-1">Kantin erzağının sahalara gönderilişi</h3>
<p>William Riddell Birdwood’dan Ian Hamilton’a, 20 ve 23 Ağustos 1915 tarihli yazışmalar; Australian War Memorial, RCDIG0000105, 3DRL/3376 11/15 File 5, PDF12–13. <a href="https://www.awm.gov.au/collection/RCDIG0000105">Dosyanın kurum kaydı</a> · <a href="https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG0000105/bundled/RCDIG0000105.pdf#page=12">İncelenen daktilo kopyaları</a>.</p>
<p><strong>Belge tarihleri: 20 ve 23 Ağustos 1915. Erişim ve inceleme: 25 Ekim 2026.</strong> Kısa kanıtlar: “though expected has not arrived” ve “800 only had been sent here”. İlgili iki görüntü okundu; bunlar Çanakkale Komisyonu için hazırlanmış dosyadaki daktilo kopyalarıdır, imzalı asıllar karşılaştırılmadı. Sandık gönderimi, son teslim veya tüketim cetveli değildir. Bu Anzak sahasına ilişkin komuta yazışması Britanya erlerinin günlük menüsü yerine kullanılamaz; bütün dosya okunmadı.</p>
<p><a href="#britanya">↑ Kantin anlatısına dön</a></p>
<h3 id="vassal-kaynagi" tabindex="-1">Fransız hekimin yayımlanmış yemek tanıklığı</h3>
<p>Joseph Vassal, <em>Dardanelles, Serbie, Salonique: impressions et souvenirs de guerre (avril 1915–février 1916)</em>, Paris: Plon-Nourrit, 1916, s.153–154 (PDF187–188). <a href="https://pretraziva.rs/show/dardanelles-serbie-salonique.pdf#page=187">İncelenen baskı taraması</a>.</p>
<p><strong>Anlatılan öğün: 4 Haziran 1915 akşamı. Kayıt: 5 Haziran 1915. Yayın: 1916. Erişim ve inceleme: 25 Ekim 2026.</strong> Kısa kanıt: “après avoir mangé du corned beef”. İlgili iki sayfa görüntüden okundu; “Hier” sözcüğü önceki günü gösterir. Bu, yayımlanmış kişisel anlatıdır; özgün el yazısı ve birlik dağıtım cetveli görülmedi, bütün kitap okunmadı. Öğünün kesin saati, miktarı veya kişi sayısı çıkarılmadı.</p>
<p><a href="#fransiz-yemek">↑ Fransız öğün anlatısına dön</a></p>
<h3 id="fransiz-su-kaynagi" tabindex="-1">Fransız dönem yayını: suyun gemiden depoya taşınması</h3>
<p><em>Excelsior</em>, 16 Ekim 1915, sayı 1796; “La Guerre scientifique” başlıklı bölüm, “L’eau potable aux Dardanelles”, basılı s.3 (16 sayfalık taramada PDF15). <a href="https://argonnaute.parisnanterre.fr/media/54fce131-8ab8-4657-b20a-31fb40ca238f.pdf">La contemporaine / Paris Nanterre arşivindeki tarama</a>.</p>
<p><strong>Yayın tarihi: 16 Ekim 1915. Erişim ve inceleme: 24 Ekim 2026.</strong> Kapak ve ilgili sayfa görüntüden okundu. Kısa kanıtlar: “L’eau est distillée” ve “réservoirs d’eau de Sedd-ul-Bahr”. Bu bir dönem basını anlatımıdır; resmî sevk cetveli veya su kalite raporu değildir. Kesin fotoğraf çekim tarihi ve fotoğrafçı doğrulanmadı; fotoğraflar siteye alınmadı. Bütün sayı okunmadı.</p>
<p><a href="#su-ikmali">↑ Su ikmali anlatısına dön</a></p>
<h3 id="kizilay-kaynagi" tabindex="-1">İkram bildirimi ve sarfiyat üst yazısı</h3>
<p><em>Kızılay Arşivi Belgelerinde Birinci Dünya Savaşı</em>, İstanbul, 2018; yayına hazırlayanlar Recep Karacakaya, Zekai Mete, Hamdi Genç ve Faruk Bal. Kızılay 90/6: s.134–135 (PDF138–139), 12 Mayıs 1915; Kızılay 270/58: s.176–177 (PDF180–181), 7 Ağustos 1915. <a href="https://kizilaytarih.org/yayinlar/18-Kizilay-Arsivi-Belgelerinde-1.-Dunya-Savasi.pdf">Belge görüntüleri ve çevriyazılar</a>.</p>
<p><strong>İnceleme ve erişim: 24 Ekim 2026.</strong> Belirtilen sayfalardaki faksimileler ve yayımlanmış çevriyazılar birlikte kontrol edildi. Kısa kanıtlar: “çay, gevrek, süd, ayran” ve “yoğurdun mikdâr ve sarfiyâtını mübeyyin ilmühaberler”. Özgün arşiv dosyalarının tamamı ve sarfiyat ekleri görülmedi; bütün eser okunmadı.</p>
<p><a href="#yarali">↑ Yaralıların beslenmesi anlatısına dön</a></p>
<p><strong>Açık kalanlar:</strong> Britanya ve Fransız birliklerinin günlük dağıtım cetvelleri; kişisel tanıklıkların bu cetvellerle karşılaştırılması; özgün günlük sayfaları. Gramaj, kalori veya kişi başı tüketim tablosu bu kanıtlarla kurulmadı.</p>
<p><a href="/saglik-ve-tahliye/">Sağlık ve yaralı sevki</a> · <a href="/kaynak-politikasi/#kaniti-okuma">Kanıtları değerlendirme rehberi</a> · <a href="/#kronoloji">Kronolojiye dön</a></p>
</div>""",
    ),
    "saglik-ve-tahliye/index.html": (
        "Sağlık ve yaralı sevki",
        "Akbaş ve Gülnihal örneğinde görevlendirme, yaralı sevki ve sağlık kayıtlarını kaynaklarıyla okuyun.",
        "https://onsekizmart.com/saglik-ve-tahliye/",
        """<p class="kicker">Cephe gerisi</p>
<h1>Sağlık ve yaralı sevki</h1>
<div class="prose">
<p>Muharebenin sağlık boyutunu anlamak için bir geminin görevlendirilmesiyle yaralıların hareketini ve hastaneye kabulünü ayrı ayrı izlemek gerekir. Akbaş ve Gülnihal hakkındaki kayıtlar bu ayrımı görünür kılar.</p>
<nav aria-label="Sağlık anlatısının bölümleri"><ul><li><a href="#gorevlendirme">Gemilere görev verilmesi</a></li><li><a href="#hareket-bildirimi">Akbaş'tan hareket bildirimi</a></li><li><a href="#istanbulda-kabul">İstanbul’da hastaneye kabul</a></li><li><a href="#tedavi-sonrasi">Tedaviden sonraki aşama</a></li><li><a href="#sayilarin-siniri">Sayıların sınırı</a></li><li><a href="#kaynak-notu">Kaynaklar ve açık sorular</a></li></ul></nav>
<h2 id="gorevlendirme" tabindex="-1">Gemilere görev verilmesi</h2>
<p>Esenkaya'nın araştırması, 5 Mayıs 1915 tarihli bir yazıda Gülnihal ve başka vapurlar için yaralı taşıma görevlerinin bildirildiğini aktarır. Bu, hizmetin nasıl düzenlenmesinin istendiğini gösterir; aynı gün tamamlanmış bir seferin kaydı değildir.</p>
<p><a href="#esenkaya-kaynagi">Dayanak: Esenkaya, s.41, dipnot90</a>. Yazarın verdiği arşiv kodu: ATASE BDH4, Kl.4542, Dos.6, Fih.1.</p>
<h2 id="hareket-bildirimi" tabindex="-1">Akbaş'tan hareket bildirimi</h2>
<p>Aynı araştırmada, 21–22 Kasım 1915 gecesi Menzil Başhekimliğinden Sirkeci Sevk-i Mecruhin Komisyonuna gönderilen bir telgraf aktarılır. Telgraf, yaralıların Akbaş'tan Gülnihal ile İstanbul'a hareket ettiğini bildirir. Böyle bir hareket bildirimi, görevlendirmeden farklıdır; İstanbul'a varış ve hastaneye kabul için ayrıca kayıt gerekir.</p>
<p><a href="#esenkaya-kaynagi">Dayanak: Esenkaya, s.42–43, dipnot101</a>. Yazarın verdiği arşiv kodu: ATASE BDH1, Kl.1343, Dos.45, Fih.23. Bu telgrafın özgün görüntüsü burada bağımsız olarak doğrulanmadı.</p>
<h2 id="istanbulda-kabul" tabindex="-1">İstanbul’da hastaneye kabul</h2>
<p>Erdemir'in araştırması, hastanelere alınan yaralıların kabul defterlerine protokol numarasıyla kaydedildiğini; hasta tabelalarında giriş, ayrılış ve tedavi bilgilerinin tutulduğunu anlatır. Dolayısıyla gemiden iniş, hastaneye kabul ve hastaneden ayrılış aynı aşama değildir.</p>
<p><a href="#erdemir-kaynagi">Dayanak: Erdemir, s.56–57 ve Ek1, s.65</a>. Makalede yayımlanan Darüşşafaka hasta tabelası bu kayıt türüne örnektir; yukarıdaki Gülnihal seferinin yolcu listesi değildir.</p>
<h2 id="tedavi-sonrasi" tabindex="-1">Tedaviden sonraki aşama</h2>
<p>Erdemir, hastaneden ayrılışın tek bir sonuç olmadığını anlatır: tedavinin sürmesi için başka hastaneye sevk, hava değişimi, kıtaya dönüş veya emeklilik farklı işlemlerdir. Bu nedenle bir kayıttaki “taburcu” sözcüğü tek başına cepheye dönüldüğünü göstermez.</p>
<p><a href="#erdemir-kaynagi">Dayanak: Erdemir, s.57</a>. Burada bir hastanın kişisel yolculuğu kurulmadı; farklı kayıt türlerinin nasıl okunacağı açıklanıyor.</p>
<h2 id="sayilarin-siniri" tabindex="-1">Sayılar neyi gösterir?</h2>
<p>İstenen sedye sayısı mevcut yatak kapasitesi değildir. Bir sevkte bildirilen hasta ve yaralılar, bütün muharebe boyunca hizmet verilen benzersiz kişi sayısına dönüştürülemez. Ağır yaralılar bir sevk toplamının içinde veriliyorsa ayrıca eklenmez.</p>
<p>Bu sayfada toplam sevk sayısı verilmedi. İncelenen yayının aylık kalemleri ile genel toplamı uyuşmadığından, temel cetveller karşılaştırılmadan tek bir sayı kesinleştirilmiyor. <a href="/kaynak-politikasi/#kaniti-okuma">Kanıtları değerlendirme rehberi</a>.</p>
<h2 id="kaynak-notu" tabindex="-1">Kaynaklar ve açık sorular</h2>
<h3 id="esenkaya-kaynagi" tabindex="-1">İncelenen akademik aktarım</h3>
<p>Ahmet Esenkaya, “Çanakkale Muharebelerinde Cephede ve Cephe Dışında Sağlık Hizmetleri”, Çanakkale Araştırmaları Türk Yıllığı, 10–11 (2011), s.25–70. <a href="https://dergipark.org.tr/tr/pub/canakkalearastirmalari/article/52812">Yayıncı kaydı</a> · <a href="https://dergipark.org.tr/tr/download/article-file/45097">Tam metin PDF</a>.</p>
<p><strong>İnceleme ve erişim: 24 Ekim 2026.</strong> Basılı s.41–43 (PDF s.17–19) görüntüden incelendi. Kısa kanıtlar: görevlendirme için “kullanılacağını”; sevk için “İstanbul'a hareket ettiği bildirilmiştir”. Bunlar yayımlanmış aktarımlardır; özgün telgraflar görülmüş sayılmaz. Makalenin tamamı okunmadı.</p>
<h3 id="erdemir-kaynagi" tabindex="-1">Hasta kabul kayıtlarının aktarımı</h3>
<p>Lokman Erdemir, “Çanakkale Savaşı Sırasında İstanbul Hastanelerinde İlk Sağlık Hizmetleri ve Şehitlerin Defni”, Fırat Üniversitesi İlahiyat Fakültesi Dergisi 17/1 (2012), s.51–73. <a href="https://dergipark.org.tr/tr/download/article-file/2270616">Tam metin PDF</a>.</p>
<p><strong>İnceleme ve erişim: 24 Ekim 2026.</strong> Basılı s.56–57 ve65 (PDF s.6–7 ve15) görüntüden incelendi. Kısa kanıt: “hasta kabul defterlerine kaydedilmiş”. Ek1, Kızılay505/109 görüntüsünü ve yazarın çevriyazısını içerir. Özgün Osmanlıca metnin bağımsız çevriyazısı yapılmadı; bütün makale okunmadı.</p>
<p><strong>Açık sorular:</strong> Gülnihal'ın ilk hastane seferi, bu sevkin varış ve kabul kayıtları, toplamların özgün cetvellerle karşılaştırılması. Bu sayfa kesin güzergâh çizgisi veya koordinat sunmaz.</p>
<p><a href="/cephede-beslenme/">Cephede beslenme ve iaşe</a> · <a href="/#kronoloji">Kronolojiye dön</a> · <a href="/kaynak-politikasi/#kaynak-durumlari">Kaynak durumlarını okuyun</a></p>
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
<h2>Haritaya dönüş için geçici kayıt</h2>
<p>Haritanın bilgi panelinden bir ayrıntı sayfasına geçtiğinizde seçili kayıt bağlantısı, harita merkezi ve yakınlaştırma, taraf ve deniz/kara süzgeçleri, işaret katmanları, uydu/yol haritası tercihi ve harita arama metni tarayıcınızın sekme oturumunda (sessionStorage) saklanır. Bu görünüm kaydı site sunucusuna gönderilmez. Harita merkezi, ekranda baktığınız alanı belirtir; cihazınızın konumu alınmaz.</p>
<p>Kayıt yalnız aynı harita bağlantısına dönüşte kullanılır ve kullanıldıktan sonra kaldırılır. 30 dakikadan eski kayıt uygulanmaz; kullanılmamış kayıt sekme oturumu sona erdiğinde silinir. Tarayıcı saklamayı engellerse harita bağlantıları çalışmaya devam eder.</p>
<h2>Dış hizmetler</h2>
<p>Yazı tipleri Google Fonts üzerinden, harita karoları OpenStreetMap ve Esri üzerinden yüklenir. Bu istekler o hizmetlerin kendi kayıtlarına düşebilir. Sayfa görüntülemeleri Google Analytics 4 ile ölçülür. Başka bir analiz aracı ilan edilmemiştir.</p>
</div>""",
    ),
}


def chronology_source_page(root):
    rows = json.loads((Path(root) / "data/chronology-sources.json").read_text(encoding="utf-8"))
    body = '<p class="kicker">Kronoloji</p><h1>Kronoloji kaynak notları</h1><p>Ana sayfadaki yeni kayıtların dayanakları. Bu seçki her günün bütün olaylarını kapsamaz. Kurumsal özet, özgün emir veya harp ceridesiyle aynı kanıt türü değildir.</p><p>Olay tarihi her başlıkta; erişim tarihi 25 Ekim 2026. Kaynakların yayın tarihi belirtilmemişse tahmin edilmedi. İngilizce girişler kısa Türkçe özetlendi; doğrudan alıntı değildir.</p>'
    for row in rows:
        source = row['source']
        body += '<h2 id="' + escape(row['id']) + '">' + escape(row['date']) + '</h2>'
        body += '<p><a href="' + escape(source['url']) + '">' + escape(source['label']) + '</a> · İlgili kayıt: ' + escape(source['passage']) + '.</p>'
        body += '<p>' + escape(source['scope']) + ' Doğrulama durumu: ' + escape(source['status']) + '.</p>'
        if row['id'] == 'e-mayis-sessiz-1':
            body += '<p>Günlükte 9 Mayıs için 21.00 planı, 22.30 hücumu; devamında ertesi sabah 06.00’da eski mevziye dönüş ve 07.00 karşı taarruzu ayrılıyor. Bu kayıt tek taburun anlatımıdır; bütün cepheye genellenmez.</p><p><a href="https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG1004304/large/4922380.JPG">Günlük yaprak46</a> · <a href="https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG1004304/large/4922381.JPG">Günlük yaprak47</a>. Kısa kanıt: <q>again occupied at 6 am next day</q>. Yer veya tünel koordinatı bu pasajdan çıkarılmadı.</p>'
        if row['id'] == 'e-temmuz-agustos':
            body += '<p>Varış, hasta kabulüne başlama tarihi değildir; bu kayıttan hastanenin o gün faaliyete geçtiği sonucu çıkarılmadı.</p>'
        if row['id'] == 'e-mayis-sessiz-3':
            body += '<p>Görüşme fotoğrafı 24 Mayıs defin fotoğrafı olarak kullanılmadı.</p>'
        body += '<p><a href="/?olay=' + escape(row['id']) + '#kronoloji">Kronolojideki kayda dön</a></p>'
    return {"kronoloji-kaynaklari/index.html": ("Kronoloji kaynak notları", "Kronoloji kayıtlarının kaynakları ve inceleme sınırları.", SITE + "/kronoloji-kaynaklari/", body)}


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
    selected = pages if pages is not None else {**PAGES, **chronology_source_page(root)}
    for rel, (title, desc, canon, body) in selected.items():
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
