# Mobil harita araçları: odak ve oynatma — 20 Ekim 2026

## Düzeltmeler
Kompakt görünümde Ara/Süzgeç/Katman içindeki odak, araç kapanırken görünür ve etkin tetikleyici düğmeye döner. Masaüstünde veya odak araç dışındayken taşınmaz; görünmez, inert veya devre dışı düğmeye odak verilmez. preventScroll ile harita okuma konumu korunur. Arama sonucunun panel başlığına verdiği nihai odak ile Escape ve ekran geçişi davranışları korunur.

Araç açıldığında oynatma durur. Kapatılması yeniden başlatmaz. Böylece sonraki otomatik olay güncellemesinin aracı kapatması önlenir.

## Tarayıcı kontrolleri
Düzeltme öncesinde mobil Süzgeç -> Osmanlı seçiminin ardından etkin öğe BODY olmuştu. Düzeltme sonrasında aynı seçim ve Süzgeci temizle akışlarında odak tool-filter üzerindedir. Arıburnu genel taarruzu seçimi korunmuştur; temizleme sonrasında İki taraf etkin durumdadır.

320 ve 390 piksel iframe görünümünde üç araç ayrı ayrı denendi. Oynatma açık başlatıldı, araç açıldı ve 3,3 saniye sonra kontrol edildi. Altı senaryonun tamamında oynatma açılışta durmuş, araç açık kalmış ve başlık değişmemiştir. Oynatma bilgi şeridi gizlidir; yatay taşma yoktur. Bu kontrol gerçek telefon veya dokunma testi değildir.

## Doğrulama
148 JavaScript + AGENTS.md içindeki 18 Python = 166 test geçti. Araç odak testleri mobil/masaüstü, dış odak, etkin olmayan hedefler ve açma/kapama oynatma davranışlarını kapsar. Tarihsel kayıtlar, sayılar, kaynak kataloğu ve koordinatlar değiştirilmedi. Scraper çalıştırılmadı. Yerel değişiklik; commit, push veya yayın yapılmadı.
