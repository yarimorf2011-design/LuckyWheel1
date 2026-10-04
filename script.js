/**
 * FORTUNA ROYALE - MULTIPLAYER LIVE SYNC EDITION
 * 120 FPS Offscreen Canvas Prerendering, Web Audio API, PeerJS Real-Time Sync
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER ---
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

  // --- GLOBAL STATE ---
  const state = {
    theme: 'royalGold',
    players: [],
    currentPlayerIndex: 0,
    roundNumber: 1,
    segments: [...PRESETS.casino],
    history: [],
    isAdmin: false,
    
    currentAngle: 0,
    isSpinning: false,
    spinStartTime: 0,
    spinDuration: 0,
    startAngle: 0,
    targetAngle: 0,
    lastTickIndex: -1,

    // Weight-based admin rigging
    adminRig: {
      active: false,
      playerConfigs: {} 
    }
  };

  // --- MULTIPLAYER P2P ENGINE (PeerJS) ---
  const mp = {
    peer: null,
    conns: [], 
    hostConn: null, 
    mode: 'local', 
    roomCode: null,
    myName: '',
    localQueue: [],

    initHost: function(name, code) {
      this.mode = 'host';
      this.roomCode = code;
      
      this.peer = new Peer('FR-' + code);
      
      this.peer.on('open', (id) => {
          elements.hostGeneratedCode.innerText = code;
          elements.roomStatusBadge.classList.remove('hidden');
          document.getElementById('displayRoomCode').innerText = code;
          
          if (name !== 'Admin') state.players = [name];
          else state.players = []; 
          
          updateLobbyPlayersList();
      });

      this.peer.on('connection', (conn) => {
          this.conns.push(conn);
          document.getElementById('displayPeerCount').innerText = `${this.conns.length + 1} online`;
          
          conn.on('data', (data) => this.handleHostData(conn, data));
          conn.on('close', () => {
              this.conns = this.conns.filter(c => c !== conn);
              document.getElementById('displayPeerCount').innerText = `${this.conns.length + 1} online`;
          });
      });
      
      this.peer.on('error', (err) => {
          console.error(err);
          if (err.type === 'unavailable-id') {
              alert('Room code collision! Please refresh and host a new code.');
          }
      });
    },

    initJoin: function(name, code) {
      this.mode = 'join';
      this.roomCode = code;
      this.peer = new Peer();
      
      this.peer.on('open', (id) => {
          const conn = this.peer.connect('FR-' + code, { reliable: true });
          this.hostConn = conn;
          
          conn.on('open', () => {
              conn.send({ type: 'JOIN', name: name, isAdmin: state.isAdmin });
              elements.wheelStatusText.innerText = `Joined Room ${code}. Waiting for sync...`;
              elements.roomStatusBadge.classList.remove('hidden');
              document.getElementById('displayRoomCode').innerText = code;
              
              hideLobbyModal();
              applyGuestRestrictions();
          });
          
          conn.on('data', (data) => this.handleJoinerData(data));
          
          conn.on('close', () => {
              alert('Host disconnected.');
              location.reload();
          });
      });
      
      this.peer.on('error', (err) => {
          alert('Connection Error: ' + err.message);
          elements.btnConnectJoinGame.disabled = false;
          elements.btnConnectJoinGame.innerHTML = '<span>JOIN ROOM</span>';
      });
    },

    broadcast: function(data) {
      if (this.mode === 'host') {
          this.conns.forEach(conn => {
              if (conn.open) conn.send(data);
          });
      } else if (this.mode === 'join' && this.hostConn && this.hostConn.open) {
          this.hostConn.send(data); 
      }
    },

    broadcastState: function() {
      this.broadcast({
          type: 'STATE_UPDATE',
          state: {
              players: state.players,
              segments: state.segments,
              theme: state.theme,
              history: state.history,
              currentPlayerIndex: state.currentPlayerIndex,
              roundNumber: state.roundNumber
          }
      });
    }
  };

  // Map Host Data Listeners
  mp.handleHostData = function(conn, data) {
    switch(data.type) {
        case 'JOIN':
            if (!data.isAdmin) {
                addPlayer(data.name, true); 
            }
            conn.send({
                type: 'FULL_STATE',
                state: {
                    players: state.players,
                    segments: state.segments,
                    theme: state.theme,
                    history: state.history,
                    currentPlayerIndex: state.currentPlayerIndex,
                    roundNumber: state.roundNumber
                }
            });
            this.broadcastState();
            break;
        case 'REQUEST_SPIN':
            if (!state.isSpinning) spinWheelHostLogic(data.playerName);
            break;
        case 'REQUEST_ADVANCE_TURN':
            advanceTurn(); // Host advances and broadcasts
            break;
        case 'UPDATE_SEGMENTS':
            if (data.isAdmin) {
                state.segments = data.segments;
                renderSegmentList();
                this.broadcastState();
            }
            break;
        case 'UPDATE_THEME':
            if (data.isAdmin) {
                setTheme(data.theme, true);
                this.broadcastState();
            }
            break;
        case 'ADVANCE_TURN':
            if (data.isAdmin) {
                advanceTurn(true);
                this.broadcastState();
            }
            break;
        case 'REMOVE_SEGMENT':
            if (data.isAdmin) {
               removeSegment(data.index, true);
            }
            break;
        case 'CLEAR_HISTORY':
            if (data.isAdmin) {
                state.history = [];
                renderHistory();
                this.broadcastState();
            }
            break;
        case 'ADMIN_RIG':
            if (data.isAdmin) state.adminRig = data.rig;
            break;
    }
  };

  // Map Joiner Data Listeners
  mp.handleJoinerData = function(data) {
    switch(data.type) {
        case 'FULL_STATE':
        case 'STATE_UPDATE':
            state.players = data.state.players;
            state.segments = data.state.segments;
            state.history = data.state.history;
            state.currentPlayerIndex = data.state.currentPlayerIndex;
            state.roundNumber = data.state.roundNumber;
            
            if (state.theme !== data.state.theme) setTheme(data.state.theme, true);
            else renderSegmentList();
            
            updateTurnBanner();
            renderHistory();
            updateAdminDropdowns();
            break;
        case 'SPIN_START':
            executeClientSpin(data.targetAngle, data.spinDuration, data.playerName);
            break;
    }
  };

  const sound = new SoundManager();

  // --- DOM MAP ---
  const elements = {
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
    roomStatusBadge: document.getElementById('roomStatusBadge'),

    wheelCanvas: document.getElementById('wheelCanvas'),
    btnSpin: document.getElementById('btnSpin'),
    tickerPointer: document.getElementById('tickerPointer'),
    studsRing: document.getElementById('studsRing'),
    wheelStatusText: document.getElementById('wheelStatusText'),
    
    btnRandomOptions: document.getElementById('btnRandomOptions'),
    btnRandomOptionsSide: document.getElementById('btnRandomOptionsSide'),
    btnShuffleSegments: document.getElementById('btnShuffleSegments'),
    btnPresetsModalOpen: document.getElementById('btnPresetsModalOpen'),
    styleSwitcher: document.getElementById('styleSwitcher'),
    
    inputSegment: document.getElementById('inputSegment'),
    btnAddSegment: document.getElementById('btnAddSegment'),
    segmentList: document.getElementById('segmentList'),
    segmentCount: document.getElementById('segmentCount'),
    emptySegmentState: document.getElementById('emptySegmentState'),
    btnClearSegments: document.getElementById('btnClearSegments'),
    btnResetDefault: document.getElementById('btnResetDefault'),
    historyList: document.getElementById('historyList'),
    btnClearHistory: document.getElementById('btnClearHistory'),

    lobbyModal: document.getElementById('lobbyModal'),
    inputYourName: document.getElementById('inputYourName'),
    tabHostBtn: document.getElementById('tabHostBtn'),
    tabJoinBtn: document.getElementById('tabJoinBtn'),
    tabLocalBtn: document.getElementById('tabLocalBtn'),
    panelHost: document.getElementById('panelHost'),
    panelJoin: document.getElementById('panelJoin'),
    panelLocal: document.getElementById('panelLocal'),
    
    hostGeneratedCode: document.getElementById('hostGeneratedCode'),
    btnCopyHostCode: document.getElementById('btnCopyHostCode'),
    hostPlayerCount: document.getElementById('hostPlayerCount'),
    hostPlayersChips: document.getElementById('hostPlayersChips'),
    btnStartHostGame: document.getElementById('btnStartHostGame'),

    inputJoinRoomCode: document.getElementById('inputJoinRoomCode'),
    btnConnectJoinGame: document.getElementById('btnConnectJoinGame'),

    inputLocalPlayerName: document.getElementById('inputLocalPlayerName'),
    btnAddLocalPlayer: document.getElementById('btnAddLocalPlayer'),
    localPlayerCount: document.getElementById('localPlayerCount'),
    localPlayersChips: document.getElementById('localPlayersChips'),
    btnStartLocalGame: document.getElementById('btnStartLocalGame'),

    btnAdminSecretMenu: document.getElementById('btnAdminSecretMenu'),
    adminModal: document.getElementById('adminModal'),
    btnCloseAdminModal: document.getElementById('btnCloseAdminModal'),
    adminSelectPlayer: document.getElementById('adminSelectPlayer'),
    btnAdminEqualChances: document.getElementById('btnAdminEqualChances'),
    adminSlicesList: document.getElementById('adminSlicesList'),
    btnSaveAdminChances: document.getElementById('btnSaveAdminChances'),

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

  function saveState() {
    try {
      localStorage.setItem('fortuna_segments', JSON.stringify(state.segments));
      localStorage.setItem('fortuna_theme', state.theme);
    } catch (e) {}
  }

  function loadState() {
    try {
      const storedTheme = localStorage.getItem('fortuna_theme');
      if (storedTheme && THEME_PALETTES[storedTheme]) state.theme = storedTheme;
      
      const storedSegments = localStorage.getItem('fortuna_segments');
      if (storedSegments) {
        const parsed = JSON.parse(storedSegments);
        if (Array.isArray(parsed) && parsed.length > 0) state.segments = parsed;
      }
    } catch (e) {}
  }

  // --- GUEST RESTRICTION UI FILTER ---
  function applyGuestRestrictions() {
    const isGuest = mp.mode === 'join' && !state.isAdmin;
    
    if (isGuest) {
        document.body.classList.add('is-guest');
        const hides = [
            elements.inputSegment.parentElement.parentElement, 
            elements.btnClearSegments.parentElement, 
            elements.styleSwitcher,
            elements.btnManagePlayers,
            elements.btnNextTurnManual
        ];
        hides.forEach(el => { if(el) el.classList.add('hidden'); });
        
        const qb = document.querySelector('.quickbar-buttons');
        if(qb) qb.classList.add('hidden');

        if(elements.btnClearHistory) elements.btnClearHistory.classList.add('hidden');
    } else {
        document.body.classList.remove('is-guest');
        const hides = [
            elements.inputSegment.parentElement.parentElement,
            elements.btnClearSegments.parentElement,
            elements.styleSwitcher,
            elements.btnManagePlayers,
            elements.btnNextTurnManual
        ];
        hides.forEach(el => { if(el) el.classList.remove('hidden'); });
        
        const qb = document.querySelector('.quickbar-buttons');
        if(qb) qb.classList.remove('hidden');

        if(elements.btnClearHistory) elements.btnClearHistory.classList.remove('hidden');
    }
    
    renderSegmentList();
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

  // --- PHYSICS ENGINE & PLAYER-SPECIFIC RIGGING ---
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
      if(elements.inputSegment) elements.inputSegment.focus();
      return;
    }
    if (state.players.length === 0 && mp.mode !== 'join') {
      showLobbyModal();
      return;
    }

    // --- TURN LOCKING LOGIC ---
    const currentPlayer = getCurrentPlayerName();
    const canSpin = (mp.mode === 'local') || state.isAdmin || (mp.myName === currentPlayer);
    
    if (!canSpin) {
        alert(`It's not your turn! Waiting for ${currentPlayer} to spin.`);
        return;
    }

    if (mp.mode === 'join') {
        mp.broadcast({ type: 'REQUEST_SPIN', playerName: state.isAdmin ? 'Admin' : mp.myName });
    } else {
        spinWheelHostLogic(state.isAdmin ? 'Admin' : getCurrentPlayerName());
    }
  }

  function spinWheelHostLogic(spinnerName) {
    state.isSpinning = true;
    
    const minTurns = 6;
    const maxTurns = 9;
    const turns = minTurns + Math.random() * (maxTurns - minTurns);
    const randomAngleOffset = Math.random() * Math.PI * 2;

    state.startAngle = state.currentAngle;
    let targetAngleFinal = state.startAngle + turns * Math.PI * 2 + randomAngleOffset; // Default perfectly fair spin

    // ----- INDIVIDUAL PLAYER RIGGING INJECTION -----
    const playerWhosTurnItIs = getCurrentPlayerName();
    
    if (state.adminRig.active && state.adminRig.playerConfigs[playerWhosTurnItIs]) {
      const weights = state.adminRig.playerConfigs[playerWhosTurnItIs];
      
      if (weights && weights.length === state.segments.length) {
        
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        if (totalWeight > 0) {
          
          let randomRoll = Math.random() * totalWeight;
          let currentWeightSum = 0;
          let targetSliceIndex = 0;

          for (let i = 0; i < weights.length; i++) {
            currentWeightSum += weights[i];
            if (randomRoll < currentWeightSum) {
              targetSliceIndex = i;
              break;
            }
          }

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

    const spinDuration = 4800 + Math.random() * 1000;

    if (mp.mode === 'host') {
        mp.broadcast({
            type: 'SPIN_START',
            targetAngle: targetAngleFinal,
            spinDuration: spinDuration,
            playerName: spinnerName 
        });
    }

    executeClientSpin(targetAngleFinal, spinDuration, spinnerName);
  }

  function executeClientSpin(targetAngle, duration, spinnerName) {
    if (!state.isSpinning && mp.mode === 'join') state.isSpinning = true;
    
    sound.playWhoosh();
    isAmbientActive = false; 
    
    if (elements.btnSpin) elements.btnSpin.disabled = true;
    
    const playerText = (spinnerName && spinnerName !== 'Admin') ? spinnerName : getCurrentPlayerName();
    elements.wheelStatusText.innerText = `Spinning for ${playerText}...`;

    state.startAngle = state.currentAngle;
    state.targetAngle = targetAngle;
    state.spinDuration = duration;
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
    animateStuds(false);

    const winningIndex = getActivePointerSegmentIndex(state.currentAngle);
    const winningPrize = state.segments[winningIndex];
    lastWinningSegment = { index: winningIndex, text: winningPrize };

    const currentPlayer = getCurrentPlayerName();
    
    addHistoryRecordLocal(currentPlayer, winningPrize);
    
    sound.playWinFanfare();
    triggerConfettiBurst();
    showWinnerModal(currentPlayer, winningPrize);
    
    updateSpinButtonState();
  }

  // --- PLAYERS MANAGEMENT ---
  function getCurrentPlayerName() {
    if (state.players.length === 0) return 'Guest';
    return state.players[state.currentPlayerIndex % state.players.length];
  }

  function updateTurnBanner() {
    const playerName = getCurrentPlayerName() || 'Guest';
    
    if (elements.currentTurnName) elements.currentTurnName.innerText = playerName;
    if (elements.turnAvatarInitial) elements.turnAvatarInitial.innerText = playerName.charAt(0).toUpperCase() || '?';
    if (elements.turnRoundBadge) elements.turnRoundBadge.innerText = `Round ${state.roundNumber}`;
    if (elements.playerCountBadge) elements.playerCountBadge.innerText = state.players.length;
    
    updateSpinButtonState();
  }
  
  function updateSpinButtonState() {
    if (state.isSpinning) return;
    
    const currentPlayer = getCurrentPlayerName();
    const canSpin = (mp.mode === 'local') || state.isAdmin || (mp.myName === currentPlayer);
    
    const hubBtn = document.getElementById('btnSpin');
    if (hubBtn) {
        hubBtn.disabled = !canSpin;
        
        if (elements.wheelStatusText) {
            if (!canSpin) {
                elements.wheelStatusText.innerText = `Waiting for ${currentPlayer} to spin...`;
            } else {
                elements.wheelStatusText.innerText = `Ready for ${currentPlayer}'s spin`;
            }
        }
    }
  }

  function advanceTurn(fromNetwork = false) {
    if (state.players.length === 0) return;
    state.currentPlayerIndex++;
    if (state.currentPlayerIndex >= state.players.length) {
      state.currentPlayerIndex = 0;
      state.roundNumber++;
    }
    updateTurnBanner();

    if (!fromNetwork && mp.mode !== 'local') {
        if (mp.mode === 'host') mp.broadcastState();
        else if (state.isAdmin) mp.broadcast({ type: 'ADVANCE_TURN', isAdmin: true });
    }
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
      state.isAdmin = true;
      if (elements.btnAdminSecretMenu) elements.btnAdminSecretMenu.classList.remove('hidden');
      if (elements.wheelStatusText) elements.wheelStatusText.innerText = "Admin Stealth Rigging Unlocked.";
      return true;
    }
    return false;
  }

  function addLocalPlayer(name) {
    const clean = name.trim();
    if (!clean) return;
    if (checkAdminLogin(clean)) {
        hideLobbyModal();
        return;
    }
    mp.localQueue.push(clean);
    if (elements.inputLocalPlayerName) elements.inputLocalPlayerName.value = '';
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
    if (elements.localPlayerCount) elements.localPlayerCount.innerText = mp.localQueue.length;

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
    const name = elements.inputYourName ? elements.inputYourName.value.trim() : '';
    if (checkAdminLogin(name)) return hideLobbyModal();
    
    if (mp.localQueue.length > 0) {
      state.players = [...mp.localQueue];
      saveState();
    } else {
      if (name && name.toLowerCase() !== 'admin') {
          state.players = [name];
      } else if (state.players.length === 0) {
          state.players = ['Player 1'];
      }
    }
    hideLobbyModal();
  }

  function simulateHost() {
    const name = elements.inputYourName.value.trim();
    if (!name) return alert("Enter your name first!");
    
    if (checkAdminLogin(name)) {
        mp.myName = 'Admin';
    } else {
        mp.myName = name;
        state.isAdmin = false;
    }

    if (mp.mode === 'host') return; 
    
    let code = Math.floor(10000 + Math.random() * 90000).toString();
    mp.initHost(mp.myName, code);
    switchLobbyTab('host');
  }

  function simulateJoin() {
    const name = elements.inputYourName.value.trim();
    const code = elements.inputJoinRoomCode.value.trim();
    
    if (!name) return alert("Enter your name first!");
    if (!code) return alert("Enter a room code!");

    if (checkAdminLogin(name)) {
        mp.myName = 'Admin';
    } else {
        mp.myName = name;
        state.isAdmin = false;
    }

    if (elements.btnConnectJoinGame) {
        elements.btnConnectJoinGame.disabled = true;
        elements.btnConnectJoinGame.innerHTML = '<span>CONNECTING...</span>';
    }

    mp.initJoin(mp.myName, code);
  }

  function addPlayer(name, fromNetwork = false) {
    const clean = name.trim();
    if (!clean) return;
    state.players.push(clean);
    updateTurnBanner();
    updateAdminDropdowns();
    updateLobbyPlayersList();
    
    if (!fromNetwork && mp.mode === 'host') mp.broadcastState();
  }

  function updateLobbyPlayersList() {
      const container = elements.hostPlayersChips;
      if (!container) return;
      container.innerHTML = '';
      state.players.forEach((p, idx) => {
          container.innerHTML += `
            <div class="player-chip">
                <span class="player-chip-badge">${idx + 1}</span>
                <span>${escapeHtml(p)}</span>
            </div>`;
      });
      if (elements.hostPlayerCount) elements.hostPlayerCount.innerText = state.players.length;
  }

  // --- ADMIN RIGGING UI ---
  function updateAdminPlayerDropdown() {
    if (!elements.adminSelectPlayer) return;
    
    const currentSelection = elements.adminSelectPlayer.value;
    
    elements.adminSelectPlayer.innerHTML = '<option value="">-- Select a Player to Rig --</option>';
    state.players.forEach(p => {
      elements.adminSelectPlayer.innerHTML += `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`;
    });
    
    if (currentSelection && state.players.includes(currentSelection)) {
      elements.adminSelectPlayer.value = currentSelection;
    }
  }

  function renderAdminSlices() {
    const list = elements.adminSlicesList;
    if (!list) return;
    list.innerHTML = '';

    const targetPlayer = elements.adminSelectPlayer.value;
    
    if (!targetPlayer) {
        list.innerHTML = `<div style="color: #64748b; font-size: 0.85rem; padding: 10px; text-align: center;">Select a player from the dropdown above to edit their chances.</div>`;
        return;
    }

    if (state.segments.length === 0) {
      list.innerHTML = `<div style="color: #64748b; font-size: 0.8rem; padding: 10px;">No slices on the wheel to rig.</div>`;
      return;
    }

    let weights = state.adminRig.playerConfigs[targetPlayer];
    if (!weights || weights.length !== state.segments.length) {
       weights = state.segments.map(() => 10); 
       state.adminRig.playerConfigs[targetPlayer] = weights; 
    }

    state.segments.forEach((seg, idx) => {
      const weight = weights[idx];
      const div = document.createElement('div');
      div.style.cssText = "padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 5px; background: rgba(0,0,0,0.2); border-radius: 6px;";
      
      div.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <label style="color: white; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; font-weight: bold;">${escapeHtml(seg)}</label>
          <span id="adminRigWeightLabel_${idx}" style="color: #ef4444; font-weight: bold; font-size: 0.85rem; background: rgba(239, 68, 68, 0.15); padding: 2px 8px; border-radius: 4px;">Weight: ${weight}</span>
        </div>
        <input type="range" class="adminRigSliderMulti" data-index="${idx}" min="0" max="100" value="${weight}" style="width: 100%; accent-color: #ef4444; cursor: pointer;">
      `;
      list.appendChild(div);
    });

    const sliders = list.querySelectorAll('.adminRigSliderMulti');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const val = parseInt(e.target.value, 10);
        state.adminRig.playerConfigs[targetPlayer][idx] = val;
        document.getElementById(`adminRigWeightLabel_${idx}`).innerText = `Weight: ${val}`;
      });
    });
  }

  function updateAdminDropdowns() {
      if (!state.isAdmin) return;
      updateAdminPlayerDropdown();
      renderAdminSlices();
  }

  // --- NETWORK SYNC BROADCASTERS ---
  function broadcastSegmentsChange() {
      if (mp.mode === 'host') {
          mp.broadcastState();
      } else if (mp.mode === 'join' && state.isAdmin) {
          mp.broadcast({ type: 'UPDATE_SEGMENTS', segments: state.segments, isAdmin: true });
      }
  }

  // --- SIDEBAR SEGMENTS MANAGEMENT ---
  function renderSegmentList() {
    const list = elements.segmentList;
    if (!list) return;
    list.innerHTML = '';

    if (elements.segmentCount) elements.segmentCount.innerText = state.segments.length;

    if (state.segments.length === 0) {
      if (elements.emptySegmentState) elements.emptySegmentState.classList.remove('hidden');
      invalidateWheelCache();
      return;
    }

    if (elements.emptySegmentState) elements.emptySegmentState.classList.add('hidden');
    const isGuest = mp.mode === 'join' && !state.isAdmin;
    const palette = getCurrentPalette();

    state.segments.forEach((item, index) => {
      const colorScheme = palette[index % palette.length];
      const div = document.createElement('div');
      div.className = 'segment-item';

      const actionsHtml = isGuest ? '' : `
        <button class="btn-item-delete" data-index="${index}" title="Remove slice">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      `;

      div.innerHTML = `
        <div class="segment-item-left">
          <div class="segment-color-dot" style="background: ${colorScheme.bg}; border-color: ${colorScheme.border};"></div>
          <span class="segment-text" title="${escapeHtml(item)}">${escapeHtml(item)}</span>
        </div>
        <div class="segment-actions">${actionsHtml}</div>
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

  function addSegment(text, fromNetwork = false) {
    const clean = text.trim();
    if (!clean) return;
    state.segments.push(clean);
    saveState();
    renderSegmentList();

    const container = elements.segmentList ? elements.segmentList.parentElement : null;
    if (container) container.scrollTop = container.scrollHeight;

    if (!fromNetwork) broadcastSegmentsChange();
  }

  function removeSegment(index, fromNetwork = false) {
    if (index >= 0 && index < state.segments.length) {
      state.segments.splice(index, 1);
      saveState();
      renderSegmentList();
      if (!fromNetwork) broadcastSegmentsChange();
    }
  }

  function shuffleSegments(fromNetwork = false) {
    for (let i = state.segments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.segments[i], state.segments[j]] = [state.segments[j], state.segments[i]];
    }
    saveState();
    renderSegmentList();
    if (!fromNetwork) broadcastSegmentsChange();
  }

  // --- RANDOM OPTIONS (.txt Exclusively) ---
  async function fetchRandomOptionsPool() {
    try {
      const response = await fetch('RandomOptions.txt?t=' + Date.now());
      if (!response.ok) throw new Error('HTTP status ' + response.status);
      
      const text = await response.text();
      return text.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
        
    } catch (err) {
      console.error('Failed to load RandomOptions.txt', err);
      alert('Could not load RandomOptions.txt. Ensure the file is inside the main folder and you are running via a Local Web Server.');
      return [];
    }
  }

  async function applyRandomOptions(fromNetwork = false) {
    const pool = await fetchRandomOptionsPool();
    if (!pool || pool.length === 0) return;

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const count = Math.min(10, shuffled.length);
    state.segments = shuffled.slice(0, count); 

    saveState();
    renderSegmentList();
    sound.playWhoosh();
    if (elements.wheelStatusText) elements.wheelStatusText.innerText = `Loaded ${count} random slices from RandomOptions.txt!`;

    if (!fromNetwork) broadcastSegmentsChange();
  }

  function setTheme(themeName, fromNetwork = false) {
    if (!THEME_PALETTES[themeName]) themeName = 'royalGold';
    state.theme = themeName;
    document.body.dataset.theme = themeName;

    document.querySelectorAll('.style-pill').forEach((pill) => {
      if (pill.dataset.theme === themeName) pill.classList.add('active');
      else pill.classList.remove('active');
    });

    saveState();
    renderSegmentList();

    if (!fromNetwork && mp.mode !== 'local') {
        if (mp.mode === 'host') mp.broadcastState();
        else if (state.isAdmin) mp.broadcast({ type: 'UPDATE_THEME', theme: themeName, isAdmin: true });
    }
  }

  // --- HISTORY MANAGEMENT ---
  function addHistoryRecordLocal(player, prize) {
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
    if (elements.winnerPlayerBanner) elements.winnerPlayerBanner.innerText = `Awarded to ${player}!`;
    if (elements.winnerPrizeText) elements.winnerPrizeText.innerText = prize;
    
    // Everyone sees Next Player Turn text
    if (elements.btnNextTurnModal && elements.btnNextTurnModal.querySelector('span')) {
        elements.btnNextTurnModal.querySelector('span').innerText = 'Next Player Turn';
    }

    // Only host or admin can remove slices
    if (elements.btnRemoveWonSegment) {
        if (mp.mode === 'join' && !state.isAdmin) {
            elements.btnRemoveWonSegment.classList.add('hidden');
        } else {
            elements.btnRemoveWonSegment.classList.remove('hidden');
        }
    }

    if (elements.winnerModal) elements.winnerModal.classList.remove('hidden');
  }

  function hideWinnerModal() {
    if (elements.winnerModal) elements.winnerModal.classList.add('hidden');
  }

  function showPresetsModal() {
    if (elements.presetsModal) elements.presetsModal.classList.remove('hidden');
  }

  function hidePresetsModal() {
    if (elements.presetsModal) elements.presetsModal.classList.add('hidden');
  }

  function loadPreset(key) {
    if (PRESETS[key]) {
      state.segments = [...PRESETS[key]];
      saveState();
      renderSegmentList();
      hidePresetsModal();
      broadcastSegmentsChange();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    if (elements.btnSpin) elements.btnSpin.addEventListener('click', spinWheel);

    if (elements.inputSegment) {
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
    }

    if (elements.btnAddSegment) {
        elements.btnAddSegment.addEventListener('click', () => {
          const value = elements.inputSegment.value;
          if (value.trim()) {
            addSegment(value);
            elements.inputSegment.value = '';
            elements.inputSegment.focus();
          }
        });
    }

    if (elements.btnManagePlayers) {
      elements.btnManagePlayers.addEventListener('click', showLobbyModal);
    }
    
    if(elements.tabHostBtn) elements.tabHostBtn.addEventListener('click', simulateHost);
    if(elements.tabJoinBtn) elements.tabJoinBtn.addEventListener('click', () => switchLobbyTab('join'));
    if(elements.tabLocalBtn) elements.tabLocalBtn.addEventListener('click', () => switchLobbyTab('local'));

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

    if (elements.btnStartHostGame) {
      elements.btnStartHostGame.addEventListener('click', hideLobbyModal);
    }
    if (elements.btnConnectJoinGame) {
      elements.btnConnectJoinGame.addEventListener('click', simulateJoin);
    }

    if (elements.btnCopyHostCode) {
        elements.btnCopyHostCode.addEventListener('click', () => {
            navigator.clipboard.writeText(mp.roomCode || '');
            elements.btnCopyHostCode.innerText = 'Copied!';
            setTimeout(() => { elements.btnCopyHostCode.innerText = 'Copy Code'; }, 2000);
        });
    }
      
    if (document.getElementById('btnCopyRoomCode')) {
        document.getElementById('btnCopyRoomCode').addEventListener('click', (e) => {
            navigator.clipboard.writeText(mp.roomCode || '');
            const btn = e.currentTarget;
            btn.innerText = '✅';
            setTimeout(() => { btn.innerText = '📋'; }, 2000);
        });
    }

    if (elements.btnAdminSecretMenu) {
      elements.btnAdminSecretMenu.addEventListener('click', () => {
        updateAdminDropdowns();
        elements.adminModal.classList.remove('hidden');
      });
    }
    
    if (elements.adminSelectPlayer) {
       elements.adminSelectPlayer.addEventListener('change', () => {
           renderAdminSlices();
       });
    }

    if (elements.btnCloseAdminModal) {
      elements.btnCloseAdminModal.addEventListener('click', () => elements.adminModal.classList.add('hidden'));
    }

    if (elements.btnAdminEqualChances) {
      elements.btnAdminEqualChances.addEventListener('click', () => {
        const targetPlayer = elements.adminSelectPlayer.value;
        if (targetPlayer && state.adminRig.playerConfigs[targetPlayer]) {
            state.adminRig.playerConfigs[targetPlayer] = state.segments.map(() => 10);
            renderAdminSlices();
            alert(`Reset ${targetPlayer}'s chances to standard fair spins.`);
        } else {
            state.adminRig.playerConfigs = {};
            state.adminRig.active = false;
            renderAdminSlices();
            alert('All rigging cleared globally.');
        }
      });
    }

    if (elements.btnSaveAdminChances) {
      elements.btnSaveAdminChances.addEventListener('click', () => {
        const targetPlayer = elements.adminSelectPlayer.value;
        if (!targetPlayer) {
          state.adminRig.active = false;
          alert('Rigging disabled (No player selected).');
        } else {
          state.adminRig.active = true;
          alert(`Wheel is rigged! ${targetPlayer}'s spins will use your custom weights. Other players will have perfectly fair spins.`);
        }
        elements.adminModal.classList.add('hidden');

        if (mp.mode === 'join' && state.isAdmin) {
            mp.broadcast({ type: 'ADMIN_RIG', rig: state.adminRig, isAdmin: true });
        }
      });
    }

    if (elements.btnNextTurnManual) {
        elements.btnNextTurnManual.addEventListener('click', () => advanceTurn());
    }

    if (elements.btnNextTurnModal) {
        elements.btnNextTurnModal.addEventListener('click', () => {
          hideWinnerModal();
          
          if (mp.mode === 'join' && !state.isAdmin) {
             // Ask Host to advance the turn
             mp.broadcast({ type: 'REQUEST_ADVANCE_TURN' });
          } else {
             advanceTurn();
          }
        });
    }

    if (elements.btnRemoveWonSegment) {
        elements.btnRemoveWonSegment.addEventListener('click', () => {
          if (lastWinningSegment && lastWinningSegment.index !== null) {
            removeSegment(lastWinningSegment.index);
            lastWinningSegment = null;
          }
          hideWinnerModal();
          advanceTurn();
        });
    }

    if (elements.btnShuffleSegments) {
        elements.btnShuffleSegments.addEventListener('click', () => shuffleSegments());
    }

    if (elements.btnRandomOptions) {
      elements.btnRandomOptions.addEventListener('click', () => applyRandomOptions());
    }
    if (elements.btnRandomOptionsSide) {
      elements.btnRandomOptionsSide.addEventListener('click', () => applyRandomOptions());
    }

    if (elements.btnClearSegments) {
        elements.btnClearSegments.addEventListener('click', () => {
          if (confirm('Clear all options from the wheel?')) {
            state.segments = [];
            saveState();
            renderSegmentList();
            broadcastSegmentsChange();
          }
        });
    }

    if (elements.btnResetDefault) {
        elements.btnResetDefault.addEventListener('click', () => {
          state.segments = [...PRESETS.casino];
          saveState();
          renderSegmentList();
          broadcastSegmentsChange();
        });
    }

    if (elements.btnClearHistory) {
        elements.btnClearHistory.addEventListener('click', () => {
          state.history = [];
          renderHistory();
          if (mp.mode === 'host') {
              mp.broadcastState();
          } else if (mp.mode === 'join' && state.isAdmin) {
              mp.broadcast({ type: 'CLEAR_HISTORY', isAdmin: true });
          }
        });
    }

    if (elements.btnPresetsModalOpen) {
        elements.btnPresetsModalOpen.addEventListener('click', showPresetsModal);
    }
    if (elements.btnClosePresets) {
        elements.btnClosePresets.addEventListener('click', hidePresetsModal);
    }
    document.querySelectorAll('.preset-card').forEach((card) => {
      card.addEventListener('click', () => {
        const key = card.dataset.preset;
        loadPreset(key);
      });
    });

    if (elements.btnSoundToggle) {
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
    }

    [elements.lobbyModal, elements.presetsModal, elements.adminModal].forEach((overlay) => {
      if(overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.add('hidden');
            if (overlay === elements.lobbyModal && state.players.length === 0) {
               addLocalPlayer('Player 1');
               startLocalGame();
            }
          }
        });
      }
    });

    document.querySelectorAll('.style-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
        sound.playTick(1.3);
      });
    });

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
    if (typeof Peer === 'undefined') {
        alert("PeerJS failed to load from network. Multiplayer will not work.");
    }
      
    loadState();
    setTheme(state.theme); 
    renderBezelStuds();
    initWheelCanvas();
    renderSegmentList();
    renderHistory();
    setupEventListeners();
    initAmbientParticles();

    showLobbyModal();
    
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