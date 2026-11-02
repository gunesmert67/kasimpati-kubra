// 8-Bit Retro Mini Oyunu: Kübra'ya Ulaşma Operasyonu 👾

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // HUD Elementleri
  const hudDistance = document.getElementById('hudDistance');
  const hudFlowers = document.getElementById('hudFlowers');
  const hudLives = document.getElementById('hudLives');
  
  // Ekranlar ve Butonlar
  const startScreen = document.getElementById('startScreen');
  const victoryScreen = document.getElementById('victoryScreen');
  const startBtn = document.getElementById('startBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const soundToggle = document.getElementById('soundToggle');
  const yesBtn1 = document.getElementById('yesBtn1');
  const yesBtn2 = document.getElementById('yesBtn2');

  // Web Audio API (8-Bit Sentezleyici Sesler)
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'coin') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        const notes = [261, 329, 392, 523, 659, 783];
        notes.forEach((freq, idx) => {
          const noteOsc = audioCtx.createOscillator();
          const noteGain = audioCtx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(audioCtx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
          noteGain.gain.setValueAtTime(0.18, now + idx * 0.1);
          noteGain.gain.linearRampToValueAtTime(0, now + (idx + 1) * 0.12);
          noteOsc.start(now + idx * 0.1);
          noteOsc.stop(now + (idx + 1) * 0.12);
        });
      }
    } catch (e) {}
  }

  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? 'SES: AÇIK 🔊' : 'SES: KAPALI 🔇';
  });

  // Oyun Durumu Değişkenleri
  let gameState = 'START'; // 'START', 'PLAYING', 'VICTORY'
  let distance = 450;      // 450 KM'den 0'a iner
  let flowerScore = 0;
  let lives = 3;
  let gameSpeed = 3.2;
  let groundY = 245;
  let gameTime = 0;

  // Oyuncu (Mert - Piksel Karakter)
  const player = {
    x: 60,
    y: groundY - 36,
    w: 24,
    h: 36,
    vy: 0,
    gravity: 0.58,
    jumpForce: -10.5,
    isGrounded: true,
    runFrame: 0,
    jump() {
      if (this.isGrounded && gameState === 'PLAYING') {
        this.vy = this.jumpForce;
        this.isGrounded = false;
        playSound('jump');
      }
    },
    update() {
      this.vy += this.gravity;
      this.y += this.vy;
      if (this.y >= groundY - this.h) {
        this.y = groundY - this.h;
        this.vy = 0;
        this.isGrounded = true;
      }
      if (this.isGrounded) {
        this.runFrame += 0.2;
      }
    },
    draw() {
      // 8-Bit Piksel Mert Çizimi (Siyah ceket, saçlar, tatlı yüz)
      ctx.save();
      ctx.translate(Math.floor(this.x), Math.floor(this.y));

      // Saç
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(4, 0, 16, 8);
      ctx.fillRect(2, 4, 20, 6);

      // Yüz (Ten rengi)
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(4, 8, 16, 12);
      // Gözler
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(14, 11, 3, 3);

      // Üst Kıyafet (Koyu Şık Kapüşonlu)
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, 20, 20, 10);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(8, 20, 8, 2); // Kırmızı yaka detayı

      // Bacaklar (Koşma animasyonu)
      ctx.fillStyle = '#1e1b4b';
      const step = Math.floor(this.runFrame) % 2;
      if (this.isGrounded) {
        if (step === 0) {
          ctx.fillRect(4, 30, 6, 6);
          ctx.fillRect(14, 30, 6, 4);
        } else {
          ctx.fillRect(4, 30, 6, 4);
          ctx.fillRect(14, 30, 6, 6);
        }
      } else {
        // Havadayken bacaklar kıvrık
        ctx.fillRect(4, 30, 6, 4);
        ctx.fillRect(12, 30, 6, 4);
      }

      ctx.restore();
    }
  };

  // Hedef Karakter (Kübra - Bitiş Çizgisinde Bekler)
  const kubra = {
    x: 480 + 50,
    y: groundY - 36,
    w: 24,
    h: 36,
    visible: false,
    draw() {
      if (!this.visible) return;
      ctx.save();
      ctx.translate(Math.floor(this.x), Math.floor(this.y));

      // Uzun Saçlar (Kestane / Sıcak ton)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, 0, 16, 8);
      ctx.fillRect(2, 4, 20, 24);

      // Yüz
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(6, 8, 14, 12);
      // Gözler ve Tatlı Yanak Allığı
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, 11, 3, 3);
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(6, 14, 4, 3); // Allık

      // Elbise (Zarif Gül Pembe)
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(5, 20, 16, 12);

      // Ayaklar
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(7, 32, 4, 4);
      ctx.fillRect(15, 32, 4, 4);

      // Başının üstünde minik taç veya kalp
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(10, -5, 6, 4);

      ctx.restore();
    }
  };

  // Arka Plan Katmanları (Parallaks)
  const stars = [];
  for (let i = 0; i < 35; i++) {
    stars.push({
      x: Math.random() * 480,
      y: Math.random() * 160,
      size: Math.random() > 0.8 ? 2 : 1,
      speed: Math.random() * 0.4 + 0.1
    });
  }

  // Engeller ve Toplanabilir Eşyalar
  let obstacles = [];
  let collectibles = [];
  let spawnTimer = 0;

  function spawnEntities() {
    spawnTimer++;
    if (distance > 30 && spawnTimer % 95 === 0) {
      // Engel tipi (Düşük şarj veya uçak rötarı)
      const isLowBattery = Math.random() > 0.5;
      obstacles.push({
        x: 490,
        y: groundY - 22,
        w: 22,
        h: 22,
        type: isLowBattery ? 'battery' : 'cone'
      });
    }

    if (distance > 20 && spawnTimer % 65 === 0) {
      // Toplanabilir Kasımpatı Çiçeği 🌸 veya Kalp 💖
      const isHeart = Math.random() > 0.5;
      collectibles.push({
        x: 490,
        y: groundY - (Math.random() * 55 + 35),
        w: 16,
        h: 16,
        type: isHeart ? 'heart' : 'flower'
      });
    }
  }

  // Çarpışma Testi
  function checkCollision(r1, r2) {
    return (
      r1.x < r2.x + r2.w &&
      r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h &&
      r1.y + r1.h > r2.y
    );
  }

  // Güncelleme Fonksiyonu
  function update() {
    if (gameState !== 'PLAYING') return;

    gameTime++;
    player.update();

    // Mesafe Geri Sayımı (450 km'den sıfıra)
    if (distance > 0) {
      distance -= 0.5;
      if (distance < 0) distance = 0;
      hudDistance.textContent = `${Math.floor(distance)} KM`;
    }

    // Mesafe Sıfırlandı! Kübra Sahneye Girer
    if (distance === 0 && !kubra.visible) {
      kubra.visible = true;
      kubra.x = 420;
    }

    // Yıldızlar
    stars.forEach(s => {
      s.x -= s.speed;
      if (s.x < 0) s.x = 480;
    });

    // Engeller ve Toplanabilirler
    spawnEntities();

    // Engelleri Güncelle
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= gameSpeed;

      if (checkCollision(player, obs)) {
        playSound('hit');
        obstacles.splice(i, 1);
        lives--;
        hudLives.textContent = '❤️'.repeat(Math.max(1, lives));
        continue;
      }
      if (obs.x < -30) obstacles.splice(i, 1);
    }

    // Çiçek / Kalp Toplama
    for (let i = collectibles.length - 1; i >= 0; i--) {
      const col = collectibles[i];
      col.x -= gameSpeed;

      if (checkCollision(player, col)) {
        playSound('coin');
        flowerScore++;
        hudFlowers.textContent = `🌸 x ${flowerScore}`;
        collectibles.splice(i, 1);
        continue;
      }
      if (col.x < -20) collectibles.splice(i, 1);
    }

    // KAVUŞMA KONTROLÜ
    if (distance === 0 && kubra.visible) {
      // Mert yavaşça Kübra'nın yanına yürür
      if (player.x < kubra.x - 26) {
        player.x += 1.5;
      } else {
        // KAVUŞTULAR! ZAFER!
        triggerVictory();
      }
    }
  }

  // Çizim Fonksiyonu
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Gece Gökyüzü Degrade
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#0c071e');
    skyGrad.addColorStop(1, '#1e143f');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, groundY);

    // 2. Piksel Ay
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(380, 25, 28, 28);
    ctx.fillStyle = '#0c071e';
    ctx.fillRect(376, 21, 14, 14);

    // 3. Yıldızlar
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    });

    // 4. Uzak Şehir Silüeti
    ctx.fillStyle = '#17112e';
    for (let i = 0; i < 12; i++) {
      const h = ((i * 19) % 45) + 30;
      ctx.fillRect(i * 44 - (gameTime % 44), groundY - h, 40, h);
    }

    // 5. Zemin (Yol / Çimen)
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, groundY, canvas.width, 10);
    ctx.fillStyle = '#022c22';
    ctx.fillRect(0, groundY + 10, canvas.width, canvas.height - groundY - 10);

    // Yol çizgileri
    ctx.fillStyle = '#10b981';
    for (let x = - (gameTime * gameSpeed) % 30; x < canvas.width; x += 30) {
      ctx.fillRect(Math.floor(x), groundY + 4, 14, 3);
    }

    // 6. Engelleri Çiz
    obstacles.forEach(obs => {
      ctx.save();
      ctx.translate(Math.floor(obs.x), Math.floor(obs.y));
      if (obs.type === 'battery') {
        // Düşük Şarj Sembolü
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(0, 2, 18, 16);
        ctx.fillRect(18, 6, 3, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, 5, 4, 10); // Tek kademe şarj
      } else {
        // Ulaşım / Koni Sembolü
        ctx.fillStyle = '#f97316';
        ctx.fillRect(6, 0, 8, 6);
        ctx.fillRect(3, 6, 14, 7);
        ctx.fillRect(0, 13, 20, 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, 6, 16, 3);
      }
      ctx.restore();
    });

    // 7. Çiçekleri & Kalpleri Çiz
    collectibles.forEach(col => {
      ctx.save();
      ctx.translate(Math.floor(col.x), Math.floor(col.y));
      if (col.type === 'heart') {
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(3, 0, 4, 4);
        ctx.fillRect(9, 0, 4, 4);
        ctx.fillRect(1, 3, 14, 5);
        ctx.fillRect(3, 8, 10, 4);
        ctx.fillRect(6, 12, 4, 3);
      } else {
        // Kasımpatı Çiçeği
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(4, 0, 8, 16);
        ctx.fillRect(0, 4, 16, 8);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(5, 5, 6, 6); // Altın göbek
      }
      ctx.restore();
    });

    // 8. Karakterleri Çiz
    player.draw();
    kubra.draw();

    // Eğer kavuştularsa başlarının üzerinde devasa atan kalp
    if (gameState === 'VICTORY') {
      const heartPulse = Math.sin(gameTime * 0.1) * 3;
      ctx.save();
      ctx.translate(player.x + 16, player.y - 32 + heartPulse);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-6, -6, 6, 6);
      ctx.fillRect(0, -6, 6, 6);
      ctx.fillRect(-9, -2, 18, 8);
      ctx.fillRect(-6, 6, 12, 6);
      ctx.fillRect(-3, 12, 6, 4);
      ctx.restore();
    }
  }

  // Oyun Döngüsü
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Zafer Ekranını Tetikle
  function triggerVictory() {
    if (gameState === 'VICTORY') return;
    gameState = 'VICTORY';
    playSound('win');

    setTimeout(() => {
      victoryScreen.classList.remove('hidden');
    }, 800);
  }

  // Oyunu Başlat
  startBtn.addEventListener('click', () => {
    initAudio();
    startScreen.classList.add('hidden');
    gameState = 'PLAYING';
    playSound('coin');
  });

  // Kontroller (Zıplama)
  jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    player.jump();
  });

  jumpBtn.addEventListener('click', () => {
    initAudio();
    player.jump();
  });

  // Ekrana / Canvas'a dokunarak zıplama
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    player.jump();
  });
  canvas.addEventListener('click', () => {
    initAudio();
    player.jump();
  });

  // Klavye Kontrolleri (Space veya Yukarı Ok)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      initAudio();
      player.jump();
    }
  });

  // Teklif Butonları (Evet & Kesinlikle Evet)
  function celebrateAccept(btn) {
    playSound('win');
    btn.textContent = 'SENİ ÇOK SEVİYORUM! 💕';
    btn.style.background = '#10b981';
    btn.style.boxShadow = '0 5px 0 #047857';

    // Minik konfeti patlaması efekti
    const colors = ['#f43f5e', '#fbbf24', '#34d399', '#ffffff'];
    for (let i = 0; i < 40; i++) {
      collectibles.push({
        x: player.x + Math.random() * 40 - 20,
        y: player.y - Math.random() * 60,
        w: 6,
        h: 6,
        type: 'heart'
      });
    }
  }

  yesBtn1.addEventListener('click', () => celebrateAccept(yesBtn1));
  yesBtn2.addEventListener('click', () => celebrateAccept(yesBtn2));

  // Döngüyü Başlat
  requestAnimationFrame(loop);
});
