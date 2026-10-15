# Tasarım kararları

Tarih: 15 Ekim 2026. Bitmiş ana sayfa yerleşimi yeniden kurulmadı.

## Kaynakça süzgeci

Süzgeç yalnızca tarayıcıda çalışır. `#katalog` ve `#katalog-devam` içindeki mevcut `li` öğelerini gizler. Kayıt eklemez, katalog JSON’unu değiştirmez, `innerHTML` kullanmaz.

Kurum ve tür, kartın ikinci paragrafındaki mevcut « · » ayrımından okunur. Durum seçeneğinin değeri `data-status` özniteliğidir. Görünen etiket, aynı paragrafta zaten yazan durum cümlesidir; o cümle yoksa ham `data-status` değeri kullanılır. Listede olmayan `belge_acildi` veya `iddia_dogrulandi` seçeneği üretilmez.

«Süzgeci temizle» aramayı ve üç seçimi boşaltır, gizlenen kartları geri gösterir. Üstteki üç maddelik kurum çerçevesi süzgeç dışındadır; o liste kurum ana sayfasıdır, fiş değildir.

Kartlar kenarlıklı blok olur. Uzun adres `overflow-wrap: anywhere` ile satır kırar. Kaynakça stil adresi `style.css?v=20261015k` yapılır ki yeni kart kuralı eski `20261015j` önbelleğine takılmasın. Diğer sayfaların sürüm dizgisine dokunulmaz.

## İletişim

Form `action="#"` taşır, `data-mailto` boştur, düğme `type="button"`dir. Metin, notun sunucuya gitmediğini söyler. Kopyalama paketi sayfa adresi, olay adı, isteğe bağlı kaynak ve düzeltme notunu zaten içerir. E-posta uydurulmadı. Akışa dokunulmadı.

## Olay sayfalarındaki kurum çerçevesi

Olay ve komutan sayfalarında duran cümle korunur: eser cildi, belge numarası ve sayfa işli değildir; ayrıntı doğrulanmış kayıt olarak işaretlenmez. Kurum ana sayfası fiş gibi yeniden yazılmadı.

## de Robeck

Yeni belge açılmadan 16 Mart 1915 ile 17 Mart 1915 birleştirilmez. Ayrıntı `historical-data-issues.md` içindedir.

## Google Analytics

Başka çalışma `G-MKGGXNVR7V` etiketini yayımlanan sayfalara ekledi. Bu tur etiketi silmedi, ikinci kez yazmadı, kimliği değiştirmedi. Kaynakça başlığı düzenlenirken okunan `gtag` bloğu yerinde bırakıldı.

## Bu turda yapılmayan

Harita kümeleme, Lighthouse ölçümü ve bütün olay sayfalarını tek veri kaynağından yeniden üretmek yapılmadı. Büyük yerleşim yeniden yazılmadı. Commit ve deploy yok.
