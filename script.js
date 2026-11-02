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
  const btnHint = document.getElementById('btnHint');
  const interactiveArea = document.getElementById('interactiveArea');
  const loveCard = document.getElementById('loveCard');
  const replayBtn = document.getElementById('replayBtn');
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  // Katman referansları
  const layerOuter = document.getElementById('layerOuter');
  const layerMid = document.getElementById('layerMid');
  const layerInner = document.getElementById('layerInner');

  // Durum Değişkenleri
  let evadeCount = 0;
  const maxEvades = 3;
  let isReadyForClick = false;
  let animationFinished = false;

  // 1. Yıldızları Oluştur
  function createStars() {
    starsContainer.innerHTML = '';
    const starCount = window.innerWidth < 600 ? 35 : 65;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 1;
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

    // Katman 1: Dış Katman (Geniş, uzun zarif yapraklar)
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
      petal.dataset.index = i;
      layerOuter.appendChild(petal);
    }

    // Katman 2: Orta Katman (Yoğun, canlı şeftali-pembe)
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
      petal.dataset.index = i;
      layerMid.appendChild(petal);
    }

    // Katman 3: İç Katman (Kıvrımlı altın-günbatımı taç yapraklar)
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
      petal.dataset.index = i;
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
    surpriseBtn.classList.remove('ready', 'catchable', 'evading');
    surpriseBtn.style.transform = '';
    btnHint.textContent = '';
    evadeCount = 0;
    isReadyForClick = false;
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

    // 8. Aşama: Buton Sahneye Gelir (5.2s)
    setTimeout(() => {
      statusText.textContent = 'Aşağıda senin için bir sürpriz belirdi! 👇';
      surpriseBtn.classList.add('ready');
      surpriseBtn.querySelector('.btn-text').textContent = 'Sürpriz için butona bas ✨';
      btnHint.textContent = 'Hadi butona dokun 🌸';
    }, 5200);
  }

  // 4. Buton Kaçma / Yer Değiştirme Mantığı (3 Defa Kaçar, 4. de Basılır)
  const evadeMessages = [
    { text: "Hop! Kaçtım ki 😜", hint: "Yakalayamazsın kiii! (1/3)" },
    { text: "Aramızda kalsın çok hızlıyım! 🏃💨", hint: "Kıl payı kaçırdın! (2/3)" },
    { text: "Son bir şans daha veriyorum hadi! 🤭", hint: "Pes etme, az kaldı! (3/3)" }
  ];

  function handleButtonEvade(e) {
    if (!animationFinished) return;
    if (isReadyForClick) return; // 4. aşamada artık kaçmaz

    // Tıklamayı engelle
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (evadeCount < maxEvades) {
      const msg = evadeMessages[evadeCount];
      evadeCount++;

      // Kaçış pozisyonu hesaplama (mobilde ekran dışına çıkmayacak güvenli alan)
      surpriseBtn.classList.add('evading');
      
      const areaRect = interactiveArea.getBoundingClientRect();
      const maxDistanceX = Math.min(window.innerWidth * 0.32, 130);
      const maxDistanceY = 45;

      // Rastgele yeni yön
      let randomX = (Math.random() * (maxDistanceX * 2)) - maxDistanceX;
      let randomY = (Math.random() * (maxDistanceY * 2)) - maxDistanceY;

      // Hafif eğlenceli rotasyon
      const randomRot = (Math.random() * 16) - 8;

      surpriseBtn.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg) scale(0.95)`;
      surpriseBtn.querySelector('.btn-text').textContent = msg.text;
      btnHint.textContent = msg.hint;

      // 3. kaçıştan sonra 4. aşamaya geçer: Artık teslim oldu ve tıklanabilir
      if (evadeCount >= maxEvades) {
        setTimeout(() => {
          isReadyForClick = true;
          surpriseBtn.classList.remove('evading');
          surpriseBtn.classList.add('catchable');
          surpriseBtn.style.transform = 'translate(0px, 0px) scale(1.05)';
          surpriseBtn.querySelector('.btn-icon').textContent = '💖';
          surpriseBtn.querySelector('.btn-text').textContent = 'Tamam teslim oldum, tıkla bakalım! 💖';
          btnHint.textContent = 'Şimdi basabilirsin minnoşum! 🥰';
        }, 600);
      }
    }
  }

  // Hem Fare ile yaklaşma/tıklama hem de Dokunmatik Ekran Desteği
  // Desktopta hover veya click, mobilde touchstart
  surpriseBtn.addEventListener('mouseenter', (e) => {
    if (!isReadyForClick && evadeCount < maxEvades) {
      handleButtonEvade(e);
    }
  });

  surpriseBtn.addEventListener('pointerdown', (e) => {
    if (!isReadyForClick && evadeCount < maxEvades) {
      handleButtonEvade(e);
    }
  });

  // 5. Dördüncü Tıklamada Sürpriz Patlaması (Kalp & Aşk Mesajı)
  surpriseBtn.addEventListener('click', (e) => {
    if (!isReadyForClick) {
      handleButtonEvade(e);
      return;
    }

    // 4. Sefer Tıklandı!
    e.preventDefault();
    triggerFinalSurprise();
  });

  function triggerFinalSurprise() {
    // Butonu kaybet
    surpriseBtn.style.transform = 'scale(0)';
    surpriseBtn.style.opacity = '0';
    btnHint.style.opacity = '0';

    statusText.textContent = 'Kasımpatının kalbinde sana bir şey var... ❤️';

    // 1. Kasımpatı çiçeğinin ortasından KALP BÜYÜR VE ATAR
    setTimeout(() => {
      flowerHeartGroup.classList.add('show');
    }, 400);

    // 2. Parçacık konfeti & kalpler patlasın
    launchConfettiAndHearts();

    // 3. Sevgi Kartı Açılsın
    setTimeout(() => {
      loveCard.classList.add('visible');
    }, 1400);
  }

  // 6. Konfeti ve Kalp Yağmuru (Canvas Animasyonu)
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
      const speed = Math.random() * 8 + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 3;
      this.gravity = 0.14;
      this.size = Math.random() * 8 + 6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
      this.decay = Math.random() * 0.006 + 0.003;
      this.type = Math.random() > 0.45 ? 'heart' : 'confetti';
      const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fde047', '#fbbf24', '#ffffff', '#ec4899'];
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
        ctx.font = `${this.size * 1.5}px sans-serif`;
        ctx.fillText('❤️', -this.size / 2, this.size / 2);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  function launchConfettiAndHearts() {
    isRaining = true;
    for (let i = 0; i < 90; i++) {
      particles.push(new Particle(canvas.width / 2, canvas.height * 0.35));
    }

    // Ekstra sürekli düşen kalpler
    let rainInterval = setInterval(() => {
      if (!isRaining) {
        clearInterval(rainInterval);
        return;
      }
      if (particles.length < 130) {
        const p = new Particle(Math.random() * canvas.width, -10);
        p.vy = Math.random() * 2 + 1.5;
        p.vx = (Math.random() - 0.5) * 2;
        particles.push(p);
      }
    }, 180);

    setTimeout(() => {
      isRaining = false;
    }, 9000);

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
    }, 500);
  });

  // Başlat
  createStars();
  buildChrysanthemumPetals();
  startGrowthAnimation();
});
