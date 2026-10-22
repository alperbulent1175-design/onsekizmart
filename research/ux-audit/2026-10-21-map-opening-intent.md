# Başlangıç görünümü ve rehber okuma önceliği

21 Ekim 2026: Başlangıç görünümü düğmesi panelRevision artırarak bekleyen açılış seçimini geçersiz kılar. Önceki davranışta düğme yalnız oynatma ve animasyonu durduruyor, 350 ms bekleyen olay/mevki/zaman seçimi görünümü yeniden değiştirebiliyordu. Yeni zamanlama testi üç bağlantı türünde reset sonrasında geç kalan seçimin uygulanmadığını doğrular.

Harita rehberi açılınca da oynatma durur ve bekleyen seçim iptal edilir. Rehberi kapatmak oynatmayı başlatmaz. Görünür rehberde bu davranış açıklanır.

Mobil tarayıcı kontrolü: Başlangıç görünümü sonrası Irresistible kartı korundu; durum mesajı seçimin ve süzgeçlerin korunduğunu bildirdi. Oynatma aria-pressed=true iken rehber açılması false yaptı; kapanışta false kaldı. 254 JavaScript + 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız.

Ekran görüntüleri: 2026-10-21-map-reset-intent-mobile.jpg ve 2026-10-21-map-guide-pause-mobile.jpg. Tarihsel veri değişmedi; commit, push ve yayın yapılmadı.
