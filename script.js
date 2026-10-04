/**
 * FORTUNA ROYALE - ULTRA HIGH PERFORMANCE LUXURY LUCKY WHEEL
 * 120 FPS Offscreen Canvas Prerendering, Web Audio API, Zero Bloat
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Low-latency Web Audio API) ---
  class SoundManager {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTick(pitchRatio = 1) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580 * pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    playWhoosh() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.25);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.38);
      } catch (e) {}
    }

    playWinFanfare() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const notes = [
          { f: 523.25, d: 0.14, delay: 0 },
          { f: 659.25, d: 0.14, delay: 0.11 },
          { f: 783.99, d: 0.18, delay: 0.22 },
          { f: 1046.50, d: 0.75, delay: 0.35 }
        ];

        notes.forEach((note) => {
          const startTime = this.ctx.currentTime + note.delay;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + note.d + 0.05);
        });
      } catch (e) {}
    }
  }

  // --- 3 LUXURY STYLES PALETTES ---
  const THEME_PALETTES = {
    royalGold: [
      { bg: '#1c1b18', text: '#ffd97d', border: '#785f26' }, 
      { bg: '#332712', text: '#fff3c4', border: '#aa8620' }, 
      { bg: '#151922', text: '#f3e5b3', border: '#5c4819' }, 
      { bg: '#423315', text: '#ffffff', border: '#c99f36' }, 
      { bg: '#252119', text: '#ffd700', border: '#8b6f25' }, 
      { bg: '#543f16', text: '#fff9e6', border: '#e5b842' }, 
      { bg: '#10131a', text: '#edd382', border: '#4f4019' }, 
      { bg: '#3a2b10', text: '#ffffff', border: '#b8902d' }, 
    ],
    emeraldDynasty: [
      { bg: '#061a12', text: '#d1fae5', border: '#10b981' }, 
      { bg: '#0d3d27', text: '#fff3c4', border: '#34d399' }, 
      { bg: '#072418', text: '#a7f3d0', border: '#059669' }, 
      { bg: '#3e3012', text: '#ffffff', border: '#d4af37' }, 
      { bg: '#0a472d', text: '#ecfdf5', border: '#10b981' }, 
      { bg: '#4a3c18', text: '#ffd700', border: '#e5b842' }, 
      { bg: '#05140e', text: '#6ee7b7', border: '#047857' }, 
      { bg: '#2c3e21', text: '#ffffff', border: '#b8902d' }, 
    ],
    rubySovereign: [
      { bg: '#180509', text: '#ffe4e6', border: '#f43f5e' }, 
      { bg: '#3b0914', text: '#fff3c4', border: '#fb7185' }, 
      { bg: '#26070e', text: '#fecdd3', border: '#e11d48' }, 
      { bg: '#3d2e11', text: '#ffffff', border: '#d4af37' }, 
      { bg: '#480d19', text: '#fff1f2', border: '#f43f5e' }, 
      { bg: '#4f3d17', text: '#ffd700', border: '#e5b842' }, 
      { bg: '#130306', text: '#fda4af', border: '#be123c' }, 
      { bg: '#3a111a', text: '#ffffff', border: '#c99f36' }, 
    ]
  };

  function getCurrentPalette() {
    return THEME_PALETTES[state.theme] || THEME_PALETTES.royalGold;
  }

  // --- DEFAULT PRESETS ---
  const PRESETS = {
    casino: [
      '👑 1,000,000 GOLD', '💎 DIAMOND CHEST', '🌟 50,000 GOLD', '🃏 FREE RE-SPIN',
      '✨ 500,000 GOLD', '🗝️ MYSTERY BOX', '⚡ 100,000 GOLD', '🎯 DOUBLE PRIZE'
    ],
    truthOrDare: [
      '🔥 TRUTH: Biggest Secret', '⚡ DARE: 20 Pushups', '🔥 TRUTH: Guilty Pleasure',
      '⚡ DARE: Sing a Chorus', '🔥 TRUTH: Worst Habit', '⚡ DARE: Show Last Photo',
      '🔥 TRUTH: Celebrity Crush', '⚡ DARE: Speak in Accent'
    ],
    decisions: [
      '✨ ABSOLUTELY YES', '❌ DEFINITELY NO', '🎲 ASK AGAIN LATER',
      '🌟 GO FOR IT NOW', '⏳ WAIT & SLEEP ON IT', '🔥 TRUST YOUR GUT'
    ],
    luckyNumbers: [
      'NUMBER 1', 'NUMBER 2', 'NUMBER 3', 'NUMBER 4', 'NUMBER 5',
      'NUMBER 6', 'NUMBER 7', 'NUMBER 8', 'NUMBER 9', 'NUMBER 10'
    ]
  };

  // --- STATE ---
  const state = {
    theme: 'royalGold',
    players: [],
    currentPlayerIndex: 0,
    roundNumber: 1,
    segments: [...PRESETS.casino],
    history: [],
    
    // Physics
    currentAngle: 0,
    isSpinning: false,
    spinStartTime: 0,
    spinDuration: 0,
    startAngle: 0,
    targetAngle: 0,
    lastTickIndex: -1,

    // Admin Rigging
    adminRig: {
      active: false,
      targetPlayer: '',
      targetSliceIndex: 0,
      chance: 100
    }
  };

  // --- MULTIPLAYER MOCK STATE ---
  const mp = {
    localQueue: []
  };

  const sound = new SoundManager();

  // --- DOM ELEMENTS ---
  const elements = {
    // Header & Info
    turnBanner: document.getElementById('turnBanner'),
    turnAvatarInitial: document.getElementById('turnAvatarInitial'),
    currentTurnName: document.getElementById('currentTurnName'),
    turnRoundBadge: document.getElementById('turnRoundBadge'),
    btnNextTurnManual: document.getElementById('btnNextTurnManual'),
    btnManagePlayers: document.getElementById('btnManagePlayers'),
    playerCountBadge: document.getElementById('playerCountBadge'),
    btnSoundToggle: document.getElementById('btnSoundToggle'),
    soundOnIcon: document.getElementById('soundOnIcon'),
    soundOffIcon: document.getElementById('soundOffIcon'),

    // Canvas & Wheel
    wheelCanvas: document.getElementById('wheelCanvas'),
    btnSpin: document.getElementById('btnSpin'),
    tickerPointer: document.getElementById('tickerPointer'),
    studsRing: document.getElementById('studsRing'),
    wheelStatusText: document.getElementById('wheelStatusText'),
    
    // Buttons
    btnRandomOptions: document.getElementById('btnRandomOptions'),
    btnRandomOptionsSide: document.getElementById('btnRandomOptionsSide'),
    btnShuffleSegments: document.getElementById('btnShuffleSegments'),
    btnPresetsModalOpen: document.getElementById('btnPresetsModalOpen'),
    inputSegment: document.getElementById('inputSegment'),
    btnAddSegment: document.getElementById('btnAddSegment'),
    segmentList: document.getElementById('segmentList'),
    segmentCount: document.getElementById('segmentCount'),
    emptySegmentState: document.getElementById('emptySegmentState'),
    btnClearSegments: document.getElementById('btnClearSegments'),
    btnResetDefault: document.getElementById('btnResetDefault'),
    historyList: document.getElementById('historyList'),
    btnClearHistory: document.getElementById('btnClearHistory'),

    // Lobby Modal
    lobbyModal: document.getElementById('lobbyModal'),
    inputYourName: document.getElementById('inputYourName'),
    tabHostBtn: document.getElementById('tabHostBtn'),
    tabJoinBtn: document.getElementById('tabJoinBtn'),
    tabLocalBtn: document.getElementById('tabLocalBtn'),
    panelHost: document.getElementById('panelHost'),
    panelJoin: document.getElementById('panelJoin'),
    panelLocal: document.getElementById('panelLocal'),
    
    // Lobby - Host
    hostGeneratedCode: document.getElementById('hostGeneratedCode'),
    btnCopyHostCode: document.getElementById('btnCopyHostCode'),
    hostPlayerCount: document.getElementById('hostPlayerCount'),
    hostPlayersChips: document.getElementById('hostPlayersChips'),
    btnStartHostGame: document.getElementById('btnStartHostGame'),

    // Lobby - Join
    inputJoinRoomCode: document.getElementById('inputJoinRoomCode'),
    btnConnectJoinGame: document.getElementById('btnConnectJoinGame'),

    // Lobby - Local
    inputLocalPlayerName: document.getElementById('inputLocalPlayerName'),
    btnAddLocalPlayer: document.getElementById('btnAddLocalPlayer'),
    localPlayerCount: document.getElementById('localPlayerCount'),
    localPlayersChips: document.getElementById('localPlayersChips'),
    btnStartLocalGame: document.getElementById('btnStartLocalGame'),

    // Admin Modal
    btnAdminSecretMenu: document.getElementById('btnAdminSecretMenu'),
    adminModal: document.getElementById('adminModal'),
    btnCloseAdminModal: document.getElementById('btnCloseAdminModal'),
    adminSelectPlayer: document.getElementById('adminSelectPlayer'),
    adminTargetPlayerDisplay: document.getElementById('adminTargetPlayerDisplay'),
    btnAdminEqualChances: document.getElementById('btnAdminEqualChances'),
    adminSlicesList: document.getElementById('adminSlicesList'),
    btnSaveAdminChances: document.getElementById('btnSaveAdminChances'),

    // Other Modals
    winnerModal: document.getElementById('winnerModal'),
    winnerPlayerBanner: document.getElementById('winnerPlayerBanner'),
    winnerPrizeText: document.getElementById('winnerPrizeText'),
    btnRemoveWonSegment: document.getElementById('btnRemoveWonSegment'),
    btnNextTurnModal: document.getElementById('btnNextTurnModal'),
    winnerConfettiCanvas: document.getElementById('winnerConfettiCanvas'),
    presetsModal: document.getElementById('presetsModal'),
    btnClosePresets: document.getElementById('btnClosePresets'),

    ambientCanvas: document.getElementById('ambientCanvas'),
    fxCanvas: document.getElementById('fxCanvas'),
  };

  let wheelCtx = null;
  let cachedWheelCanvas = null; 
  let cachedWheelLogicalSize = 0;
  let cachedStuds = [];
  let tickerResetTimeout = null;
  let lastWinningSegment = null;

  // --- LOCAL STORAGE HELPERS ---
  function saveState() {
    try {
      localStorage.setItem('fortuna_segments', JSON.stringify(state.segments));
      localStorage.setItem('fortuna_players', JSON.stringify(state.players));
      localStorage.setItem('fortuna_theme', state.theme);
    } catch (e) {}
  }

  function loadState() {
    try {
      const storedTheme = localStorage.getItem('fortuna_theme');
      if (storedTheme && THEME_PALETTES[storedTheme]) {
        state.theme = storedTheme;
      }
      const storedSegments = localStorage.getItem('fortuna_segments');
      if (storedSegments) {
        const parsed = JSON.parse(storedSegments);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.segments = parsed;
        }
      }
      const storedPlayers = localStorage.getItem('fortuna_players');
      if (storedPlayers) {
        const parsedP = JSON.parse(storedPlayers);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          state.players = parsedP;
        }
      }
    } catch (e) {}
  }

  // --- AMBIENT PARTICLES ---
  let isAmbientActive = true;
  function initAmbientParticles() {
    const canvas = elements.ambientCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 100);
    });

    const particles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    function render() {
      if (isAmbientActive) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(245, 212, 105, 0.4)';
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // --- WINNER CONFETTI ENGINE ---
  let confettiAnimId = null;
  function triggerConfettiBurst() {
    const canvas = elements.fxCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles = [];
    const colors = ['#ffeaa7', '#d4af37', '#ffffff', '#fae498', '#c59b27'];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 13 + 5;
      particles.push({
        x: width / 2,
        y: height / 2 - 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.26,
        friction: 0.965,
        opacity: 1,
        decay: Math.random() * 0.01 + 0.008,
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function frame() {
      ctx.clearRect(0, 0, width, height);
      let alive = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity > 0) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }

      if (alive > 0) {
        confettiAnimId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
        confettiAnimId = null;
      }
    }
    confettiAnimId = requestAnimationFrame(frame);
  }

  // --- BEZEL STUDS ---
  function renderBezelStuds() {
    const container = elements.studsRing;
    if (!container) return;
    container.innerHTML = '';
    const totalStuds = 20;
    const radiusPercent = 48.5;
    cachedStuds = [];

    for (let i = 0; i < totalStuds; i++) {
      const angle = (i / totalStuds) * Math.PI * 2;
      const x = 50 + radiusPercent * Math.cos(angle);
      const y = 50 + radiusPercent * Math.sin(angle);

      const stud = document.createElement('div');
      stud.className = 'bezel-stud';
      stud.style.left = `${x}%`;
      stud.style.top = `${y}%`;
      container.appendChild(stud);
      cachedStuds.push(stud);
    }
  }

  // --- HARDWARE-ACCELERATED OFFSCREEN WHEEL PRERENDERING ---
  function buildOffscreenWheelCache(logicalSize, dpr) {
    if (!cachedWheelCanvas) {
      cachedWheelCanvas = document.createElement('canvas');
    }

    cachedWheelCanvas.width = Math.round(logicalSize * dpr);
    cachedWheelCanvas.height = Math.round(logicalSize * dpr);
    cachedWheelLogicalSize = logicalSize;

    const ctx = cachedWheelCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    const center = logicalSize / 2;
    const radius = center - 8;
    const totalSegments = state.segments.length;

    if (totalSegments === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#141822';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#d4af37';
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add items on the side to spin!', center, center);
      return;
    }

    const arc = (Math.PI * 2) / totalSegments;
    ctx.save();
    ctx.translate(center, center);

    const palette = getCurrentPalette();
    for (let i = 0; i < totalSegments; i++) {
      const startAngle = i * arc;
      const endAngle = startAngle + arc;
      const colorScheme = palette[i % palette.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      grad.addColorStop(0, colorScheme.border);
      grad.addColorStop(0.35, colorScheme.bg);
      grad.addColorStop(1, '#090a0e');

      ctx.fillStyle = grad;
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle);
      ctx.beginPath();
      ctx.arc(radius - 12, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff4ca';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colorScheme.text;

      let fontSize = 15;
      if (totalSegments > 18) fontSize = 11;
      else if (totalSegments > 12) fontSize = 13;
      else if (totalSegments <= 6) fontSize = 17;

      ctx.font = `700 ${fontSize}px "Cinzel", "Plus Jakarta Sans", serif`;

      let text = state.segments[i];
      const maxChars = totalSegments > 14 ? 16 : 24;
      if (text.length > maxChars) {
        text = text.substring(0, maxChars - 2) + '…';
      }

      ctx.fillText(text, radius - 28, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.stroke();
    ctx.restore();
  }

  function initWheelCanvas() {
    const canvas = elements.wheelCanvas;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width > 0 ? rect.width : (canvas.parentElement ? canvas.parentElement.clientWidth : 540);
    const size = Math.max(280, Math.min(displayWidth || 540, 750));

    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    wheelCtx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    
    buildOffscreenWheelCache(size, dpr);
    drawWheel();
  }

  function drawWheel() {
    if (!wheelCtx || !cachedWheelCanvas) return;
    const canvas = elements.wheelCanvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const logicalSize = canvas.width / dpr;
    const center = logicalSize / 2;

    wheelCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wheelCtx.clearRect(0, 0, logicalSize, logicalSize);

    wheelCtx.save();
    wheelCtx.translate(center, center);
    wheelCtx.rotate(state.currentAngle);
    wheelCtx.drawImage(
      cachedWheelCanvas, 
      0, 0, cachedWheelCanvas.width, cachedWheelCanvas.height,
      -center, -center, logicalSize, logicalSize
    );
    wheelCtx.restore();
  }

  function invalidateWheelCache() {
    const canvas = elements.wheelCanvas;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const logicalSize = canvas.width / dpr;
    buildOffscreenWheelCache(logicalSize, dpr);
    drawWheel();
    renderAdminSlices();
  }

  // --- PHYSICS ENGINE & ADMIN RIGGING ---
  function getActivePointerSegmentIndex(currentAngle) {
    if (state.segments.length === 0) return 0;
    const total = state.segments.length;
    const arc = (Math.PI * 2) / total;
    const pointerAngle = (3 * Math.PI) / 2;
    let normalized = (pointerAngle - (currentAngle % (Math.PI * 2))) % (Math.PI * 2);
    if (normalized < 0) normalized += Math.PI * 2;
    return Math.floor(normalized / arc) % total;
  }

  function spinWheel() {
    if (state.isSpinning) return;
    if (state.segments.length < 2) {
      alert('Please add at least 2 options on the wheel to spin!');
      elements.inputSegment.focus();
      return;
    }
    if (state.players.length === 0) {
      showLobbyModal();
      return;
    }

    sound.playWhoosh();
    state.isSpinning = true;
    isAmbientActive = false; 
    elements.btnSpin.disabled = true;
    const currentPlayer = getCurrentPlayerName();
    elements.wheelStatusText.textContent = `Spinning for ${currentPlayer}...`;

    const minTurns = 6;
    const maxTurns = 9;
    const turns = minTurns + Math.random() * (maxTurns - minTurns);
    const randomAngleOffset = Math.random() * Math.PI * 2;

    state.startAngle = state.currentAngle;
    let targetAngleFinal = state.startAngle + turns * Math.PI * 2 + randomAngleOffset;

    // ----- ADMIN RIGGING INJECTION -----
    if (state.adminRig.active && state.adminRig.targetPlayer === currentPlayer) {
      const chance = state.adminRig.chance; 
      if (Math.random() * 100 <= chance) {
        let targetSliceIndex = state.adminRig.targetSliceIndex;
        if (targetSliceIndex >= 0 && targetSliceIndex < state.segments.length) {
          let arc = (Math.PI * 2) / state.segments.length;
          let sliceOffset = (arc * 0.1) + Math.random() * (arc * 0.8);
          let requiredRotation = (3 * Math.PI / 2) - (targetSliceIndex * arc) - sliceOffset;
          
          requiredRotation = requiredRotation % (Math.PI * 2);
          if (requiredRotation < 0) requiredRotation += Math.PI * 2;
          
          let currentBase = state.startAngle + (Math.floor(turns) * Math.PI * 2);
          let currentMod = currentBase % (Math.PI * 2);
          let diff = requiredRotation - currentMod;
          if (diff < 0) diff += Math.PI * 2;
          
          targetAngleFinal = currentBase + diff;
        }
      }
    }
    // -----------------------------------

    state.targetAngle = targetAngleFinal;
    state.spinDuration = 4800 + Math.random() * 1000;
    state.spinStartTime = performance.now();
    state.lastTickIndex = getActivePointerSegmentIndex(state.currentAngle);

    animateStuds(true);
    requestAnimationFrame(updateSpinPhysics);
  }

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function updateSpinPhysics(currentTime) {
    const elapsed = currentTime - state.spinStartTime;
    const progress = Math.min(elapsed / state.spinDuration, 1);

    const eased = easeOutQuart(progress);
    state.currentAngle = state.startAngle + (state.targetAngle - state.startAngle) * eased;

    const currentSegmentIndex = getActivePointerSegmentIndex(state.currentAngle);
    if (currentSegmentIndex !== state.lastTickIndex) {
      state.lastTickIndex = currentSegmentIndex;
      triggerTickerBounce();
      sound.playTick(1 - progress * 0.4);
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(updateSpinPhysics);
    } else {
      finalizeSpin();
    }
  }

  function triggerTickerBounce() {
    const ptr = elements.tickerPointer;
    if (!ptr) return;
    ptr.classList.add('tick');
    if (tickerResetTimeout) clearTimeout(tickerResetTimeout);
    tickerResetTimeout = setTimeout(() => {
      ptr.classList.remove('tick');
    }, 40);
  }

  function animateStuds(active) {
    if (!cachedStuds.length) return;
    if (!active) {
      for (let i = 0; i < cachedStuds.length; i++) {
        cachedStuds[i].classList.remove('lit');
      }
      return;
    }
    for (let i = 0; i < cachedStuds.length; i++) {
      if (i % 2 === 0) cachedStuds[i].classList.add('lit');
      else cachedStuds[i].classList.remove('lit');
    }
  }

  function finalizeSpin() {
    state.isSpinning = false;
    isAmbientActive = true; 
    elements.btnSpin.disabled = false;
    animateStuds(false);

    const winningIndex = getActivePointerSegmentIndex(state.currentAngle);
    const winningPrize = state.segments[winningIndex];
    lastWinningSegment = { index: winningIndex, text: winningPrize };

    const currentPlayer = getCurrentPlayerName();
    elements.wheelStatusText.textContent = `Result: ${winningPrize}!`;

    addHistoryRecord(currentPlayer, winningPrize);
    sound.playWinFanfare();
    triggerConfettiBurst();
    showWinnerModal(currentPlayer, winningPrize);
  }

  // --- PLAYERS MANAGEMENT ---
  function getCurrentPlayerName() {
    if (state.players.length === 0) return 'Guest';
    return state.players[state.currentPlayerIndex % state.players.length];
  }

  function updateTurnBanner() {
    const playerName = getCurrentPlayerName();
    elements.currentTurnName.textContent = playerName;
    elements.turnAvatarInitial.textContent = playerName.charAt(0).toUpperCase() || '?';
    elements.turnRoundBadge.textContent = `Round ${state.roundNumber}`;
    const pCount = state.players.length;
    
    if (elements.playerCountBadge) elements.playerCountBadge.textContent = pCount;
    if (elements.modalPlayerCount) elements.modalPlayerCount.textContent = pCount;
  }

  function advanceTurn() {
    if (state.players.length === 0) return;
    state.currentPlayerIndex++;
    if (state.currentPlayerIndex >= state.players.length) {
      state.currentPlayerIndex = 0;
      state.roundNumber++;
    }
    updateTurnBanner();
    elements.wheelStatusText.textContent = `Ready for ${getCurrentPlayerName()}'s spin`;
  }

  // --- LOBBY AND MULTIPLAYER FLOW ---
  function showLobbyModal() {
    if (elements.lobbyModal) elements.lobbyModal.classList.remove('hidden');
    switchLobbyTab('local');
    renderLocalPlayerChips();
  }

  function hideLobbyModal() {
    if (elements.lobbyModal) elements.lobbyModal.classList.add('hidden');
    updateTurnBanner();
    elements.wheelStatusText.textContent = `Ready for ${getCurrentPlayerName()}'s spin`;
  }

  function switchLobbyTab(tabName) {
    if (!elements.panelHost) return;
    elements.panelHost.classList.add('hidden');
    elements.panelJoin.classList.add('hidden');
    elements.panelLocal.classList.add('hidden');
    
    elements.tabHostBtn.classList.remove('active');
    elements.tabJoinBtn.classList.remove('active');
    elements.tabLocalBtn.classList.remove('active');

    if (tabName === 'host') {
      elements.panelHost.classList.remove('hidden');
      elements.tabHostBtn.classList.add('active');
    } else if (tabName === 'join') {
      elements.panelJoin.classList.remove('hidden');
      elements.tabJoinBtn.classList.add('active');
    } else {
      elements.panelLocal.classList.remove('hidden');
      elements.tabLocalBtn.classList.add('active');
    }
  }

  function checkAdminLogin(name) {
    if (name.trim().toLowerCase() === 'admin') {
      elements.btnAdminSecretMenu.classList.remove('hidden');
      hideLobbyModal();
      elements.wheelStatusText.textContent = "Admin Stealth Rigging Unlocked.";
      return true;
    }
    return false;
  }

  // Local Play Functions
  function addLocalPlayer(name) {
    const clean = name.trim();
    if (!clean) return;
    if (checkAdminLogin(clean)) return;
    mp.localQueue.push(clean);
    elements.inputLocalPlayerName.value = '';
    renderLocalPlayerChips();
  }

  function removeLocalPlayer(index) {
    mp.localQueue.splice(index, 1);
    renderLocalPlayerChips();
  }

  function renderLocalPlayerChips() {
    const container = elements.localPlayersChips;
    if (!container) return;
    container.innerHTML = '';
    elements.localPlayerCount.textContent = mp.localQueue.length;

    mp.localQueue.forEach((player, idx) => {
      const chip = document.createElement('div');
      chip.className = 'player-chip';
      chip.innerHTML = `
        <span class="player-chip-badge">${idx + 1}</span>
        <span>${escapeHtml(player)}</span>
        <button class="player-chip-remove" data-index="${idx}" title="Remove player">✕</button>
      `;
      container.appendChild(chip);
    });

    container.querySelectorAll('.player-chip-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => removeLocalPlayer(parseInt(e.currentTarget.dataset.index, 10)));
    });
  }

  function startLocalGame() {
    if (mp.localQueue.length > 0) {
      state.players = [...mp.localQueue];
      saveState();
    } else if (state.players.length === 0) {
      state.players.push('Player 1');
    }
    hideLobbyModal();
  }

  function simulateHost() {
    const name = elements.inputYourName.value.trim();
    if (!name) return alert("Enter your name first!");
    if (checkAdminLogin(name)) return;
    
    let code = Math.floor(10000 + Math.random() * 90000).toString();
    elements.hostGeneratedCode.textContent = code;
    
    state.players = [name];
    elements.hostPlayersChips.innerHTML = `
      <div class="player-chip">
        <span class="player-chip-badge">1</span>
        <span>${escapeHtml(name)} (Host)</span>
      </div>
    `;
    switchLobbyTab('host');
  }

  function simulateJoin() {
    const name = elements.inputYourName.value.trim();
    const code = elements.inputJoinRoomCode.value.trim();
    if (!name) return alert("Enter your name first!");
    if (checkAdminLogin(name)) return;
    if (!code) return alert("Enter a room code!");
    
    state.players = ['Host', name];
    hideLobbyModal();
    alert(`Successfully joined room ${code}!`);
  }

  // --- ADMIN RIGGING UI ---
  function updateAdminPlayerDropdown() {
    if (!elements.adminSelectPlayer) return;
    elements.adminSelectPlayer.innerHTML = '<option value="">-- No Rigging (Fair Spin) --</option>';
    state.players.forEach(p => {
      elements.adminSelectPlayer.innerHTML += `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`;
    });
    
    if (state.adminRig.targetPlayer && state.players.includes(state.adminRig.targetPlayer)) {
      elements.adminSelectPlayer.value = state.adminRig.targetPlayer;
    }
  }

  function renderAdminSlices() {
    const list = elements.adminSlicesList;
    if (!list) return;
    list.innerHTML = '';
    
    if (state.segments.length === 0) {
      list.innerHTML = `<div style="color: #64748b; font-size: 0.8rem; padding: 10px;">No slices on the wheel to rig.</div>`;
      return;
    }

    state.segments.forEach((seg, idx) => {
      const isSelected = (state.adminRig.targetSliceIndex === idx);
      const div = document.createElement('div');
      div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 5px;";
      
      div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
          <input type="radio" name="adminTargetSlice" id="rig_slice_${idx}" value="${idx}" ${isSelected ? 'checked' : ''} style="accent-color: #ef4444; width: 16px; height: 16px; cursor: pointer;">
          <label for="rig_slice_${idx}" style="color: white; font-size: 0.85rem; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${escapeHtml(seg)}</label>
        </div>
        ${isSelected ? `
        <div style="display: flex; align-items: center; gap: 5px;">
          <input type="range" id="adminRigSlider" min="0" max="100" value="${state.adminRig.chance}" style="width: 80px; accent-color: #ef4444;">
          <span id="adminRigPercent" style="color: #ef4444; font-weight: bold; font-size: 0.8rem; width: 30px; text-align: right;">${state.adminRig.chance}%</span>
        </div>` : `<span style="color: #64748b; font-size: 0.75rem;">(Fair)</span>`}
      `;
      list.appendChild(div);
    });

    const radios = list.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.adminRig.targetSliceIndex = parseInt(e.target.value, 10);
        renderAdminSlices(); 
      });
    });

    const slider = document.getElementById('adminRigSlider');
    const display = document.getElementById('adminRigPercent');
    if (slider && display) {
      slider.addEventListener('input', (e) => {
        state.adminRig.chance = parseInt(e.target.value, 10);
        display.textContent = `${state.adminRig.chance}%`;
      });
    }
  }

  // --- SIDEBAR SEGMENTS MANAGEMENT ---
  function renderSegmentList() {
    const list = elements.segmentList;
    if (!list) return;
    list.innerHTML = '';

    elements.segmentCount.textContent = state.segments.length;

    if (state.segments.length === 0) {
      elements.emptySegmentState.classList.remove('hidden');
      invalidateWheelCache();
      return;
    }

    elements.emptySegmentState.classList.add('hidden');

    const palette = getCurrentPalette();
    state.segments.forEach((item, index) => {
      const colorScheme = palette[index % palette.length];
      const div = document.createElement('div');
      div.className = 'segment-item';
      div.innerHTML = `
        <div class="segment-item-left">
          <div class="segment-color-dot" style="background: ${colorScheme.bg}; border-color: ${colorScheme.border};"></div>
          <span class="segment-text" title="${escapeHtml(item)}">${escapeHtml(item)}</span>
        </div>
        <div class="segment-actions">
          <button class="btn-item-delete" data-index="${index}" title="Remove slice">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      `;
      list.appendChild(div);
    });

    list.querySelectorAll('.btn-item-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        removeSegment(idx);
      });
    });

    invalidateWheelCache();
  }

  // --- THEME MANAGEMENT ---
  function setTheme(themeName) {
    if (!THEME_PALETTES[themeName]) themeName = 'royalGold';
    state.theme = themeName;
    document.body.dataset.theme = themeName;

    document.querySelectorAll('.style-pill').forEach((pill) => {
      if (pill.dataset.theme === themeName) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    saveState();
    renderSegmentList();
  }

  function addSegment(text) {
    const clean = text.trim();
    if (!clean) return;
    state.segments.push(clean);
    saveState();
    renderSegmentList();

    const container = elements.segmentList.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function removeSegment(index) {
    if (index >= 0 && index < state.segments.length) {
      state.segments.splice(index, 1);
      saveState();
      renderSegmentList();
    }
  }

  function shuffleSegments() {
    for (let i = state.segments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.segments[i], state.segments[j]] = [state.segments[j], state.segments[i]];
    }
    saveState();
    renderSegmentList();
  }

  // --- RANDOM OPTIONS (FROM RandomOptions.txt ONLY) ---
  // No fallback logic here anymore. It relies entirely on the file.
  async function fetchRandomOptionsPool() {
    try {
      const response = await fetch('RandomOptions.txt?t=' + Date.now());
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      const text = await response.text();
      const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
      
      return lines;
    } catch (err) {
      console.error('Failed to load RandomOptions.txt', err);
      alert('Could not load RandomOptions.txt. Ensure the file exists in the same folder and you are running a local web server (like VSCode Live Server).');
      return [];
    }
  }

  async function applyRandomOptions() {
    const pool = await fetchRandomOptionsPool();
    if (!pool || pool.length === 0) return;

    // Pick 10 random items from the file
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const count = Math.min(10, shuffled.length);
    state.segments = shuffled.slice(0, count); // Overwrites old ones entirely

    saveState();
    renderSegmentList();

    sound.playWhoosh();
    elements.wheelStatusText.textContent = `Loaded ${count} random slices from RandomOptions.txt!`;
  }

  // --- HISTORY MANAGEMENT ---
  function addHistoryRecord(player, prize) {
    state.history.unshift({
      player,
      prize,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (state.history.length > 20) state.history.pop();
    renderHistory();
  }

  function renderHistory() {
    const list = elements.historyList;
    if (!list) return;
    list.innerHTML = '';

    if (state.history.length === 0) {
      list.innerHTML = '<div class="history-empty">No spins recorded yet</div>';
      return;
    }

    state.history.forEach((h) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <span class="history-winner-name">${escapeHtml(h.player)}</span>
        <span class="history-prize">${escapeHtml(h.prize)}</span>
      `;
      list.appendChild(item);
    });
  }

  // --- MODAL FLOWS ---
  function showWinnerModal(player, prize) {
    elements.winnerPlayerBanner.textContent = `Awarded to ${player}!`;
    elements.winnerPrizeText.textContent = prize;
    elements.winnerModal.classList.remove('hidden');
  }

  function hideWinnerModal() {
    elements.winnerModal.classList.add('hidden');
  }

  function showPresetsModal() {
    elements.presetsModal.classList.remove('hidden');
  }

  function hidePresetsModal() {
    elements.presetsModal.classList.add('hidden');
  }

  function loadPreset(key) {
    if (PRESETS[key]) {
      state.segments = [...PRESETS[key]];
      saveState();
      renderSegmentList();
      hidePresetsModal();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Wheel Actions
    elements.btnSpin.addEventListener('click', spinWheel);

    // Sidebar Slices Input
    elements.inputSegment.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = elements.inputSegment.value;
        if (value.trim()) {
          addSegment(value);
          elements.inputSegment.value = '';
          elements.inputSegment.focus();
        }
      }
    });

    elements.btnAddSegment.addEventListener('click', () => {
      const value = elements.inputSegment.value;
      if (value.trim()) {
        addSegment(value);
        elements.inputSegment.value = '';
        elements.inputSegment.focus();
      }
    });

    // Lobby / Player Mngmt
    if (elements.btnManagePlayers) {
      elements.btnManagePlayers.addEventListener('click', showLobbyModal);
    }
    
    // Tab Listeners
    if(elements.tabHostBtn) elements.tabHostBtn.addEventListener('click', simulateHost);
    if(elements.tabJoinBtn) elements.tabJoinBtn.addEventListener('click', () => switchLobbyTab('join'));
    if(elements.tabLocalBtn) elements.tabLocalBtn.addEventListener('click', () => switchLobbyTab('local'));

    // Local Pass & Play Tab
    if (elements.inputLocalPlayerName) {
      elements.inputLocalPlayerName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addLocalPlayer(elements.inputLocalPlayerName.value);
        }
      });
    }
    if (elements.btnAddLocalPlayer) {
      elements.btnAddLocalPlayer.addEventListener('click', () => addLocalPlayer(elements.inputLocalPlayerName.value));
    }
    if (elements.btnStartLocalGame) {
      elements.btnStartLocalGame.addEventListener('click', startLocalGame);
    }

    // Host & Join Action Buttons
    if (elements.btnStartHostGame) {
      elements.btnStartHostGame.addEventListener('click', hideLobbyModal);
    }
    if (elements.btnConnectJoinGame) {
      elements.btnConnectJoinGame.addEventListener('click', simulateJoin);
    }

    // Admin UI Actions
    if (elements.btnAdminSecretMenu) {
      elements.btnAdminSecretMenu.addEventListener('click', () => {
        updateAdminPlayerDropdown();
        renderAdminSlices();
        elements.adminModal.classList.remove('hidden');
      });
    }
    
    if (elements.btnCloseAdminModal) {
      elements.btnCloseAdminModal.addEventListener('click', () => elements.adminModal.classList.add('hidden'));
    }

    if (elements.btnAdminEqualChances) {
      elements.btnAdminEqualChances.addEventListener('click', () => {
        state.adminRig.active = false;
        state.adminRig.chance = 100;
        alert('Wheel rigging disabled. Fair spins active.');
      });
    }

    if (elements.btnSaveAdminChances) {
      elements.btnSaveAdminChances.addEventListener('click', () => {
        state.adminRig.targetPlayer = elements.adminSelectPlayer.value;
        if (!state.adminRig.targetPlayer) {
          state.adminRig.active = false;
          alert('Rigging disabled (No player selected).');
        } else {
          state.adminRig.active = true;
          alert(`Wheel is rigged! ${state.adminRig.targetPlayer} has a ${state.adminRig.chance}% chance to land on your selected option!`);
        }
        elements.adminModal.classList.add('hidden');
      });
    }

    // Turn Actions
    elements.btnNextTurnManual.addEventListener('click', advanceTurn);
    elements.btnNextTurnModal.addEventListener('click', () => {
      hideWinnerModal();
      advanceTurn();
    });

    elements.btnRemoveWonSegment.addEventListener('click', () => {
      if (lastWinningSegment && lastWinningSegment.index !== null) {
        removeSegment(lastWinningSegment.index);
        lastWinningSegment = null;
      }
      hideWinnerModal();
      advanceTurn();
    });

    // Random / Shuffle / Clear Tools
    elements.btnShuffleSegments.addEventListener('click', shuffleSegments);

    if (elements.btnRandomOptions) {
      elements.btnRandomOptions.addEventListener('click', applyRandomOptions);
    }
    if (elements.btnRandomOptionsSide) {
      elements.btnRandomOptionsSide.addEventListener('click', applyRandomOptions);
    }

    elements.btnClearSegments.addEventListener('click', () => {
      if (confirm('Clear all options from the wheel?')) {
        state.segments = [];
        saveState();
        renderSegmentList();
      }
    });

    elements.btnResetDefault.addEventListener('click', () => {
      state.segments = [...PRESETS.casino];
      saveState();
      renderSegmentList();
    });

    elements.btnClearHistory.addEventListener('click', () => {
      state.history = [];
      renderHistory();
    });

    elements.btnPresetsModalOpen.addEventListener('click', showPresetsModal);
    elements.btnClosePresets.addEventListener('click', hidePresetsModal);
    document.querySelectorAll('.preset-card').forEach((card) => {
      card.addEventListener('click', () => {
        const key = card.dataset.preset;
        loadPreset(key);
      });
    });

    // Sound
    elements.btnSoundToggle.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      if (sound.enabled) {
        elements.soundOnIcon.classList.remove('hidden');
        elements.soundOffIcon.classList.add('hidden');
        sound.playTick(1.2);
      } else {
        elements.soundOnIcon.classList.add('hidden');
        elements.soundOffIcon.classList.remove('hidden');
      }
    });

    // Modals Outer Click Close
    [elements.lobbyModal, elements.presetsModal, elements.adminModal].forEach((overlay) => {
      if(overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.add('hidden');
            if (overlay === elements.lobbyModal && state.players.length === 0) {
               // Ensure there is at least one player if they close early
               addLocalPlayer('Player 1');
               startLocalGame();
            }
          }
        });
      }
    });

    // Theme Switcher buttons
    document.querySelectorAll('.style-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
        sound.playTick(1.3);
      });
    });

    // Debounced resize
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initWheelCanvas();
      }, 100);
    });
  }

  // --- BOOTSTRAP ---
  function init() {
    loadState();
    setTheme(state.theme); 
    renderBezelStuds();
    initWheelCanvas();
    renderSegmentList();
    renderHistory();
    setupEventListeners();
    initAmbientParticles();

    // Show lobby on startup
    showLobbyModal();
    
    // Check if we need to load any players dynamically 
    if (state.players.length > 0) {
      mp.localQueue = [...state.players];
      renderLocalPlayerChips();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();