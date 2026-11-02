// 1520 KM Retro Runner - Canvas 2D Motoru
// Karakter Seçimi (Kübra / Mert), Zıplama Fiziği ve 8-Bit Web Audio API

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const hudDistance = document.getElementById('hudDistance');
  const hudFlowers = document.getElementById('hudFlowers');
  const hudScore = document.getElementById('hudScore');
  const hudRoute = document.getElementById('hudRoute');

  const startScreen = document.getElementById('startScreen');
  const victoryScreen = document.getElementById('victoryScreen');
  const startBtn = document.getElementById('startBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const soundToggle = document.getElementById('soundToggle');
  const yesBtn1 = document.getElementById('yesBtn1');
  const yesBtn2 = document.getElementById('yesBtn2');
  const charBtnKubra = document.getElementById('charBtnKubra');
  const charBtnMert = document.getElementById('charBtnMert');
  const vicDesc = document.getElementById('vicDesc');

  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
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
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.18);
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

  soundToggle?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? 'SES: AÇIK 🔊' : 'SES: KAPALI 🔇';
  });

  let activeCharacter = 'kubra';

  charBtnKubra?.addEventListener('click', () => {
    activeCharacter = 'kubra';
    charBtnKubra.classList.add('active');
    charBtnMert?.classList.remove('active');
    if (hudRoute) hudRoute.textContent = 'IĞDIR ➔ İSTANBUL';
    if (vicDesc) vicDesc.textContent = 'Iğdır - İstanbul arası 1520 km bile bana ulaşmana engel olamadı.';
  });

  charBtnMert?.addEventListener('click', () => {
    activeCharacter = 'mert';
    charBtnMert.classList.add('active');
    charBtnKubra?.classList.remove('active');
    if (hudRoute) hudRoute.textContent = 'İSTANBUL ➔ IĞDIR';
    if (vicDesc) vicDesc.textContent = 'İstanbul - Iğdır arası 1520 km bile sana gelmeme engel olamaz.';
  });

  let gameState = 'START';
  let distance = 1520;
  let flowerCount = 0;
  let score = 0;
  let gameSpeed = 2.4;
  let groundY = 245;
  let gameTime = 0;

  const player = {
    x: 60,
    y: groundY - 36,
    w: 24,
    h: 36,
    vy: 0,
    gravity: 0.52,
    jumpForce: -10.5,
    isGrounded: true,
    runFrame: 0,
    invulnerable: 0,
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
      if (this.invulnerable > 0) {
        this.invulnerable--;
      }
    },
    draw() {
      if (this.invulnerable > 0 && Math.floor(this.invulnerable / 3) % 2 === 0) {
        return;
      }

      ctx.save();
      ctx.translate(Math.floor(this.x), Math.floor(this.y));

      if (activeCharacter === 'kubra') {
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(3, 0, 18, 9);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(1, 4, 22, 18);

        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(6, 8, 12, 10);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(9, 10, 3, 3);

        ctx.fillStyle = '#831843';
        ctx.fillRect(3, 22, 18, 10);
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(8, 22, 8, 10);

        ctx.fillStyle = '#1e1b4b';
        const step = Math.floor(this.runFrame) % 2;
        if (this.isGrounded) {
          if (step === 0) {
            ctx.fillRect(4, 32, 6, 4);
            ctx.fillRect(14, 32, 6, 2);
          } else {
            ctx.fillRect(4, 32, 6, 2);
            ctx.fillRect(14, 32, 6, 4);
          }
        } else {
          ctx.fillRect(4, 32, 6, 3);
          ctx.fillRect(13, 32, 6, 3);
        }
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(4, 0, 16, 8);
        ctx.fillRect(2, 4, 20, 6);

        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(4, 8, 16, 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(14, 11, 3, 3);

        ctx.fillStyle = '#334155';
        ctx.fillRect(2, 20, 20, 11);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(8, 20, 8, 2);

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
      }

      ctx.restore();
    }
  };

  const waitingPartner = {
    x: 480 + 50,
    y: groundY - 36,
    w: 24,
    h: 36,
    visible: false,
    draw() {
      if (!this.visible) return;
      ctx.save();
      ctx.translate(Math.floor(this.x), Math.floor(this.y));

      if (activeCharacter === 'kubra') {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(4, 0, 16, 8);
        ctx.fillRect(2, 4, 20, 6);

        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(4, 8, 16, 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(8, 11, 3, 3);

        ctx.fillStyle = '#334155';
        ctx.fillRect(2, 20, 20, 12);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(6, 20, 4, 4);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(5, 32, 5, 4);
        ctx.fillRect(14, 32, 5, 4);
      } else {
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(3, 0, 18, 9);
        ctx.fillRect(1, 4, 22, 18);

        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(6, 8, 12, 10);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(8, 10, 3, 3);

        ctx.fillStyle = '#831843';
        ctx.fillRect(3, 22, 18, 11);
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(8, 22, 8, 11);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(6, 33, 4, 3);
        ctx.fillRect(14, 33, 4, 3);

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 19, 4, 4);
      }

      ctx.restore();
    }
  };

  const stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random() * 480,
      y: Math.random() * 150,
      size: Math.random() > 0.8 ? 2 : 1,
      speed: Math.random() * 0.3 + 0.1
    });
  }

  let collectibles = [];
  let obstacles = [];
  let floatingTexts = [];
  let spawnTimer = 0;

  function spawnEntities() {
    spawnTimer++;
    if (distance > 35 && spawnTimer % 55 === 0) {
      const rand = Math.random();

      if (rand < 0.45) {
        const obsType = Math.random() > 0.5 ? 'rock' : 'hurdle';
        obstacles.push({
          x: 490,
          y: obsType === 'rock' ? groundY - 16 : groundY - 22,
          w: 22,
          h: obsType === 'rock' ? 16 : 22,
          type: obsType
        });

        collectibles.push({
          x: 492,
          y: groundY - 78,
          w: 22,
          h: 22,
          type: Math.random() > 0.35 ? 'flower' : 'heart'
        });
      } else if (rand < 0.8) {
        const rewardType = Math.random() > 0.35 ? 'flower' : 'heart';
        collectibles.push({
          x: 490,
          y: groundY - 75,
          w: 22,
          h: 22,
          type: rewardType
        });
        collectibles.push({
          x: 524,
          y: groundY - 88,
          w: 22,
          h: 22,
          type: 'flower'
        });
      } else {
        obstacles.push({
          x: 490,
          y: groundY - 16,
          w: 20,
          h: 16,
          type: 'rock'
        });
      }
    }
  }

  function update() {
    if (gameState !== 'PLAYING') return;

    gameTime++;
    player.update();

    if (distance > 0) {
      distance -= 1.6;
      if (distance < 0) distance = 0;
      if (hudDistance) hudDistance.textContent = `${Math.floor(distance)} KM`;
    }

    if (distance === 0 && !waitingPartner.visible) {
      waitingPartner.visible = true;
      waitingPartner.x = 410;
    }

    stars.forEach(s => {
      s.x -= s.speed;
      if (s.x < 0) s.x = 480;
    });

    spawnEntities();

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= gameSpeed;

      const pBox = { x: player.x + 4, y: player.y + 4, w: player.w - 8, h: player.h - 4 };
      const oBox = { x: obs.x + 2, y: obs.y + 2, w: obs.w - 4, h: obs.h - 2 };

      if (pBox.x < oBox.x + oBox.w && pBox.x + pBox.w > oBox.x &&
          pBox.y < oBox.y + oBox.h && pBox.y + pBox.h > oBox.y) {
        if (player.invulnerable === 0) {
          player.invulnerable = 36;
          score = Math.max(0, score - 50);
          if (hudScore) hudScore.textContent = score;
          floatingTexts.push({ x: player.x, y: player.y - 12, text: '-50 💥', opacity: 1, color: '#ef4444' });
          playSound('hit');
        }
      }

      if (obs.x < -40) obstacles.splice(i, 1);
    }

    for (let i = collectibles.length - 1; i >= 0; i--) {
      const col = collectibles[i];
      col.x -= gameSpeed;

      const pBox = { x: player.x - 2, y: player.y - 2, w: player.w + 4, h: player.h + 4 };
      const cBox = { x: col.x + 2, y: col.y + 2, w: col.w - 4, h: col.h - 4 };

      if (pBox.x < cBox.x + cBox.w && pBox.x + pBox.w > cBox.x &&
          pBox.y < cBox.y + cBox.h && pBox.y + pBox.h > cBox.y) {
        playSound('coin');
        if (col.type === 'flower') {
          flowerCount++;
          score += 100;
          floatingTexts.push({ x: col.x, y: col.y, text: '+100 🌸', opacity: 1, color: '#fbbf24' });
        } else {
          score += 250;
          floatingTexts.push({ x: col.x, y: col.y, text: '+250 💖', opacity: 1, color: '#f43f5e' });
        }
        if (hudFlowers) hudFlowers.textContent = `🌸 x ${flowerCount}`;
        if (hudScore) hudScore.textContent = score;
        collectibles.splice(i, 1);
        continue;
      }

      if (col.x < -30) collectibles.splice(i, 1);
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 0.8;
      ft.opacity -= 0.025;
      if (ft.opacity <= 0) floatingTexts.splice(i, 1);
    }

    if (distance === 0 && waitingPartner.visible) {
      if (player.x < waitingPartner.x - 26) {
        player.x += 1.2;
      } else {
        triggerVictory();
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#0a0618');
    skyGrad.addColorStop(1, '#1b1236');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, groundY);

    ctx.fillStyle = '#fde047';
    ctx.fillRect(400, 20, 24, 24);
    ctx.fillStyle = '#0a0618';
    ctx.fillRect(396, 17, 14, 14);

    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    });

    ctx.fillStyle = '#140e2b';
    for (let i = 0; i < 14; i++) {
      const h = ((i * 23) % 40) + 25;
      ctx.fillRect(i * 38 - (gameTime * 0.5 % 38), groundY - h, 34, h);
    }

    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, groundY, canvas.width, 10);
    ctx.fillStyle = '#022c22';
    ctx.fillRect(0, groundY + 10, canvas.width, canvas.height - groundY - 10);

    ctx.fillStyle = '#10b981';
    for (let x = - (gameTime * gameSpeed) % 30; x < canvas.width; x += 30) {
      ctx.fillRect(Math.floor(x), groundY + 4, 14, 3);
    }

    obstacles.forEach(obs => {
      ctx.save();
      ctx.translate(Math.floor(obs.x), Math.floor(obs.y));
      if (obs.type === 'rock') {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(2, 4, 18, 12);
        ctx.fillRect(5, 1, 12, 15);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(5, 3, 6, 4);
        ctx.fillStyle = '#334155';
        ctx.fillRect(2, 13, 18, 3);
      } else {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(2, 0, 4, 22);
        ctx.fillRect(12, 0, 4, 22);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(0, 4, 18, 5);
        ctx.fillRect(0, 13, 18, 5);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(1, 5, 2, 3);
        ctx.fillRect(15, 5, 2, 3);
      }
      ctx.restore();
    });

    collectibles.forEach(col => {
      ctx.save();
      ctx.translate(Math.floor(col.x), Math.floor(col.y));
      if (col.type === 'heart') {
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(3, 0, 6, 6);
        ctx.fillRect(11, 0, 6, 6);
        ctx.fillRect(1, 4, 18, 8);
        ctx.fillRect(4, 12, 12, 5);
        ctx.fillRect(8, 17, 4, 4);
      } else {
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(6, 0, 10, 22);
        ctx.fillRect(0, 6, 22, 10);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(4, 4, 14, 14);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(7, 7, 8, 8);
      }
      ctx.restore();
    });

    player.draw();
    waitingPartner.draw();

    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.opacity);
      ctx.fillStyle = ft.color || '#fbbf24';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

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

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function triggerVictory() {
    if (gameState === 'VICTORY') return;
    gameState = 'VICTORY';
    playSound('win');
    setTimeout(() => {
      victoryScreen?.classList.remove('hidden');
    }, 700);
  }

  startBtn?.addEventListener('click', () => {
    initAudio();
    startScreen?.classList.add('hidden');
    gameState = 'PLAYING';
    playSound('coin');
  });

  jumpBtn?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    player.jump();
  });
  jumpBtn?.addEventListener('click', () => {
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

  const rewardResult = document.getElementById('rewardResult');

  function claimReward(choice) {
    playSound('win');

    for (let i = 0; i < 50; i++) {
      collectibles.push({
        x: player.x + Math.random() * 80 - 40,
        y: player.y - Math.random() * 90,
        w: 10,
        h: 10,
        type: 'heart'
      });
    }

    if (choice === 1) {
      if (yesBtn1) {
        yesBtn1.textContent = 'SÖZÜNÜ ALDIM! 😉☕';
        yesBtn1.style.background = '#10b981';
        yesBtn1.style.boxShadow = '0 5px 0 #047857';
        yesBtn1.disabled = true;
      }
      if (yesBtn2) yesBtn2.style.display = 'none';

      if (rewardResult) {
        rewardResult.style.display = 'block';
        rewardResult.innerHTML = '☕🍰 <b>Borç Yazıldı!</b> En lezzetli kahve ve tatlılar Mert\'ten sana söz olsun. Ekran görüntüsünü at ve tahsil et bakalım 😉';
      }
    } else {
      if (yesBtn2) {
        yesBtn2.textContent = 'BEN DE SENİİİ! 🥰💖';
        yesBtn2.style.background = '#f43f5e';
        yesBtn2.style.boxShadow = '0 5px 0 #9f1239';
        yesBtn2.disabled = true;
      }
      if (yesBtn1) yesBtn1.style.display = 'none';

      if (rewardResult) {
        rewardResult.style.display = 'block';
        rewardResult.innerHTML = '🥰💖 <b>Ben de seni çok seviyorum/istiyorum minnoşum!</b> Zaten tamamen seninim... Kahveler ve tatlılar da üstüne bonus olsun! 💕🌸';
      }
    }
  }

  yesBtn1?.addEventListener('click', () => claimReward(1));
  yesBtn2?.addEventListener('click', () => claimReward(2));

  requestAnimationFrame(loop);
});
