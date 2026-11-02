// Kasımpatı Hikayesi - Kübra İçin Özel Etkileşim Scripti

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
  let isReadyForFinalClick = false;
  let animationFinished = false;

  // 1. Yıldızları Oluştur
  function createStars() {
    starsContainer.innerHTML = '';
    const starCount = window.innerWidth < 600 ? 30 : 55;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  }

  // 2. Kasımpatı Taç Yapraklarını Dinamik Üret
  function buildChrysanthemumPetals() {
    layerOuter.innerHTML = '';
    layerMid.innerHTML = '';
    layerInner.innerHTML = '';

    // Katman 1: Dış Katman
    const countOuter = 30;
    for (let i = 0; i < countOuter; i++) {
      const angle = (360 / countOuter) * i + (Math.random() * 3 - 1.5);
      const len = 92 + Math.random() * 6;
      const rx = 10;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', `M 0 0 C -${rx} -${len * 0.35}, -${rx * 1.15} -${len * 0.8}, 0 -${len} C ${rx * 1.15} -${len * 0.8}, ${rx} -${len * 0.35}, 0 0 Z`);
      petal.setAttribute('fill', 'url(#petalOuterGrad)');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--angle', `${angle}deg`);
      layerOuter.appendChild(petal);
    }

    // Katman 2: Orta Katman
    const countMid = 24;
    for (let i = 0; i < countMid; i++) {
      const angle = (360 / countMid) * i + 8 + (Math.random() * 2 - 1);
      const len = 72 + Math.random() * 5;
      const rx = 8.5;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', `M 0 0 C -${rx} -${len * 0.35}, -${rx * 1.1} -${len * 0.8}, 0 -${len} C ${rx * 1.1} -${len * 0.8}, ${rx} -${len * 0.35}, 0 0 Z`);
      petal.setAttribute('fill', 'url(#petalMidGrad)');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--angle', `${angle}deg`);
      layerMid.appendChild(petal);
    }

    // Katman 3: İç Katman
    const countInner = 18;
    for (let i = 0; i < countInner; i++) {
      const angle = (360 / countInner) * i + 14;
      const len = 50 + Math.random() * 4;
      const rx = 7;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      petal.setAttribute('d', `M 0 0 C -${rx} -${len * 0.35}, -${rx * 1.05} -${len * 0.8}, 0 -${len} C ${rx * 1.05} -${len * 0.8}, ${rx} -${len * 0.35}, 0 0 Z`);
      petal.setAttribute('fill', 'url(#petalInnerGrad)');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--angle', `${angle}deg`);
      layerInner.appendChild(petal);
    }
  }

  // 3. Çiçeğin Büyüme ve Açma Animasyonu
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
    clickCount = 0;
    isReadyForFinalClick = false;
    animationFinished = false;

    // Tüm petalleri kapat
    document.querySelectorAll('.petal').forEach(p => p.classList.remove('bloom'));

    statusText.textContent = 'Topraktan bir kasımpatı filizi doğuyor... 🌱';

    // 1. Aşama: Gövde uzar (0.4s)
    setTimeout(() => {
      stem.classList.add('grow');
    }, 400);

    // 2. Aşama: Yapraklar açılır (1s - 2s)
    setTimeout(() => leaves[0]?.classList.add('unfurl'), 1000);
    setTimeout(() => leaves[1]?.classList.add('unfurl'), 1500);
    setTimeout(() => leaves[2]?.classList.add('unfurl'), 1900);

    // 3. Aşama: Tomurcuk belirir (2.2s)
    setTimeout(() => {
      calyxGroup.classList.add('show');
      statusText.textContent = 'Tomurcuk olgunlaşıyor... ✨';
    }, 2200);

    // 4. Aşama: Dış yapraklar sırayla açmaya başlar (2.6s)
    setTimeout(() => {
      statusText.textContent = 'Kasımpatı yapraklarını güneşe açıyor... 🌸';
      const outerPetals = layerOuter.querySelectorAll('.petal');
      outerPetals.forEach((p, idx) => {
        setTimeout(() => p.classList.add('bloom'), idx * 30);
      });
    }, 2600);

    // 5. Aşama: Orta yapraklar açılır (3.3s)
    setTimeout(() => {
      const midPetals = layerMid.querySelectorAll('.petal');
      midPetals.forEach((p, idx) => {
        setTimeout(() => p.classList.add('bloom'), idx * 28);
      });
    }, 3300);

    // 6. Aşama: İç yapraklar ve altın göbek açılır (3.8s)
    setTimeout(() => {
      const innerPetals = layerInner.querySelectorAll('.petal');
      innerPetals.forEach((p, idx) => {
        setTimeout(() => p.classList.add('bloom'), idx * 25);
      });
      setTimeout(() => {
        flowerCenter.classList.add('bloom');
      }, 300);
    }, 3800);

    // 7. Aşama: Çiçek açması bitti! Sabit kalır ve hafifçe salınır (4.6s)
    setTimeout(() => {
      statusText.textContent = 'Kasımpatın tüm zarafetiyle açtı 🌼';
      flowerHead.classList.add('sway');
      animationFinished = true;
    }, 4600);

    // 8. Aşama: Buton Zarafetle Sahneye Gelir (5.2s)
    setTimeout(() => {
      statusText.textContent = 'Senin için küçük bir sürpriz belirdi...';
      surpriseBtn.classList.add('ready');
      btnText.textContent = 'Sürpriz için butona bas ✨';
    }, 5200);
  }

  // 4. Butona Basınca Kaçma Mantığı (1: Yukarı, 2: Yana/Ortaya, 3: Alta, 4: Basılır)
  surpriseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!animationFinished) return;

    // 4. Tıklama: Final Sürprizi!
    if (isReadyForFinalClick) {
      triggerFinalSurprise();
      return;
    }

    clickCount++;

    if (clickCount === 1) {
      // 1. Tıklamada: YUKARI KAÇ
      const isMobile = window.innerWidth < 480;
      const upY = isMobile ? -110 : -140;
      const upX = isMobile ? -25 : -35;
      surpriseBtn.style.transform = `translate(${upX}px, ${upY}px)`;
      btnText.textContent = 'Hop! Kaçtım ki 🙈';
      statusText.textContent = 'Yakalayamazsın ki...';
    } 
    else if (clickCount === 2) {
      // 2. Tıklamada: ORTAYA / SAĞA KAÇ
      const isMobile = window.innerWidth < 480;
      const sideX = isMobile ? 80 : 120;
      const sideY = isMobile ? -45 : -60;
      surpriseBtn.style.transform = `translate(${sideX}px, ${sideY}px)`;
      btnText.textContent = 'Aaa yine kaçtım! 🏃‍♀️💨';
      statusText.textContent = 'Biraz daha hızlı olman lazım...';
    } 
    else if (clickCount === 3) {
      // 3. Tıklamada: ALTA KAÇ
      const isMobile = window.innerWidth < 480;
      const downX = isMobile ? -50 : -75;
      const downY = isMobile ? 35 : 45;
      surpriseBtn.style.transform = `translate(${downX}px, ${downY}px)`;
      btnText.textContent = 'Son bir şans daha veriyorum hadi! 🤭';
      statusText.textContent = 'Hadi son kez dene...';

      // 3. kaçıştan 500ms sonra merkeze gelip teslim olur
      setTimeout(() => {
        isReadyForFinalClick = true;
        surpriseBtn.classList.add('catchable');
        surpriseBtn.style.transform = 'translate(0px, 0px)';
        btnText.textContent = 'Tamam teslim oldum, bas bakalım 💖';
        statusText.textContent = 'Artık kaçmayacağım...';
      }, 550);
    }
  });

  // 5. Dördüncü Tıklamada Sürpriz Patlaması (Kalp & Aşk Mesajı)
  function triggerFinalSurprise() {
    // Butonu zarafetle kaybet
    surpriseBtn.style.transform = 'scale(0)';
    surpriseBtn.style.opacity = '0';
    statusText.textContent = 'Kasımpatının kalbinde sana bir şey var... ❤️';

    // 1. Kasımpatı çiçeğinin ortasından KALP BÜYÜR VE ATAR
    setTimeout(() => {
      flowerHeartGroup.classList.add('show');
    }, 350);

    // 2. Parçacık konfeti & kalpler
    launchConfettiAndHearts();

    // 3. Sevgi Kartı Açılsın
    setTimeout(() => {
      loveCard.classList.add('visible');
    }, 1300);
  }

  // 6. Konfeti ve Kalp Yağmuru (Zarif ve Hafif)
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
