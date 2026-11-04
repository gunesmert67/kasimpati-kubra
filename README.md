# 🌸 Kübra İçin Mini Oyun & Sürprizler Portalı

Bu proje, **Kübra**'ya özel olarak tasarlanmış, modüler mimariye sahip romantik bir mini oyun ve interaktif sürpriz web uygulamasıdır.

- **Canlı Adres:** [https://kubra.mertgunes.com](https://kubra.mertgunes.com)
- **Teknoloji:** Saf HTML5, Modern CSS3 (Glassmorphism & Retro Arcade), Vanilla JavaScript (Canvas 2D & Web Audio API). Harici kütüphane veya ağır framework bağımlılığı yoktur; ultra hızlı ve her cihazda anında yüklenir.

---

## 🗺️ Rota ve Modül Haritası

| Rota | Modül Adı | Durum | Açıklama |
| :--- | :--- | :--- | :--- |
| `/` veya `/hub` | **Oyun Portalı (Ana Sayfa)** | 🟢 Canlı | Tüm oyunların ve bölümlerin listelendiği kompakt ana menü. |
| `/kasimpati` | **1. Bölüm: Kasımpatı Hikayesi** | 🟢 Canlı | Canlı filizlenen kasımpatı, kaçan buton ve kalp sürprizi. |
| `/pixel` | **2. Bölüm: 1520 KM Retro Oyun** | 🟢 Canlı | 8-Bit piksel runner. Kübra / Mert karakter seçimi, Iğdır-İstanbul mesafesi ve flörtöz bitiş. |
| `/soru` | **3. Bölüm: Kahve & Tatlı Sözleşmesi** | 🟢 Canlı | TikTok büyüyen Evet / kaçan buton akımı ve date ruleti. |

---

## 📁 Profesyonel Proje Dizin Yapısı

Tüm modüller birbirini bozmayacak şekilde bağımsız klasörlere (self-contained) ayrılmıştır:

```text
kasimpati-kubra/
├── index.html              # ANA SAYFA (Artık Oyun Portalı / Hub)
├── README.md               # Detaylı mimari ve yönetim rehberi
├── push.bat                # Tek tıkla GitHub & Vercel güncelleme betiği
│
├── hub/                    # OYUN PORTALI YEDEĞİ (/hub rotası)
│   └── index.html          # Kompakt oyun seçim kartları
│
├── kasimpati/              # 1. BÖLÜM: KASIMPATI HİKAYESİ
│   ├── index.html          # /kasimpati rotası
│   ├── style.css           # Kasımpatıya özel stiller
│   └── script.js           # SVG büyüme, kaçan buton ve konfeti motoru
│
├── pixel/                  # 2. BÖLÜM: 1520 KM RETRO PİKSEL OYUNU
│   ├── index.html          # /pixel rotası (Self-contained arcade kabineti)
│   ├── style.css           # Arcade retro piksel teması
│   └── game.js             # Canvas 8-bit motoru, engeller ve flörtöz seçenekler
│
└── soru/                   # 3. BÖLÜM: KAHVE & TATLI SÖZLEŞMESİ (TIKTOK KAÇAN BUTON)
    ├── index.html          # /soru rotası (Dikey büyüyen Evet, replikler, date ruleti)
    └── images/             # Yerel animasyonlu GIF'ler (ask.gif, yes.gif)
```

---

## 🎮 Modül Detayları

### 1. Kasımpatı Sürprizi (`/` ve `/kasimpati`)
- **Organik Büyüme:** Sayfa açıldığında tohum filizlenir, organik yapraklar uzar ve 3 kademeli taç yapraklar sırayla açılır.
- **5 Aşamalı Kaçan Buton:**
  1. Tıklama: `"Kaçtım ki! 😜"`
  2. Tıklama: `"Yakalayamazsın ki! 🏃‍♀️"`
  3. Tıklama: `"Hızlı olan kazansın! 💨"`
  4. Tıklama: `"Son bir kez daha dene! 🌸"`
  5. Tıklama: Buton pes eder (`"Tamam tamam teslim oldum, bas bakalım! 💖"`) ve sabit kalır.
- **Final:** 6. tıklamada çiçeğin kalbinden atan büyük bir kalp doğar, konfetiler yağar ve özel sevgi kartı açılır:
  > *"Sana bayılıyorum yicem minnoşumu 🥰"*

### 2. 1520 KM Retro Runner (`/pixel`)
- **İlişki Uyumu:** İstanbul - Iğdır arası 1520 KM mesafe teması.
- **Karakter Seçimi:**
  - **Kübra:** Pembe eşarplı, temiz yüzlü sevimli piksel karakter. Rota: Iğdır ➔ İstanbul.
  - **Mert:** Siyah saçlı piksel karakter. Rota: İstanbul ➔ Iğdır.
- **Oyun Mekaniği:**
  - Zıplayarak uçan kasımpatıları (+10 puan) ve parlayan kalpleri (+25 puan) toplama.
  - Kuş, kedi ve taş engellerinden kaçınma.
  - Her zıplama ve toplanan eşya için 8-bit chiptune ses efektleri (Web Audio API).
- **Final (Fikir 1 - Kahve & Tatlı Borcu):**
  - Mesafe sıfırlandığında ve hedefe varıldığında:
  > *"Tebrikler Kübra! 1520 KM bitti ama Mert'e büyük bir kahve & tatlı borcun var! ☕🍰 Borcu tahsil etmek için görüşmeyi kabul ediyor musun?"*
  - Butona tıklandığında: `"Sözleşme İmzalandı! Mert kahve ve tatlıyı hazırlıyor 🥳"`

### 3. Oyun Portalı (`/hub`)
- iPhone 14 Pro Max ve mobil ekranlara optimize edilmiş dikey oyun kartı düzeni.
- Mevcut oyunlara tek dokunuşla geçiş sağlayan butonlar.
- Yeni eklenecek oyunlar için kilitli `"Yakında Gelecek"` kartları.

---

## 🛠️ Gelecekte Yeni Oyun Ekleme Rehberi

Yeni bir oyun (örneğin bir bilgi yarışması: `/quiz`) eklemek istediğinde:

1. Ana dizinde yeni bir klasör oluştur: `quiz/`
2. İçine oyun dosyalarını koy: `quiz/index.html` (ve gerekiyorsa `style.css`, `script.js`).
3. `hub/index.html` dosyasını aç:
   - `locked-card` olan kartı aktif kart haline getirip linkini `href="/quiz"` yap.
4. Git'e commit atıp pushla. Vercel otomatik olarak `https://kubra.mertgunes.com/quiz` adresini aktif edecektir!

---

## 🔄 Ana Sayfayı Portal (Hub) Yapma Adımı (Zamanı Gelince)

İleride oyun sayısı arttığında ve doğrudan `kubra.mertgunes.com` adresine giren kişinin Kasımpatı yerine **Oyun Merkezi**'ni görmesini istersen sadece şu adımı yapman yeterlidir:

1. `hub/index.html` dosyasının içeriğini kök dizindeki `index.html` dosyasının üzerine kopyala.
2. Artık `kubra.mertgunes.com` doğrudan Hub olur; Kasımpatı ise `kubra.mertgunes.com/kasimpati` adresinden erişilmeye devam eder!
*(Şu anda bu düzen hazırlandı ancak mevcut isteğin üzerine ana sayfa Kasımpatı olarak muhafaza edilmektedir).*

---

## 📱 Cihaz Optimizasyonları

- **iPhone 14 Pro Max & iOS:**
  - `viewport-fit=cover`, `100dvh` (Dynamic Island ve alt home bar çakışmalarını önleyen dinamik viewport).
  - iOS Safari çift tıklama yakınlaştırma (double-tap zoom) engellendi (`touch-action: manipulation`).
  - Sayfa kaydırması oyun içi kontrollerle çakışmaz.
- **Android & Masaüstü:**
  - Otomatik responsive ölçekleme, klavye (Space / Yukarı Ok) desteği ve dokunmatik zıplama butonu.
- **Sosyal Medya & WhatsApp:**
  - Open Graph meta etiketleri yapılandırıldı; link WhatsApp'tan atıldığında özel başlık ve açıklama kartı çıkar.

---

## 🚀 Değişiklikleri Canlıya Alma (Push)

Yapılan değişiklikleri GitHub ve Vercel'e göndermek için terminalde çalıştırman gereken komutlar:

```bash
git add .
git commit -m "feat: pro multi-game portal architecture and docs"
git push origin main
```
Veya klasördeki `push.bat` dosyasına çift tıklayarak tek adımda gönderebilirsin.
