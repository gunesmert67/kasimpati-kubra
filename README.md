# 🌸 Kübra İçin Kasımpatı Sürpriz Web Sitesi

Bu proje, Kübra'ya özel olarak hazırlanmış interaktif bir web sitesidir.
Saf HTML, CSS ve JavaScript kullanılarak sıfırdan geliştirilmiştir; herhangi bir harici kütüphane kurulumu gerektirmez.

---

## 🌺 Özellikler
1. **Canlı Kasımpatı Büyümesi**:
   - Siteye girildiğinde tohumdan yeşil gövde uzar.
   - Yapraklar organik olarak sırayla açılır.
   - 3 kademeli (dış, orta, iç) kasımpatı taç yaprakları sırayla güneşe açar.
   - Çiçek açtıktan sonra sabit kalır ve hafif bir rüzgar salınımıyla canlılığını korur.
2. **Kaçan Sürpriz Buton**:
   - Çiçek açtıktan sonra *"Sürpriz için butona bas ✨"* butonu belirir.
   - 1., 2. ve 3. denemelerde buton komik mesajlarla ekranda kaçar / yer değiştirir.
   - 4. denemede buton teslim olur (`"Tamam teslim oldum, tıkla bakalım! 💖"`).
3. **Kalp ve Sevgi Mesajı**:
   - 4. tıklamada kasımpatının tam merkezinden atan parlak bir kalp doğar.
   - Konfeti ve kalp yağmuru başlar.
   - Sevgi kartı açılır: **"Sana bayılıyorum yicem minnoşumu 🥰"**

---

## 🚀 GitHub'a Gönderme (Push) Adımları

Terminal veya PowerShell'de bu klasörün içindeyken şu komutları çalıştır:

```bash
# 1. Git'i başlat
git init

# 2. Dosyaları ekle ve ilk commiti at
git add .
git commit -m "feat: kasimpati surprizi kubra icin hazirlandi"

# 3. Ana dalı main yap
git branch -M main

# 4. GitHub'da oluşturduğun boş deponun (repo) adresini ekle
# (Örnek: https://github.com/KULLANICI_ADIN/kasimpati-kubra.git)
git remote add origin SENIN_GITHUB_REPO_LINKIN

# 5. GitHub'a gönder
git push -u origin main
```

---

## 🌐 Vercel'de Yayınlama Adımları

1. [vercel.com](https://vercel.com) adresine git ve GitHub hesabınla giriş yap.
2. **"Add New..."** -> **"Project"** butonuna tıkla.
3. GitHub deponu (`kasimpati-kubra`) seç ve **Import** de.
4. **Build and Output Settings** ayarlarını değiştirmene gerek yoktur (saf HTML/CSS/JS projesidir).
5. **Deploy** butonuna tıkla.
6. 10 saniye içinde siten canlıya alınır ve Kübra'ya atabileceğin özel link (örn: `kasimpati-kubra.vercel.app`) hazır olur! 🎉
