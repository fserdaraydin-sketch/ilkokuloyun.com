+# İlkokulOyun.com
+
+İlkokul öğrencileri için tasarlanan bu depo, tamamen statik dosyalardan oluşan bir mini eğitim portalını barındırır. Ana sayfadan başlayan kart tabanlı gezinme ile her ders için ayrı HTML sayfalarına ve matematik özelindeki interaktif oyunlara ulaşılır.
+
+## Dizin Yapısı
+
+- **index.html** ana giriş sayfasıdır; kategori kartları aracılığıyla Matematik, Fen, Türkçe, İngilizce ve Hayat Bilgisi sayfalarına yönlendirir.
+- Ders sayfaları (`mat.html`, `fen.html`, `trk.html`, `ing.html`, `hayat.html`) ortak `style.css` dosyasını kullanarak aynı görsel dili paylaşır.
+- `carpma-oyunlar.html` matematik altındaki oyunlara bir geçit işlevi görür.
+- İnteraktif içerikler `carpim.html` (React tabanlı çarpım oyunu), `carpim-ezber.html` (vanilla JS ile ezber/test modu) ve `kelime-oyunu.html` (sürükle-bırak kelime sıralama) dosyalarında bulunur.
+- `tkelime-oyunu.html` aynı kelime oyununun eski bir sürümüdür ve yalnızca referans amaçlı tutulmuştur.
+
+## Teknoloji Yığını
+
+- Sayfalar geleneksel HTML + CSS yapısını kullanır; build süreci veya paket yöneticisi yoktur.
+- Ortak stil, animasyon ve kart düzenleri `style.css` içinde toplanmıştır.
+- İnteraktif oyunlar Tailwind CSS CDN'i ile stillenir. `carpim.html` React/ReactDOM UMD paketlerini kullanırken diğer oyunlar vanilla JavaScript ile çalışır.
+- Tarayıcı API'leri (ör. `SpeechSynthesis` ve `localeCompare('tr')`) kullanıcı deneyimini güçlendirmek için doğrudan kullanılır.
+
+## Geliştirme İpuçları
+
+1. **Tek stil kaynağı**: `style.css` üzerinde yapılan değişiklikler tüm ders sayfalarını etkiler. Yeni bileşenler eklerken ortak sınıfları bozmadığınızdan emin olun.
+2. **CDN bağımlılıkları**: Tailwind ve React çevrimiçi olarak yüklenir; çevrimdışı geliştirme veya sürüm sabitleme ihtiyacı varsa yerel paketler eklemeyi düşünün.
+3. **Tekrarlayan şablonlar**: Ders sayfaları benzer kart ızgaraları kullanır. Uzun vadede ortak parçaları yeniden kullanılabilir bileşenlere veya şablonlara ayırmak bakım maliyetini azaltabilir.
+4. **Veri yönetimi**: Oyunlardaki soru ve kelime listeleri HTML dosyalarına gömülüdür. JSON gibi harici veri kaynaklarına taşımak içerik güncellemelerini kolaylaştırır.
+5. **Erişilebilirlik**: Animasyonlu arka planlar ve drag-drop etkileşimleri için klavye desteği, odak stilleri ve ekran okuyucu açıklamalarını değerlendirin.
+
+## Başlarken
+
+Statik yapısı sayesinde projeyi çalıştırmak için bir web sunucusuna gerek yoktur; dosyaları doğrudan tarayıcıda açabilirsiniz. Yerel geliştirmede canlı yenileme istiyorsanız basit bir HTTP sunucusu (`npx serve`, `python -m http.server` vb.) kullanabilirsiniz.
+
+## Öğrenmeye Devam
+
+- Tailwind bileşenleri ve React tabanlı oyun mantığını inceleyerek diğer derslere yeni etkileşimli içerikler ekleyebilirsiniz.
+- Kelime oyununun seçim algoritmasını veya çarpım oyununun soru üreticisini yeniden kullanarak farklı konular için benzer mini oyunlar türetebilirsiniz.
