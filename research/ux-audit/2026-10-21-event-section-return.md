# Olaydan komutana geçişte son bölümün korunması

21 Ekim 2026: Komutan bağlantılarındaki olayaDon ilk sayfa açılışında hazırlanıyor, sonraki bölüm değişikliğinde eski hash kalıyordu. Bağlantılar hashchange ve pageshow sırasında yeniden güncellenir. Yalnız aynı kökendeki komutan ayrıntı bağlantıları işlenir; liste, harita ve fotoğraf dönüş bilgileri korunur.

Mobil tarayıcı kontrolü: 18 Mart sayfasında kaynak dizininden Gaulois bölümüne gidildi. De Robeck bağlantısı klavyeyle açıldı; komutan sayfasındaki Okuduğunuz olaya dön bağlantısı #gaulois-kaynak hedefine döndü. Hedef başlık odaklandı ve ekranın üstünden yaklaşık 168 px aşağıda görünür kaldı.

245 JavaScript + 25 Python testi başarılı. Güncellenen dönüş testi bölüm değişimi ve pageshow sonrasında liste/harita bağlamının, komutanın kendi hash değerinin ve dış bağlantıların korunmasını denetler. Fotoğraf üreticisi --check güncel; git diff --check hatasız.

Ekran görüntüsü: 2026-10-21-event-section-return-mobile.jpg. Tarihsel veri değişmedi. Commit, push veya yayın yapılmadı.
