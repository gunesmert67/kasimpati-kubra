// 8-Bit Retro Mini Oyunu: İstanbul'dan Iğdır'a Kübra'ya Kavuşma 🌸

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // HUD Elementleri
  const hudDistance = document.getElementById('hudDistance');
  const hudFlowers = document.getElementById('hudFlowers');
  const hudScore = document.getElementById('hudScore');
  
  // Ekranlar ve Butonlar
  const startScreen = document.getElementById('startScreen');
  const victoryScreen = document.getElementById('victoryScreen');
  const startBtn = document.getElementById('startBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const soundToggle = document.getElementById('soundToggle');
  const yesBtn1 = document.getElementById('yesBtn1');
  const yesBtn2 = document.getElementById('yesBtn2');

  // Web Audio API
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
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        osc.frequency.setValueAtTime(1174, now + 0.14);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'win') {
        const notes = [329, 392, 523, 659, 783, 1046];
        notes.forEach((freq, idx) => {
          const noteOsc = audioCtx.createOscillator();
          const noteGain = audioCtx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(audioCtx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
          noteGain.gain.setValueAtTime(0.18, now + idx * 0.1);
          noteGain.gain.linearRampToValueAtTime(0, now + (idx + 1) * 0.14);
          noteOsc.start(now + idx * 0.1);
          noteOsc.stop(now + (idx + 1) * 0.14);
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
  let distance = 1520;     // İstanbul - Iğdır: 1520 KM
  let flowerCount = 0;
  let score = 0;
  let gameSpeed = 2.4;     // Rahat ve keyifli hız
  let groundY = 245;
  let gameTime = 0;

  // Oyuncu (Mert - Piksel Karakter)
  const player = {
    x: 60,
    y: groundY - 36,
    w: 24,
    h: 36,
    vy: 0,
    gravity: 0.52,
    jumpForce: -10.2,
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
        this.runFrame += 0.18;
      }
    },
    draw() {
      ctx.save();
      ctx.translate(Math.floor(this.x), Math.floor(this.y));

      // Saç
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(4, 0, 16, 8);
      ctx.fillRect(2, 4, 20, 6);

      // Yüz
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(4, 8, 16, 12);
      // Gözler
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(14, 11, 3, 3);

      // Kıyafet (Siyah-Gri Kapüşonlu)
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 20, 20, 11);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(8, 20, 8, 2); // Kırmızı detay

      // Bacaklar
      ctx.fillStyle = '#0f172a';
      const step = Math.floor(this.runFrame) % 2;
      if (this.isGrounded) {
        if (step === 0) {
          ctx.fillRect(4, 31, 6, 5);
          ctx.fillRect(14, 31, 6, 3);
        } else {
          ctx.fillRect(4, 31, 6, 3);
          ctx.fillRect(14, 31, 6, 5);
        }
      } else {
        ctx.fillRect(4, 31, 6, 3);
        ctx.fillRect(12, 31, 6, 3);
      }

      ctx.restore();
    }
  };

  // Hedef Karakter (Kübra - Başörtülü Zarif Piksel Tasarım)
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

      // 1. Başörtüsü / Şal (Zarif Pudra/Gül Pembe Tonlarında)
      // Başı tamamen saran şık örtü
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(3, 0, 18, 9);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(1, 4, 22, 18); // Omuzlara dökülen kumaş

      // 2. Yüz (Sadece gözler ve tatlı allık görünür)
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(6, 8, 12, 10);
      // Gözler
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(9, 10, 3, 3);
      // Allık
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(7, 13, 3, 2);
      ctx.fillRect(14, 13, 3, 2);

      // 3. Kıyafet / Pardösü (Zarif Mürdüm/Koyu Gül Rengi)
      ctx.fillStyle = '#831843';
      ctx.fillRect(3, 22, 18, 11);
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(8, 22, 8, 11); // Ön açık detay

      // 4. Etek Ucu & Ayakkabılar
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(6, 33, 4, 3);
      ctx.fillRect(14, 33, 4, 3);

      // 5. Elinde Tuttuğu Çiçek
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 19, 4, 4);

      ctx.restore();
    }
  };

  // Arka Plan Yıldızları
  const stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random() * 480,
      y: Math.random() * 150,
      size: Math.random() > 0.8 ? 2 : 1,
      speed: Math.random() * 0.3 + 0.1
    });
  }

  // Toplanabilirler (Kasımpatı Çiçekleri & Kalpler)
  let collectibles = [];
  let floatingTexts = [];
  let spawnTimer = 0;

  function spawnCollectibles() {
    spawnTimer++;
    // Her 40 karede bir çiçek veya kalp çıkar (Sık sık çıkar, toplaması keyiflidir)
    if (distance > 25 && spawnTimer % 38 === 0) {
      const isAirborne = Math.random() > 0.45;
      const type = Math.random() > 0.35 ? 'flower' : 'heart';
      collectibles.push({
        x: 490,
        // Yerdeyse zıplamadan alınır (groundY - 22), havadaysa zıplayarak alınır (groundY - 55)
        y: isAirborne ? (groundY - 55) : (groundY - 22),
        w: 22,
        h: 22,
        type: type
      });
    }
  }

  // Güncelleme Fonksiyonu
  function update() {
    if (gameState !== 'PLAYING') return;

    gameTime++;
    player.update();

    // Mesafe Geri Sayımı (1520 KM'den 0'a iner, yaklaşık 20 saniye)
    if (distance > 0) {
      distance -= 1.6;
      if (distance < 0) distance = 0;
      hudDistance.textContent = `${Math.floor(distance)} KM`;
    }

    // 0 KM Oldu! Kübra Belirir
    if (distance === 0 && !kubra.visible) {
      kubra.visible = true;
      kubra.x = 410;
    }

    // Yıldızlar
    stars.forEach(s => {
      s.x -= s.speed;
      if (s.x < 0) s.x = 480;
    });

    // Toplanabilirleri Üret
    spawnCollectibles();

    // Çiçek / Kalp Toplama & Geniş Çarpışma Kutusu
    for (let i = collectibles.length - 1; i >= 0; i--) {
      const col = collectibles[i];
      col.x -= gameSpeed;

      // Genişletilmiş mıknatıs/kutu çarpışması
      const pCenterX = player.x + player.w / 2;
      const pCenterY = player.y + player.h / 2;
      const cCenterX = col.x + col.w / 2;
      const cCenterY = col.y + col.h / 2;

      const dx = Math.abs(pCenterX - cCenterX);
      const dy = Math.abs(pCenterY - cCenterY);

      if (dx < 30 && dy < 32) {
        // BAŞARIYLA TOPLANDI!
        playSound('coin');
        if (col.type === 'flower') {
          flowerCount++;
          score += 100;
          floatingTexts.push({ x: col.x, y: col.y, text: '+100 🌸', opacity: 1 });
        } else {
          score += 250;
          floatingTexts.push({ x: col.x, y: col.y, text: '+250 💖', opacity: 1 });
        }
        hudFlowers.textContent = `🌸 x ${flowerCount}`;
        hudScore.textContent = score;

        collectibles.splice(i, 1);
        continue;
      }

      if (col.x < -30) collectibles.splice(i, 1);
    }

    // Uçan Puan Yazıları
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 0.8;
      ft.opacity -= 0.025;
      if (ft.opacity <= 0) floatingTexts.splice(i, 1);
    }

    // KAVUŞMA KONTROLÜ
    if (distance === 0 && kubra.visible) {
      if (player.x < kubra.x - 26) {
        player.x += 1.2;
      } else {
        triggerVictory();
      }
    }
  }

  // Çizim Fonksiyonu
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Gece Gökyüzü Degrade
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#0a0618');
    skyGrad.addColorStop(1, '#1b1236');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, groundY);

    // 2. Piksel Hilal Ay
    ctx.fillStyle = '#fde047';
    ctx.fillRect(400, 20, 24, 24);
    ctx.fillStyle = '#0a0618';
    ctx.fillRect(396, 17, 14, 14);

    // 3. Yıldızlar
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    });

    // 4. Uzak Şehir Silüeti (İstanbul'dan Iğdır'a Dağlar & Binalar)
    ctx.fillStyle = '#140e2b';
    for (let i = 0; i < 14; i++) {
      const h = ((i * 23) % 40) + 25;
      ctx.fillRect(i * 38 - (gameTime * 0.5 % 38), groundY - h, 34, h);
    }

    // 5. Zemin (Yol / Çimen)
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, groundY, canvas.width, 10);
    ctx.fillStyle = '#022c22';
    ctx.fillRect(0, groundY + 10, canvas.width, canvas.height - groundY - 10);

    // Yol şeritleri
    ctx.fillStyle = '#10b981';
    for (let x = - (gameTime * gameSpeed) % 30; x < canvas.width; x += 30) {
      ctx.fillRect(Math.floor(x), groundY + 4, 14, 3);
    }

    // 6. Toplanabilirleri Çiz (Büyük & Parlak)
    collectibles.forEach(col => {
      ctx.save();
      ctx.translate(Math.floor(col.x), Math.floor(col.y));

      if (col.type === 'heart') {
        // Kalp
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(3, 0, 6, 6);
        ctx.fillRect(11, 0, 6, 6);
        ctx.fillRect(1, 4, 18, 8);
        ctx.fillRect(4, 12, 12, 5);
        ctx.fillRect(8, 17, 4, 4);
      } else {
        // Kasımpatı Çiçeği 🌸
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(6, 0, 10, 22);
        ctx.fillRect(0, 6, 22, 10);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(4, 4, 14, 14);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(7, 7, 8, 8); // Altın sarısı çekirdek
      }

      ctx.restore();
    });

    // 7. Karakterleri Çiz
    player.draw();
    kubra.draw();

    // 8. Uçan Puan Yazıları
    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.opacity);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // 9. Kavuşma Anında Parlayan Büyük Kalp
    if (gameState === 'VICTORY') {
      const heartPulse = Math.sin(gameTime * 0.12) * 4;
      ctx.save();
      ctx.translate(player.x + 18, player.y - 35 + heartPulse);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-8, -8, 8, 8);
      ctx.fillRect(0, -8, 8, 8);
      ctx.fillRect(-12, -3, 24, 11);
      ctx.fillRect(-8, 8, 16, 8);
      ctx.fillRect(-4, 16, 8, 5);
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
    }, 700);
  }

  // Başlat
  startBtn.addEventListener('click', () => {
    initAudio();
    startScreen.classList.add('hidden');
    gameState = 'PLAYING';
    playSound('coin');
  });

  // Zıplama Kontrolleri
  jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    player.jump();
  });
  jumpBtn.addEventListener('click', () => {
    initAudio();
    player.jump();
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    player.jump();
  });
  canvas.addEventListener('click', () => {
    initAudio();
    player.jump();
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      initAudio();
      player.jump();
    }
  });

  // Sevgi Butonları
  function celebrateAccept(btn, text) {
    playSound('win');
    btn.textContent = text;
    btn.style.background = '#10b981';
    btn.style.boxShadow = '0 5px 0 #047857';

    // Konfeti kalpleri
    for (let i = 0; i < 45; i++) {
      collectibles.push({
        x: player.x + Math.random() * 50 - 25,
        y: player.y - Math.random() * 80,
        w: 10,
        h: 10,
        type: 'heart'
      });
    }
  }

  yesBtn1.addEventListener('click', () => celebrateAccept(yesBtn1, 'CANIMSIN BENİM! 🥰'));
  yesBtn2.addEventListener('click', () => celebrateAccept(yesBtn2, 'BEN DAHA ÇOK SEVİYORUM 💖'));

  requestAnimationFrame(loop);
});
