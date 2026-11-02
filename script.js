// Kasımpatı Hikayesi - Kübra İçin Özel Etkileşim Scripti (Gelişmiş & Bug'sız Sürüm)

document.addEventListener('DOMContentLoaded', () => {
  // Element referansları
  const starsContainer = document.getElementById('starsContainer');
  const statusText = document.getElementById('statusText');
  const stem = document.getElementById('stem');
  const leaves = document.querySelectorAll('.leaf');
  const calyxGroup = document.getElementById('calyxGroup');
  const flowerHead = document.getElementById('flowerHead');
  const flowerCenter = document.getElementById('flowerCenter');
  const flowerHeartGroup = document.getElementById('flowerHeartGroup');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const btnText = surpriseBtn.querySelector('.btn-text');
  const loveCard = document.getElementById('loveCard');
  const replayBtn = document.getElementById('replayBtn');
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  // Katman referansları
  const layerOuter = document.getElementById('layerOuter');
  const layerMid = document.getElementById('layerMid');
  const layerInner = document.getElementById('layerInner');

  // Durum Değişkenleri
  let clickCount = 0;
  let isClickLocked = false;
  let animationFinished = false;

  // 1. Yıldızları Sakin ve Zarif Şekilde Oluştur
  function createStars() {
    starsContainer.innerHTML = '';
    const starCount = window.innerWidth < 600 ? 28 : 50;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 3}s`);
      star.style.animationDelay = `${Math.random() * 4}s`;
      starsContainer.appendChild(star);
    }
  }

  // 2. Kasımpatı Taç Yapraklarını Dinamik Üret (%25 Büyütülmüş Ebatlar)
  function buildChrysanthemumPetals() {
    layerOuter.innerHTML = '';
    layerMid.innerHTML = '';
    layerInner.innerHTML = '';

    // Katman 1: Dış Katman (%25 daha uzun ve dolgun: len 115)
    const countOuter = 32;
    for (let i = 0; i < countOuter; i++) {
      const angle = (360 / countOuter) * i + (Math.random() * 3 - 1.5);
      const len = 114 + Math.random() * 8;
      const rx = 11.5;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', `M 0 0 C -${rx} -${len * 0.35}, -${rx * 1.15} -${len * 0.8}, 0 -${len} C ${rx * 1.15} -${len * 0.8}, ${rx} -${len * 0.35}, 0 0 Z`);
      petal.setAttribute('fill', 'url(#petalOuterGrad)');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--angle', `${angle}deg`);
      layerOuter.appendChild(petal);
    }

    // Katman 2: Orta Katman (len 90)
    const countMid = 26;
    for (let i = 0; i < countMid; i++) {
      const angle = (360 / countMid) * i + 7 + (Math.random() * 2 - 1);
      const len = 88 + Math.random() * 6;
      const rx = 9.8;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', `M 0 0 C -${rx} -${len * 0.35}, -${rx * 1.1} -${len * 0.8}, 0 -${len} C ${rx * 1.1} -${len * 0.8}, ${rx} -${len * 0.35}, 0 0 Z`);
      petal.setAttribute('fill', 'url(#petalMidGrad)');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--angle', `${angle}deg`);
      layerMid.appendChild(petal);
    }

    // Katman 3: İç Katman (len 64)
    const countInner = 20;
    for (let i = 0; i < countInner; i++) {
      const angle = (360 / countInner) * i + 12;
      const len = 62 + Math.random() * 5;
      const rx = 8.2;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', `M 0 0 C -${rx} -${len * 0.35}, -${rx * 1.05} -${len * 0.8}, 0 -${len} C ${rx * 1.05} -${len * 0.8}, ${rx} -${len * 0.35}, 0 0 Z`);
      petal.setAttribute('fill', 'url(#petalInnerGrad)');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--angle', `${angle}deg`);
      layerInner.appendChild(petal);
    }

    // Göbek boyutunu da %25 büyüt
    flowerCenter.setAttribute('r', '26');
  }

  // 3. Çiçeğin Büyüme ve Açma Animasyonu (%50 Daha Yavaş, Şiirsel & Okunabilir)
  function startGrowthAnimation() {
    // Sıfırlama
    stem.classList.remove('grow');
    leaves.forEach(l => l.classList.remove('unfurl'));
    calyxGroup.classList.remove('show');
    flowerCenter.classList.remove('bloom');
    flowerHeartGroup.classList.remove('show');
    flowerHead.classList.remove('sway');
    surpriseBtn.classList.remove('ready', 'catchable');
    surpriseBtn.style.transform = '';
    surpriseBtn.style.opacity = '0';
    surpriseBtn.style.pointerEvents = 'none';
    clickCount = 0;
    isClickLocked = false;
    animationFinished = false;

    // Tüm petalleri kapat
    document.querySelectorAll('.petal').forEach(p => p.classList.remove('bloom'));

    statusText.textContent = 'Topraktan bir kasımpatı filizi doğuyor... 🌱';

    // 1. Aşama: Gövde ağır ağır uzar (0.8s)
    setTimeout(() => {
      stem.classList.add('grow');
    }, 800);

    // 2. Aşama: Yapraklar sırayla dallanır
    setTimeout(() => leaves[0]?.classList.add('unfurl'), 2200);
    setTimeout(() => leaves[1]?.classList.add('unfurl'), 3400);
    setTimeout(() => leaves[2]?.classList.add('unfurl'), 4400);

    // 3. Aşama: Tomurcuk belirir (4.8s)
    setTimeout(() => {
      calyxGroup.classList.add('show');
      statusText.textContent = 'Tomurcuk güneşe doğru uzanıyor... ✨';
    }, 4800);

    // 4. Aşama: Dış yapraklar yavaşça açar (7.4s)
    setTimeout(() => {
      statusText.textContent = 'Kasımpatı yapraklarını usulca açıyor... 🌸';
      const outerPetals = layerOuter.querySelectorAll('.petal');
      outerPetals.forEach((p, idx) => {
        setTimeout(() => p.classList.add('bloom'), idx * 55);
      });
    }, 7400);

    // 5. Aşama: Orta yapraklar açılır (10.4s)
    setTimeout(() => {
      statusText.textContent = 'Her yaprağında sevgi filizleniyor... ✨';
      const midPetals = layerMid.querySelectorAll('.petal');
      midPetals.forEach((p, idx) => {
        setTimeout(() => p.classList.add('bloom'), idx * 50);
      });
    }, 10400);

    // 6. Aşama: İç yapraklar ve altın göbek açılır (13.2s)
    setTimeout(() => {
      statusText.textContent = 'Altın sarısı kalbi güneşe kavuştu... 🌼';
      const innerPetals = layerInner.querySelectorAll('.petal');
      innerPetals.forEach((p, idx) => {
        setTimeout(() => p.classList.add('bloom'), idx * 45);
      });
      setTimeout(() => {
        flowerCenter.classList.add('bloom');
      }, 500);
    }, 13200);

    // 7. Aşama: Çiçek açması bitti! Sabit kalır ve hafifçe salınır (16.2s)
    setTimeout(() => {
      statusText.textContent = 'Kasımpatın tüm zarafetiyle açtı 🌼';
      flowerHead.classList.add('sway');
      animationFinished = true;
    }, 16200);

    // 8. Aşama: Buton Zarafetle Sahneye Gelir (18.6s)
    setTimeout(() => {
      statusText.textContent = 'Senin için küçük bir sürpriz belirdi... 👇';
      surpriseBtn.classList.add('ready');
      surpriseBtn.style.opacity = '1';
      surpriseBtn.style.pointerEvents = 'auto';
      btnText.textContent = 'Sürpriz için butona bas ✨';
    }, 18600);
  }

  // 4. BUTON KAÇMA MEKANİZMASI (Kesinlikle Bug'sız & Neredeyse Orada Sabit Kalır!)
  surpriseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!animationFinished) return;
    if (isClickLocked) return;

    // Hızlı çift tıklamaları önlemek için 300ms kilit
    isClickLocked = true;
    setTimeout(() => {
      isClickLocked = false;
    }, 320);

    clickCount++;

    if (clickCount === 1) {
      // 1. TIKLAMA: YUKARI KAÇ
      const isMobile = window.innerWidth < 480;
      const upX = isMobile ? -25 : -35;
      const upY = isMobile ? -110 : -135;
      surpriseBtn.style.transform = `translate(${upX}px, ${upY}px)`;
      btnText.textContent = 'Hop! Kaçtım ki 🙈';
      statusText.textContent = 'Yakalayamazsın ki...';
    } 
    else if (clickCount === 2) {
      // 2. TIKLAMA: YANA / SAĞA KAÇ
      const isMobile = window.innerWidth < 480;
      const sideX = isMobile ? 75 : 110;
      const sideY = isMobile ? -45 : -55;
      surpriseBtn.style.transform = `translate(${sideX}px, ${sideY}px)`;
      btnText.textContent = 'Aaa yine kaçtım! 🏃‍♀️💨';
      statusText.textContent = 'Biraz daha hızlı olman lazım...';
    } 
    else if (clickCount === 3) {
      // 3. TIKLAMA: ALTA KAÇ VE NEREDEYSE ORADA SABİT KAL! (Geri merkeze çekilmez!)
      const isMobile = window.innerWidth < 480;
      const downX = isMobile ? -50 : -70;
      const downY = isMobile ? 35 : 45;
      
      surpriseBtn.style.transform = `translate(${downX}px, ${downY}px)`;
      surpriseBtn.classList.add('catchable');
      btnText.textContent = 'Tamam yakaladın, bas bakalım 💖';
      statusText.textContent = 'Sonunda teslim oldum... 🥰';
    } 
    else if (clickCount >= 4) {
      // 4. TIKLAMA: OLDUĞU YERDE BASILIR VE BÜYÜK SÜRPRİZ PATLAR!
      triggerFinalSurprise();
    }
  });

  // 5. Dördüncü Tıklamada Sürpriz Patlaması (Kalp & Aşk Mesajı)
  function triggerFinalSurprise() {
    // Butonu olduğu yerde zarafetle kaybet
    surpriseBtn.style.transform += ' scale(0)';
    surpriseBtn.style.opacity = '0';
    surpriseBtn.style.pointerEvents = 'none';

    statusText.textContent = 'Kasımpatının kalbinde sana bir şey var... ❤️';

    // 1. Kasımpatı çiçeğinin ortasından KALP BÜYÜR VE ATAR
    setTimeout(() => {
      flowerHeartGroup.classList.add('show');
    }, 350);

    // 2. Parçacık konfeti & çiçekler
    launchConfettiAndHearts();

    // 3. Sevgi Kartı Açılsın
    setTimeout(() => {
      loveCard.classList.add('visible');
    }, 1200);
  }

  // 6. Konfeti ve Çiçek Yağmuru
  let particles = [];
  let isRaining = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y) {
      this.x = x || canvas.width / 2;
      this.y = y || canvas.height * 0.35;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2.5;
      this.gravity = 0.12;
      this.size = Math.random() * 7 + 5;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.opacity = 1;
      this.decay = Math.random() * 0.006 + 0.003;
      this.type = Math.random() > 0.45 ? 'heart' : 'confetti';
      const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.985;
      this.rotation += this.rotSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size * 1.4}px sans-serif`;
        ctx.fillText('🌸', -this.size / 2, this.size / 2);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  function launchConfettiAndHearts() {
    isRaining = true;
    for (let i = 0; i < 75; i++) {
      particles.push(new Particle(canvas.width / 2, canvas.height * 0.35));
    }

    let rainInterval = setInterval(() => {
      if (!isRaining) {
        clearInterval(rainInterval);
        return;
      }
      if (particles.length < 100) {
        const p = new Particle(Math.random() * canvas.width, -10);
        p.vy = Math.random() * 2 + 1.2;
        p.vx = (Math.random() - 0.5) * 1.5;
        particles.push(p);
      }
    }, 220);

    setTimeout(() => {
      isRaining = false;
    }, 8000);

    animateParticles();
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].opacity <= 0 || particles[i].y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0 || isRaining) {
      requestAnimationFrame(animateParticles);
    }
  }

  // 7. Yeniden Oynat
  replayBtn.addEventListener('click', () => {
    loveCard.classList.remove('visible');
    particles = [];
    isRaining = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setTimeout(() => {
      startGrowthAnimation();
    }, 400);
  });

  // Başlat
  createStars();
  buildChrysanthemumPetals();
  startGrowthAnimation();
});
