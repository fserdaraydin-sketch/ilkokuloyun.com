/* ============================================================
   ilkokuloyun.com — Analitik Katmanı
   ------------------------------------------------------------
   Sağlayıcıdan bağımsız ince katman.
   Sağlayıcı değişirse SADECE bu dosya düzenlenir, sayfalar değil.

   Toplanan: hangi oyun, hangi aşama, ne kadar süre.
   Toplanmayan: hiçbir kişisel veri. Çerez yok, localStorage yok.
   ============================================================ */
(function () {
  'use strict';

  // ---- AYAR ----
  var CONFIG = {
    provider: 'umami',
    websiteId: 'e732cfc5-5a1d-47b3-90ca-5c6872724174',
    src: 'https://cloud.umami.is/script.js',
    enabled: true
  };

  // Yerel geliştirme / önizlemede ölçüm yapma
  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '' || location.protocol === 'file:') {
    CONFIG.enabled = false;
  }

  // "Beni izleme" tercihine saygı göster
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl) {
    CONFIG.enabled = false;
  }

  // ---- SAĞLAYICI YÜKLEME ----
  if (CONFIG.enabled && CONFIG.websiteId) {
    var s = document.createElement('script');
    s.defer = true;
    s.src = CONFIG.src;
    s.setAttribute('data-website-id', CONFIG.websiteId);
    document.head.appendChild(s);
  }

  // Sağlayıcı yüklenene kadar olayları kuyrukta tut
  var queue = [];
  function send(name, data) {
    if (!CONFIG.enabled) return;
    if (window.umami && typeof window.umami.track === 'function') {
      try { window.umami.track(name, data || {}); } catch (e) {}
    } else {
      queue.push([name, data]);
      if (queue.length > 40) queue.shift();
    }
  }
  var flushTimer = setInterval(function () {
    if (window.umami && typeof window.umami.track === 'function') {
      clearInterval(flushTimer);
      while (queue.length) {
        var q = queue.shift();
        try { window.umami.track(q[0], q[1] || {}); } catch (e) {}
      }
    }
  }, 400);
  setTimeout(function () { clearInterval(flushTimer); }, 15000);

  // ---- SAYFADAN OYUN KİMLİĞİ ÇIKAR ----
  var file = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  function sinifBul(f) {
    var m = f.match(/grade-?(\d)/) || f.match(/grade(\d)/);
    if (m) return m[1] + '. sınıf';
    if (/^eglence/.test(f)) return 'eğlence';
    return 'genel';
  }
  function dersBul(f) {
    // Sıra önemli: dar kalıplar önce. ("ing" kalıbı "drawing"/"tracing" ile
    // çakıştığı için İngilizce testi tam ad eşleşmesiyle yapılır.)
    if (/ayna|oruntu|eglence/.test(f)) return 'eğlence';
    if (/motor|line|wave|shape|letter|cizgi/.test(f)) return 'motor beceri';
    if (/math|sayilar|toplama|carpma|carpim|kesirler|geometri|olcme|^mat$/.test(f)) return 'matematik';
    if (/turkce|turkish|kelime|deyim|noktalama|yazim|hece|cumle|^trk$/.test(f)) return 'türkçe';
    if (/science|^fen$|hayat/.test(f)) return 'fen';
    if (/english|^ing$/.test(f)) return 'i̇ngilizce';
    return 'diğer';
  }

  var OYUN = {
    id: file,
    sinif: sinifBul(file),
    ders: dersBul(file)
  };

  // ---- DURUM ----
  var basladi = Date.now();
  var sonAsama = null;      // en son görülen aşama adı
  var asamaSayisi = 0;      // tamamlanan aşama
  var soruSayisi = 0;       // cevaplanan soru
  var dogruSayisi = 0;
  var kapanisGonderildi = false;

  function saniye() {
    return Math.round((Date.now() - basladi) / 1000);
  }

  // ---- GENEL API ----
  window.IO = {
    // Oyun açıldı
    oyunBasladi: function (ekstra) {
      send('oyun-basladi', Object.assign({
        oyun: OYUN.id, sinif: OYUN.sinif, ders: OYUN.ders
      }, ekstra || {}));
    },

    // Bir aşamaya/seviyeye geçildi
    asama: function (ad, no) {
      sonAsama = ad;
      send('asama-acildi', {
        oyun: OYUN.id, ders: OYUN.ders, asama: ad, asama_no: no
      });
    },

    // Soru cevaplandı
    cevap: function (dogruMu, asamaAd) {
      soruSayisi++;
      if (dogruMu) dogruSayisi++;
      if (asamaAd) sonAsama = asamaAd;
      // Her soruyu ayrı göndermek gürültü yapar; 5'te bir özet gönder
      if (soruSayisi % 5 === 0) {
        send('soru-ilerleme', {
          oyun: OYUN.id, ders: OYUN.ders, asama: sonAsama,
          soru: soruSayisi, dogru: dogruSayisi
        });
      }
    },

    // Bir aşama tamamlandı
    asamaTamam: function (ad, no) {
      asamaSayisi++;
      send('asama-tamamlandi', {
        oyun: OYUN.id, ders: OYUN.ders, asama: ad, asama_no: no, sure_sn: saniye()
      });
    },

    // Oyun bitti
    oyunBitti: function (puan) {
      send('oyun-bitti', {
        oyun: OYUN.id, ders: OYUN.ders,
        puan: puan, sure_sn: saniye(), asama: asamaSayisi
      });
      kapanisGonderildi = true;
    },

    // Serbest olay
    olay: function (ad, veri) { send(ad, veri); }
  };

  // ---- TERK NOKTASI (en değerli veri) ----
  // Çocuk oyunu nerede bıraktı? O aşama fazla zor olabilir.
  function kapanis() {
    if (kapanisGonderildi) return;
    kapanisGonderildi = true;
    var sn = saniye();
    if (sn < 3) return;  // sayfaya yanlışlıkla girip çıkma, sayma
    send('ayrildi', {
      oyun: OYUN.id, ders: OYUN.ders,
      asama: sonAsama || 'baslangic',
      sure_sn: sn, soru: soruSayisi, dogru: dogruSayisi
    });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') kapanis();
  });
  window.addEventListener('pagehide', kapanis);

  // ---- OTOMATİK BAŞLANGIÇ ----
  // Oyun sayfalarında otomatik "oyun başladı" gönder (menü sayfaları hariç)
  var menuSayfasi = /^(index|grade-\d-index|grade-\d-(math|turkish|science|english|motor)|eglence-index)$/.test(file);
  if (!menuSayfasi) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { window.IO.oyunBasladi(); });
    } else {
      window.IO.oyunBasladi();
    }
  }
})();
