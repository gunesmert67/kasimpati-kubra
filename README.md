# 🌸 Kübra İçin Mini Oyun & Sürprizler Portalı

Bu proje, **Kübra**'ya özel olarak tasarlanmış, sıfır harici bağımlılığa sahip ultra hızlı, modüler ve güvenli romantik bir mini oyun ve interaktif sürpriz web portalıdır.

- **Canlı Adres:** [https://kubra.mertgunes.com](https://kubra.mertgunes.com)
- **Teknoloji Yığını:** Saf HTML5, Modern CSS3 (Glassmorphism & Retro 8-Bit Arcade), Vanilla JavaScript (Canvas 2D & Web Audio API).
- **Altyapı:** Vercel Edge Network & GitHub Actions CI/CD.
- **Güvenlik:** Strict CSP, OWASP & CVE güvenlik başlıkları, sıfır harici paket riski.

---

## 🗺️ Rota ve Bölüm Haritası

| Rota | Bölüm Adı | Durum | Açıklama |
| :--- | :--- | :--- | :--- |
| `/` | **Ana Sayfa / Oyun Merkezi** | 🟢 Canlı | Tüm bölümlerin listelendiği kompakt modern cam arayüz. |
| `/hub` | **Hub Yedek Rotası** | 🟢 Canlı | Ana sayfayla senkronize çalışan doğrudan menü rotası. |
| `/kasimpati` | **1. Bölüm: Kasımpatı** | 🟢 Canlı | Tohumdan filizlenen SVG kasımpatı, kaçan buton ve kalp kartı. |
| `/pixel` | **2. Bölüm: Retro 8-Bit** | 🟢 Canlı | İstanbul ➔ Iğdır 8-bit runner. Çoklu dokunmatik kontroller ve flörtöz bitiş. |
| `/soru` | **3. Bölüm: Küçük Bir Soru** | 🟢 Canlı | Sürekli süzülen kaçak Hayır butonu, üste doğru devleşen Evet ve Date Ruleti. |
| `/` (Yakında) | **4. Bölüm: Sürpriz** | 🔒 Kilitli | Gelecekte eklenecek yeni sürprizler için rezerve bölüm. |

---

## 📁 Detaylı Proje ve Klasör Mimarisi

Her bölüm kendi stilleri ve mantığı ile bağımsız (self-contained) çalışacak şekilde izole edilmiştir:

```text
kasimpati-kubra/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD otomatik test ve denetim iş akışı
│
├── tests/
│   └── test_audit.py          # Routing, DOM bağlantıları, JS sözdizimi ve CVE testleri
│
├── vercel.json                # Vercel temiz yönlendirme ve OWASP/CVE güvenlik başlıkları
├── index.html                 # KÖK ANA SAYFA: Modern Kompakt Oyun Portalı
├── push.bat                   # Tek tıkla yerel ortamdan GitHub'a pushlama betiği
├── README.md                  # Kapsamlı mimari ve dokümantasyon rehberi
│
├── hub/                       # OYUN PORTALI YEDEĞİ
│   └── index.html             # /hub rotası (index.html ile birebir senkron)
│
├── kasimpati/                 # 1. BÖLÜM: KASIMPATI
│   ├── index.html             # Organik SVG çiçek açma animasyonu & Menü dönüşü
│   ├── style.css              # Çiçek ve kalp animasyon stilleri
│   └── script.js              # Çiçek büyüme, 5 adımlı kaçış ve konfeti motoru
│
├── pixel/                     # 2. BÖLÜM: RETRO 8-BIT RUNNER
│   ├── index.html             # 8-bit arcade kabineti ve tam ekran canvas
│   ├── style.css              # Retro piksel butonlar ve HUD stilleri
│   └── game.js                # Canvas 2D render, chiptune sesler, çoklu dokunma kontrolü
│
└── soru/                      # 3. BÖLÜM: KÜÇÜK BİR SORU (KAHVE & TATLI SÖZLEŞMESİ)
    ├── index.html             # Sürekli hareket eden Hayır, üste devleşen Evet, Date Ruleti
    └── images/
        ├── ask.gif            # Teklif sahnesi sevimli animasyonu
        └── yes.gif            # Kutlama ve sözleşme sahnesi animasyonu
```

---

## 🎮 Bölüm Detayları ve Mekanikler

### 1. Bölüm: Kasımpatı (`/kasimpati`)
- **Organik Büyüme:** Sayfa açılışında tohum topraktan filizlenir; sap, organik yapraklar ve 3 katmanlı kasımpatı taç yaprakları sırayla doğar.
- **5 Aşamalı Kaçan Buton:** Tıklandıkça *"Kaçtım ki! 😜"*, *"Yakalayamazsın ki! 🏃‍♀️"*, *"Hızlı olan kazansın! 💨"*, *"Son bir kez daha dene! 🌸"* replikleriyle yer değiştirir; 5. adımda *"Tamam tamam teslim oldum, bas bakalım! 💖"* diyerek durur.
- **Final:** Ortadan atan büyük bir kalp yükselir, rengarenk konfetiler yağar ve özel not açılır.

### 2. Bölüm: Retro 8-Bit (`/pixel`)
- **Hikaye:** İstanbul ile Iğdır arasındaki 1520 KM mesafe teması.
- **Karakterler:**
  - **Kübra:** Pembe eşarplı sevimli piksel karakter (Iğdır ➔ İstanbul rotası).
  - **Mert:** Siyah saçlı piksel karakter (İstanbul ➔ Iğdır rotası).
- **Kontroller:** İster ekrana dokunulsun, ister **▲ ZIPLA** butonuna, ister klavyede Space/Yukarı Ok tuşlarına basılsın anında başlar ve zıplar.
- **Kavuşma & Flörtöz Ödül:**
  - `☕ KAHVE & TATLI`: *"☕🍰 Borç Yazıldı! En lezzetli kahve ve tatlılar Mert'ten sana söz olsun..."*
  - `💖 SENİ İSTERİM`: *"🥰💖 Ben de seni çok seviyorum/istiyorum minnoşum! Zaten tamamen seninim..."*

### 3. Bölüm: Küçük Bir Soru (`/soru`)
- **Sürekli Canlı Hareket (`floatNo`):** Hayır butonu ekranda sürekli süzülür, durduğu yerde bile canlı ve dinamiktir.
- **Asla Kaybolmayan Hayır (`z-index: 200`):** Evet büyüse bile Hayır onun üstünde kalır, tıklandıkça rastgele güvenli koordinatlara fırlar (*"Kaçtım kii! 😜"*, *"Yakalayamazsın! 🏃‍♀️💨"*, *"Hala kaçıyorum! 🏃‍♀️"*).
- **Üste Doğru Büyüyen Evet:** `transform-origin: bottom center` ile Evet butonu aşağıya veya Hayır'ın üstüne çökmez; **yukarıya doğru (başlık ve görsele doğru)** devleşir.
- **İnteraktif Date Ruleti:** Kutlama ekranında buluşmada ilk ne yeneceğini rastgele seçen mini rulet çarkı.

---

## 🛡️ Güvenlik, CVE ve Kod Kalitesi

Proje, OWASP Top 10 ve modern web güvenlik standartlarına göre sertleştirilmiştir:

1. **Sıfır Harici Paket Bağımlılığı (Zero-Dependency):**
   - NPM paketleri üzerinden gelebilecek Supply Chain CVE riskleri tamamen sıfırdır.
2. **Güvenlik Başlıkları (`vercel.json`):**
   - `Content-Security-Policy`: Sadece projenin kendi kök dizinine ve güvenli Google Fonts kaynaklarına izin verir.
   - `X-Content-Type-Options: nosniff`: MIME-sniffing açıklarını engeller.
   - `X-Frame-Options: SAMEORIGIN`: Clickjacking saldırılarına karşı korur.
   - `Referrer-Policy: strict-origin-when-cross-origin`: Hassas yönlendirme verilerini gizler.
   - `Permissions-Policy`: Kamera, mikrofon ve konum erişimlerini tamamen devre dışı bırakır.
3. **Güvenli DOM Manipülasyonu:**
   - Dışarıdan veya URL parametrelerinden gelen hiçbir kontrolsüz veri `innerHTML` veya `eval` ile işlenmez.
4. **Harici Link Güvenliği:**
   - Tüm harici bağlantılarda `rel="noopener noreferrer"` zorunludur.

---

## 🧪 Otomatik Test Takımı ve CI/CD

Proje, GitHub Actions üzerinde her push ve pull request'te otomatik olarak çalışan kapsamlı bir test suite'e sahiptir:

```bash
# Testleri yerel ortamda çalıştırmak için:
python -m unittest tests/test_audit.py -v
```

### Test Edilen Kriterler:
- ✅ **TestFileExistence:** Tüm sayfaların ve GIF/CSS varlıklarının mevcudiyeti.
- ✅ **TestRoutingAndLinks:** Tüm dahili bağlantıların ve rota yönlendirmelerinin doğruluğu.
- ✅ **TestDomBindings:** JavaScript içindeki tüm `getElementById` referanslarının HTML'de karşılığı olduğu (`null` pointer hatalarına karşı tam koruma).
- ✅ **TestSyntaxAndSecurity:** `eval()` ve `document.write()` kullanımının engellenmesi, süslü parantez ve tırnak dengesi.
- ✅ **TestVercelConfiguration:** `vercel.json` geçerliliği ve güvenlik başlıklarının mevcudiyeti.
- ✅ **TestMobileMetadata:** `viewport-fit=cover`, `100dvh` ve UTF-8 tanımları.

---

## 📱 Cihaz ve Ekran Uyumluluğu

- **iOS / Safari (iPhone 14 Pro Max):**
  - Dynamic Island ve Safe Area insetleri (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
  - `touch-action: manipulation` ile çift tıklama gecikmesi (double-tap delay) engellenmiştir.
- **Android / Chrome & Masaüstü:**
  - Responsive esnek layout, klavye ve dokunmatik ekran tam uyumu.
