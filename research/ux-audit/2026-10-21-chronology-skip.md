# Kronolojiye doğrudan erişim — 21 Ekim 2026

Uzun Ocean mevki kartının altındaki bağlantıya kaydırılarak mobil başlıklar kontrol edildi. Kaydırma tamamlandığında site menüsü ekranın üstünde, kart başlığı 64 pikselde kaldı; kapatma düğmesi erişilebilirdi. Bu kontrolde başlık davranışında düzeltme gerektiren bir sorun bulunmadı.

Ana sayfaya ikinci klavye atlama bağlantısı eklendi: `Kronolojiye geç`. Kullanıcı haritanın çok sayıdaki denetimini dolaşmadan kronolojiye ulaşabilir. Yerel bağlantı olduğu için JavaScript gerekmez. Hedef normal Tab sırasına eklenmeden odak alır.

Tarayıcıda bağlantı klavye odağıyla görünür oldu; Enter sonrasında etkin öğe `kronoloji` olarak doğrulandı. Tüm sayfalardaki bütün atlama bağlantıları artık testte ayrı ayrı denetleniyor.

Kronolojiye, girişe veya seçilmiş güne doğrudan atlama, oynatmayı durdurur ve bekleyen eski harita açılışını geçersiz kılar. Böylece kullanıcı başka bir bölüme geçtikten sonra gecikmeli açılış onu geri çekmez. Yeni sekme/değiştirici tuş davranışları korunur.

235 JavaScript + 24 Python testi geçti. Tarihsel içerik, koordinatlar, katalog ve scraper değiştirilmedi. Commit, push veya yayın yapılmadı. Görsel: `2026-10-21-skip-chronology-mobile.jpg`.
