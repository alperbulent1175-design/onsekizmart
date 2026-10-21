# Harita kartları arasında okuma — 21 Ekim 2026

Arıburnu mevki kartından 19 Mayıs olayına Enter ile geçişte kart içeriği yenileniyor, etkin öğe `body` oluyor ve kart başlangıcı mobil ekranda yaklaşık 515 pikselde kalıyordu. İlgili olay düğmeleri artık olay başlığına odaklanıp kartı görünür kılar. Tarayıcıdaki son kontrolde odak `panel-title`, kart başlangıcı yaklaşık 76 piksel oldu.

Harita yardım satırına `Seçili kartı oku` düğmesi eklendi. Düğmenin erişilebilir adı güncel kart başlığını taşır; seçimi değiştirmeden kartı açar ve oynatmayı durdurur. Kullanıcı bu düğmeyle okumaya başladığında bekleyen açılış işlemi kartı sonradan değiştiremez. Kart kapatıldığında düğme gizlenir. JavaScript kapalıyken görünmez.

320 piksel ekran kontrolünde yatay taşma olmadı: belge ve görüntü alanı 305 piksel, iki düğme de 44 piksel yüksekliğindeydi. Dar ekranda düğmeler alt alta yerleşir. Yapışkan başlığın klavye odağını örtmemesi için iki harita yardım düğmesine kaydırma payı eklendi.

19 Mayıs kartından olay ayrıntısına ve kanıt sayfasına geçişte dönüş adresi `/?olay=e-may19#harita` olarak korundu. Her iki dönüşte de aynı olay açıldı. Tarihsel içerik veya koordinat değiştirilmedi.

Testler: 228 JavaScript + 24 Python testi geçti. Mevki–olay odak geçişi ve kart okuma düğmesinin açılma, güncellenme, kapanma davranışları gerçek işleyicilerle denetleniyor. Commit, push veya yayın yapılmadı.
