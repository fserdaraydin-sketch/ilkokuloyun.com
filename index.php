<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="İlkokul öğrencileri için eğlenceli ve eğitici oyunlar. Matematik, Fen, Türkçe, İngilizce ve Hayat Bilgisi oyunları ile öğrenmenin keyfini çıkarın!">
    <title>İlkokulOyun.com - Eğlenerek Öğren</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="bg-animation">
        <div class="butterfly">🦋</div>
        <div class="butterfly">🦋</div>
        <div class="butterfly">🦋</div>
        <div class="butterfly">🦋</div>
        <div class="kite">🪁</div>
        <div class="kite">🪁</div>
        <div class="kite">🪁</div>
        <div class="flower">🌸</div>
        <div class="flower">🌼</div>
        <div class="flower">🌺</div>
        <div class="flower">🌻</div>
        <div class="flower">🌷</div>
        <div class="flower">🌹</div>
    </div>

    <div class="container">
        <header>
            <h1>🎮 Eğlenerek Öğren! 🎮</h1>
            <p class="subtitle">Oyun oynayarak öğrenmenin keyfini çıkar!</p>
        </header>

        <div class="categories">
            <div class="category-card math" onclick="goToCategory('matematik')">
                <div class="icon">🔢</div>
                <h2>Matematik</h2>
                <p>Sayılarla oyna, matematik öğren! Toplama, çıkarma ve daha fazlası...</p>
                <span class="game-count">Oyunlara Git →</span>
            </div>

            <div class="category-card science" onclick="goToCategory('fen')">
                <div class="icon">🔬</div>
                <h2>Fen Bilimleri</h2>
                <p>Doğayı keşfet, bilimi öğren! Hayvanlar, bitkiler ve deney zamanı!</p>
                <span class="game-count">Oyunlara Git →</span>
            </div>

            <div class="category-card turkish" onclick="goToCategory('turkce')">
                <div class="icon">📚</div>
                <h2>Türkçe</h2>
                <p>Kelimelerle oyna, okumayı öğren! Harfler, kelimeler ve hikayeler!</p>
                <span class="game-count">Oyunlara Git →</span>
            </div>

            <div class="category-card english" onclick="goToCategory('ingilizce')">
                <div class="icon">🌍</div>
                <h2>İngilizce</h2>
                <p>Yeni bir dil öğren! İngilizce kelimeler, renkler ve sayılar!</p>
                <span class="game-count">Oyunlara Git →</span>
            </div>

            <div class="category-card life" onclick="goToCategory('hayatbilgisi')">
                <div class="icon">🌈</div>
                <h2>Hayat Bilgisi</h2>
                <p>Hayatı keşfet! Meslek, aile, sağlık ve çevremizi tanıyalım!</p>
                <span class="game-count">Oyunlara Git →</span>
            </div>
        </div>

        <div class="footer">
            <p>✨ Her gün yeni bir şeyler öğren! ✨</p>
        </div>
    </div>

    <script>
        function goToCategory(category) {
            const pages = {
                'matematik': 'mat.php',
                'fen': 'fen.php',
                'turkce': 'trk.php',
                'ingilizce': 'ing.php',
                'hayatbilgisi': 'hayat.php'
            };
            window.location.href = pages[category];
        }

        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', function(e) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    </script>
</body>
</html>