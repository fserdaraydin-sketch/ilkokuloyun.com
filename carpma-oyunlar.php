<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Çarpma oyunları - Bilinmeyen değeri bul, çarpım tablosu ezberle, hızlı çarpma!">
    <title>Çarpma Oyunları - Matematik Eğlencesi</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="bg-animation">
        <div class="butterfly">🦋</div>
        <div class="butterfly">🦋</div>
        <div class="kite">🪁</div>
        <div class="flower">🌸</div>
        <div class="flower">🌼</div>
        <div class="flower">🌷</div>
    </div>

    <div class="container">
        <header>
            <a href="mat.php" class="home-btn">← Matematik Oyunları</a>
            <h1>✖️ Çarpma Oyunları ✖️</h1>
            <p class="subtitle">Çarpım tablosunu eğlenceli oyunlarla keşfet!</p>
        </header>

        <div class="games-grid">

            <!-- Bilinmeyen Değeri Bul -->
            <div class="game-card" onclick="window.open('carpim.php', '_blank')">
                <div class="game-icon">❓</div>
                <h3>Bilinmeyen Değeri Bul</h3>
                <p>Eksik sayıyı bul, puan kazan!</p>
            </div>

            <!-- Çarpım Tablosu Ezberle -->
           <div class="game-card" onclick="window.open('carpim-ezber.php', '_blank')">
  <div class="game-icon">🧮</div>
  <h3>Çarpım Tablosu Ezberle</h3>
  <p>Çarpım tablosunu adım adım öğren!</p>
</div>

            <!-- Hızlı Çarpma -->
            <div class="game-card" onclick="alert('Hızlı çarpma oyunu yakında eklenecek!')">
                <div class="game-icon">⚡</div>
                <h3>Hızlı Çarpma</h3>
                <p>Zamana karşı yarış, doğru cevapları topla!</p>
            </div>

        </div>

        <div class="footer">
            <p>✨ Çarpmayı eğlenerek öğren! ✨</p>
        </div>
    </div>
</body>
</html>
