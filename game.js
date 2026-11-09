/**
 * Stayzoo Arari: dominATE Concert Mission
 * Stray Kids Fan Game featuring Arari (B-Stay Mascot)
 * Version 7.0 - Unified Stage Architecture, Blinking Concert Lights, Transparent 3D Props, Fixed Animations & Mobile Touchpad
 */

// ─── Web Audio Sound Effects ────────────────────────────────────────────
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playGiggle() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, t);
      osc1.frequency.exponentialRampToValueAtTime(987.77, t + 0.08);
      gain1.gain.setValueAtTime(0.2, t);
      gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.09);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, t + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, t + 0.18);
      gain2.gain.setValueAtTime(0.22, t + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.1);
      osc2.stop(t + 0.21);
    } catch (e) {}
  }

  playInteract() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        gain.gain.setValueAtTime(0.14, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.2);
      });
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t + idx * 0.09);
        gain.gain.setValueAtTime(0.12, t + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.09);
        osc.stop(t + idx * 0.09 + 0.35);
      });
    } catch (e) {}
  }
}

// ─── YouTube Music Player ───────────────────────────────────────────────
let ytPlayer = null;
let musicReady = false;
let musicPlaying = false;
let currentVolume = 25;
const YT_VIDEO_ID = 'gGzpAi8-8mU';

window.onYouTubeIframeAPIReady = function() {
  try {
    ytPlayer = new YT.Player('yt-player', {
      videoId: YT_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: YT_VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          musicReady = true;
          try {
            ytPlayer.setVolume(currentVolume);
            ytPlayer.playVideo();
          } catch (e) {}
        },
        onStateChange: (event) => {
          musicPlaying = (event.data === YT.PlayerState.PLAYING);
          updateMusicUI();
        }
      }
    });
  } catch (e) {}
};

function toggleMusic() {
  if (!ytPlayer || !musicReady) return;
  try {
    if (musicPlaying) ytPlayer.pauseVideo();
    else ytPlayer.playVideo();
  } catch (e) {}
}

function setMusicVolume(vol) {
  currentVolume = parseInt(vol, 10);
  if (ytPlayer && musicReady) {
    try {
      ytPlayer.setVolume(currentVolume);
      if (currentVolume > 0 && !musicPlaying) ytPlayer.playVideo();
    } catch (e) {}
  }
  const label = document.getElementById('volume-label');
  if (label) label.textContent = `${currentVolume}%`;
}

function updateMusicUI() {
  const btn = document.getElementById('btn-music-toggle');
  const icon = document.getElementById('music-icon');
  if (btn) btn.classList.toggle('active', musicPlaying);
  if (icon) icon.textContent = musicPlaying ? '⏸' : '♪';
}

// ─── World Dimensions & Stage Layout ────────────────────────────────────
const WORLD_W = 2600;
const WORLD_H = 1800;

// Authentic Stage Speakers
const SPEAKERS = [
  { x: 420, y: 560, dir: 'right' },
  { x: 420, y: 760, dir: 'right' },
  { x: 1140, y: 980, dir: 'left' },
  { x: 1460, y: 980, dir: 'right' },
  { x: 980, y: 1460, dir: 'left' },
  { x: 1620, y: 1460, dir: 'right' },
  { x: 2180, y: 560, dir: 'left' },
  { x: 2180, y: 760, dir: 'left' }
];

const LIGHT_POLES = [
  { x: 390, y: 510 }, { x: 390, y: 780 },
  { x: 1180, y: 910 }, { x: 1420, y: 910 },
  { x: 1020, y: 1370 }, { x: 1580, y: 1370 },
  { x: 2210, y: 510 }, { x: 2210, y: 780 }
];

const STAIRS = [
  { x: 384, y: 650, w: 32, h: 48 }
];

// Runway Edge Marker Lamps (lining the catwalk and B-stage)
const RUNWAY_LAMPS = [];
for (let ly = 910; ly <= 1360; ly += 55) {
  RUNWAY_LAMPS.push({ x: 1182, y: ly });
  RUNWAY_LAMPS.push({ x: 1418, y: ly });
}
for (let ly = 1370; ly <= 1680; ly += 60) {
  RUNWAY_LAMPS.push({ x: 1024, y: ly });
  RUNWAY_LAMPS.push({ x: 1576, y: ly });
}
for (let lx = 1030; lx <= 1570; lx += 60) {
  RUNWAY_LAMPS.push({ x: lx, y: 1690 });
}

// Metal Barricades Line (Coherent Vertical & Horizontal Orientation)
const BARRICADES = [];
// Catwalk side barriers (Vertical orientation: rot = 90)
for (let by = 920; by <= 1340; by += 80) {
  BARRICADES.push({ x: 1165, y: by, rot: 90 });
  BARRICADES.push({ x: 1435, y: by, rot: 90 });
}
// Front stage barriers (Horizontal orientation: rot = 0)
for (let bx = 390; bx <= 1140; bx += 85) {
  BARRICADES.push({ x: bx, y: 895, rot: 0 });
}
for (let bx = 1460; bx <= 2210; bx += 85) {
  BARRICADES.push({ x: bx, y: 895, rot: 0 });
}
// B-Stage side barriers (Vertical: rot = 90)
for (let by = 1380; by <= 1680; by += 80) {
  BARRICADES.push({ x: 1005, y: by, rot: 90 });
  BARRICADES.push({ x: 1595, y: by, rot: 90 });
}
// B-Stage bottom barriers (Horizontal: rot = 0)
for (let bx = 1020; bx <= 1580; bx += 85) {
  BARRICADES.push({ x: bx, y: 1715, rot: 0 });
}

// No security guards - only lights and barricades mark crowd boundaries
const GUARDS = [];


// Solid Colliders: Keep stage open, block crowd and outer bounds
const COLLIDERS = [
  { x: 0, y: 0, w: WORLD_W, h: 70, hard: true },
  { x: 0, y: WORLD_H - 40, w: WORLD_W, h: 40, hard: true },
  { x: 0, y: 0, w: 60, h: WORLD_H, hard: true },
  { x: WORLD_W - 60, y: 0, w: 60, h: WORLD_H, hard: true },

  // Crowd areas (inaccessible)
  { x: 0, y: 480, w: 380, h: 160, hard: true },
  { x: 0, y: 700, w: 380, h: 1100, hard: true },
  { x: 2220, y: 480, w: 380, h: 1320, hard: true },
  { x: 380, y: 900, w: 780, h: 460, hard: true },
  { x: 1440, y: 900, w: 780, h: 460, hard: true },
  { x: 0, y: 1360, w: 1000, h: 440, hard: true },
  { x: 1600, y: 1360, w: 1000, h: 440, hard: true },

  // Speakers
  ...SPEAKERS.map(s => ({ x: s.x - 16, y: s.y - 28, w: 32, h: 56, hard: false }))
];

// ─── Stray Kids Members (Spread across accessible Stage, Catwalk, B-Stage & Backstage) ──────
const MEMBERS = [
  {
    id: 0, name: 'Lee Know', skzoo: 'Leebit', role: 'Dançarino Principal / Vocal',
    color: '#a855f7', x: 1520, y: 620, zone: 'Palco Principal', found: false,
    dialogue: [
      'Olá Arari! Que alegria ver uma mascote tão expressiva aqui no palco!',
      'Gostei muito dos seus passos de asa! Já vi que você tem o ritmo e a paixão brasileira!',
      'Recebemos todo o amor dos B-STAYs no show! Vamos continuar dançando juntos!'
    ]
  },
  {
    id: 1, name: 'HAN', skzoo: 'Han Quokka', role: 'All-Rounder / Rapper / Produtor',
    color: '#f59e0b', x: 750, y: 260, zone: 'Backstage Lounge', found: false,
    dialogue: [
      'E aí, Arari! Você veio voando do Brasil até aqui?! Haha, que incrível!',
      'Ouvir a plateia brasileira cantando cada verso das nossas músicas foi surreal de emocionante!',
      'Muito obrigado pelo apoio e carinho! O Brasil tem uma energia única no mundo inteiro!'
    ]
  },
  {
    id: 2, name: 'Bang Chan', skzoo: 'Wolf Chan', role: 'Líder / Produtor / Vocal',
    color: '#ef4444', x: 1300, y: 1620, zone: 'Palco B-Stage', found: false,
    dialogue: [
      "G'day Arari! Que honra receber a mascote oficial dos B-STAYs no nosso show dominATE!",
      'Os fãs do Brasil são nossa grande inspiração e sempre nos dão forças para superar desafios.',
      'Obrigado por essa linda homenagem! Stray Kids e STAY estarão sempre juntos pelo mundo!'
    ]
  },
  {
    id: 3, name: 'Felix', skzoo: 'BbokAri', role: 'Dançarino Líder / Rapper',
    color: '#fb923c', x: 1300, y: 1140, zone: 'Passarela Central', found: false,
    dialogue: [
      'Arari! Minha grande parceira do Trio Caótico! (Arari + BbokAri + Dwaekki!)',
      'Você é incrivelmente fofa! O amor dos fãs brasileiros é tão quente e acolhedor...',
      'Muito obrigado pela visita e pela homenagem, B-Stay! Saranghaeyo, Brasil! ♥'
    ]
  },
  {
    id: 4, name: 'Seungmin', skzoo: 'PuppyM', role: 'Vocalista Principal',
    color: '#22c55e', x: 2020, y: 740, zone: 'Asa Direita do Palco', found: false,
    dialogue: [
      'Arari! Você canta bem também ou só bate as asas? Haha!',
      'A harmonia das vozes dos B-STAYs cantando nos estádios é perfeita, arrepia até a alma!',
      'Muito obrigado pelo amor contínuo. Prometemos voltar ao Brasil sempre!'
    ]
  },
  {
    id: 5, name: 'I.N', skzoo: 'FoxI.Ny', role: 'Vocalista / Maknae',
    color: '#38bdf8', x: 1120, y: 1460, zone: 'Palco B-Stage', found: false,
    dialogue: [
      'Arari! Que mascote linda! Fiquei encantado com suas cores tropicais!',
      'Nunca imaginei ver um projeto tão carinhoso criado exclusivamente pelos fãs do Brasil!',
      'Obrigado B-Stay! Vocês são os melhores fãs do mundo inteiro, sem dúvida!'
    ]
  },
  {
    id: 6, name: 'Changbin', skzoo: 'Dwaekki', role: 'Rapper Principal / Produtor',
    color: '#f43f5e', x: 1850, y: 260, zone: 'Backstage Áudio', found: false,
    dialogue: [
      'YOH! Arari! O Dwaekki do Trio Caótico está aqui treinando firme!',
      'A força dos gritos dos B-STAYs no show fez o chão do estádio tremer de verdade!',
      'Obrigado de coração! A vibe do Brasil é pura energia e motivação pra gente!'
    ]
  },
  {
    id: 7, name: 'Hyunjin', skzoo: 'Jiniret', role: 'Dançarino Principal / Rapper / Visual',
    color: '#818cf8', x: 580, y: 740, zone: 'Asa Esquerda do Palco', found: false,
    dialogue: [
      'Arari! Que espírito artístico deslumbrante você tem!',
      'A criatividade e o carinho dos fãs brasileiros tocaram profundamente o meu coração.',
      'Essa homenagem ficará guardada para sempre na memória do Stray Kids!'
    ]
  }
];

// Clean items: Hearts & Peanuts
const COLLECTIBLES_CONFIG = [
  { x: 800, y: 620, type: 'heart' },
  { x: 1100, y: 720, type: 'peanut' },
  { x: 1500, y: 720, type: 'heart' },
  { x: 1800, y: 620, type: 'peanut' },
  { x: 1300, y: 1080, type: 'heart' },
  { x: 1300, y: 1320, type: 'peanut' },
  { x: 1150, y: 1500, type: 'heart' },
  { x: 1450, y: 1500, type: 'peanut' },
  { x: 500, y: 220, type: 'heart' },
  { x: 700, y: 300, type: 'peanut' },
  { x: 1000, y: 220, type: 'heart' },
  { x: 1400, y: 300, type: 'peanut' },
  { x: 1700, y: 220, type: 'heart' },
  { x: 2000, y: 300, type: 'peanut' },
  { x: 1220, y: 1650, type: 'heart' },
  { x: 1380, y: 1650, type: 'peanut' }
];

// ─── Game Engine ────────────────────────────────────────────────────────
class ArariGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.sound = new SoundController();

    this.state = 'playing';
    this.score = 0;
    this.foundCount = 0;
    this.zoom = 1.9;
    this.targetZoom = 1.9;
    this.dpr = 1;

    this.camera = { x: 1300 - window.innerWidth / 4, y: 1100 - window.innerHeight / 4 };

    // Arari Mascot
    this.arari = {
      x: 1300,
      y: 1100,
      speed: 4.0,
      flySpeed: 6.4,
      facing: 0, // 0=down, 1=up, 2=right, 3=left
      animFrame: 0,
      animTimer: 0,
      moving: false,
      flying: false,
      dancing: false,
      danceTimer: 0
    };

    // Controls
    this.keys = {};
    this.touchJoystick = { active: false, moveX: 0, moveY: 0 };

    this.nearMember = null;
    this.currentMember = null;
    this.dialogueQueue = [];
    this.dialogueIndex = 0;

    this.members = MEMBERS.map(m => ({ ...m, dialogue: [...m.dialogue] }));
    this.collectibles = [];
    this.particles = [];
    this.floatingTexts = [];

    this.assets = {
      arariSheet: null,
      memberTextures: [],
      memberAtlases: [],
      memberProfiles: [],
      tiles: {},
      props: {},
      items: {},
      skzArch: null,
      cyberWall: null,
      barricade: null,
      securityGuard: null,
      edgeLamp: null,
      glassPlanter: null,
      diagStairs: null,
      stackedCrates: null,
      spotlightBeams: null,
      metalTruss: null
    };

    this.patterns = {};
    this.init();
  }

  async init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.setupInput();
    this.setupMobileTouchpad();
    this.setupUI();
    this.spawnCollectibles();
    this.renderMembersHUD();

    await this.loadAssets();
    this.initPatterns();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(window.innerWidth * this.dpr);
    this.canvas.height = Math.floor(window.innerHeight * this.dpr);
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
  }

  loadImage(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  loadJSON(src) {
    return fetch(src).then(r => r.json()).catch(() => null);
  }

  async loadAssets() {
    const promises = [];

    // Arari Spritesheet
    promises.push(this.loadImage('assets/arari/arari_spritesheet.png?v=8.5').then(img => {
      this.assets.arariSheet = img;
    }));

    // Metal Barricade (Clean high-res pixel-art)
    promises.push(this.loadImage('assets/official/metal_barricade.png').then(img => { this.assets.barricade = img; }));
    promises.push(this.loadImage('assets/official/stage_edge_lamp.png').then(img => { this.assets.edgeLamp = img; }));
    promises.push(this.loadImage('assets/official/glass_planter.png').then(img => { this.assets.glassPlanter = img; }));
    promises.push(this.loadImage('assets/official/stacked_crates.png').then(img => { this.assets.stackedCrates = img; }));

    // Props & Tiles
    for (const name of ['speaker', 'light_pole', 'stairs']) {
      promises.push(this.loadImage(`assets/tiles/prop_${name}.png`).then(img => {
        if (img) this.assets.props[name] = img;
      }));
    }
    for (const name of ['stage_skz', 'wing_skz', 'backstage']) {
      promises.push(this.loadImage(`assets/tiles/tile_${name}.png`).then(img => {
        if (img) this.assets.tiles[name] = img;
      }));
    }

    // Collectibles: Heart & Peanut
    promises.push(this.loadImage('assets/official/heart.png').then(img => { if (img) this.assets.items['heart'] = img; }));
    promises.push(this.loadImage('assets/official/peanut.png').then(img => { if (img) this.assets.items['peanut'] = img; }));

    // SKZ Members 0..7
    for (let i = 0; i < 8; i++) {
      promises.push(this.loadImage(`assets/characters/${i}_texture.png`).then(img => {
        this.assets.memberTextures[i] = img;
      }));
      promises.push(this.loadImage(`assets/characters/${i}_profile.png`).then(img => {
        this.assets.memberProfiles[i] = img;
      }));
      promises.push(this.loadJSON(`assets/characters/${i}_atlas.json`).then(json => {
        this.assets.memberAtlases[i] = json;
      }));
    }

    await Promise.all(promises);
  }

  initPatterns() {
    for (const key of ['stage_skz', 'wing_skz', 'backstage']) {
      const img = this.assets.tiles[key];
      if (img) {
        try { this.patterns[key] = this.ctx.createPattern(img, 'repeat'); } catch (e) {}
      }
    }
  }

  spawnCollectibles() {
    this.collectibles = COLLECTIBLES_CONFIG.map(pt => ({
      type: pt.type,
      x: pt.x,
      y: pt.y,
      collected: false,
      bobOffset: Math.random() * Math.PI * 2
    }));
  }

  // ─── Touch Controls for Mobile (Full-Screen Dynamic Touchpad) ─────────
  setupMobileTouchpad() {
    const joyZone = document.getElementById('touchpad-zone');
    const joyKnob = document.getElementById('touchpad-knob');
    const maxRadius = 42;
    let touchId = null;
    let touchOriginX = 0;
    let touchOriginY = 0;

    const handleMove = (clientX, clientY) => {
      let dx = clientX - touchOriginX;
      let dy = clientY - touchOriginY;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      if (joyKnob) {
        joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      // Set velocity
      this.touchJoystick.moveX = dx / maxRadius;
      this.touchJoystick.moveY = dy / maxRadius;
      this.touchJoystick.active = (dist > 6);
    };

    // Allow touching ANYWHERE on the game canvas / screen to move
    window.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      const target = e.target;

      // Ignore touch if interacting with action buttons, menu, or modals
      if (
        target.closest('#touch-action-buttons') ||
        target.closest('#hud') ||
        target.closest('.modal-card') ||
        target.closest('#menu-panel')
      ) {
        return;
      }

      // In dialogue state, tapping anywhere advances dialogue
      if (this.state === 'dialogue') {
        e.preventDefault();
        this.sound.init();
        this.advanceDialogue();
        return;
      }

      if (this.state !== 'playing') return;

      // Direct tap-to-talk: Tapping a member immediately initiates conversation!
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const canvasX = (touch.clientX - rect.left) * scaleX;
      const canvasY = (touch.clientY - rect.top) * scaleY;
      const worldX = (canvasX / (this.zoom * this.dpr)) + this.camera.x;
      const worldY = (canvasY / (this.zoom * this.dpr)) + this.camera.y;

      const tappedMember = this.members.find(m => Math.hypot(m.x - worldX, m.y - worldY) < 70);
      if (tappedMember) {
        e.preventDefault();
        this.sound.init();
        const dx = tappedMember.x - this.arari.x;
        const dy = tappedMember.y - this.arari.y;
        this.arari.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        if (Math.hypot(dx, dy) > 85) {
          this.arari.x = tappedMember.x - Math.sign(dx || 1) * 45;
          this.arari.y = tappedMember.y - Math.sign(dy || 1) * 35;
        }
        this.startDialogue(tappedMember);
        return;
      }

      if (touchId !== null) return; // already tracking a move touch

      e.preventDefault();
      this.sound.init();

      touchId = touch.identifier;
      touchOriginX = touch.clientX;
      touchOriginY = touch.clientY;

      if (joyZone) {
        joyZone.style.opacity = '1';
        joyZone.style.left = `${touchOriginX - 54}px`;
        joyZone.style.top = `${touchOriginY - 54}px`;
        joyZone.style.position = 'fixed';
      }

      handleMove(touch.clientX, touch.clientY);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (touchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          e.preventDefault();
          handleMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    }, { passive: false });

    const endTouch = (e) => {
      if (touchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          if (joyKnob) joyKnob.style.transform = 'translate(0px, 0px)';
          if (joyZone) {
            joyZone.style.opacity = '0.35';
            joyZone.style.position = '';
            joyZone.style.left = '';
            joyZone.style.top = '';
          }
          this.touchJoystick.moveX = 0;
          this.touchJoystick.moveY = 0;
          this.touchJoystick.active = false;
          break;
        }
      }
    };

    window.addEventListener('touchend', endTouch, { passive: false });
    window.addEventListener('touchcancel', endTouch, { passive: false });

    // Button X on mobile
    const btnX = document.getElementById('btn-action-x');
    if (btnX) {
      const triggerX = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.sound.init();
        if (this.state === 'dialogue') {
          this.advanceDialogue();
        } else if (this.state === 'playing' && this.nearMember) {
          this.startDialogue(this.nearMember);
        }
      };
      btnX.addEventListener('touchstart', triggerX, { passive: false });
      btnX.addEventListener('click', triggerX);
    }

    // Button Fly on mobile
    const btnFly = document.getElementById('btn-action-fly');
    if (btnFly) {
      const triggerFly = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.sound.init();
        this.arari.flying = !this.arari.flying;
        this.addParticles(this.arari.x, this.arari.y, '#38bdf8', 8);
      };
      btnFly.addEventListener('touchstart', triggerFly, { passive: false });
      btnFly.addEventListener('click', triggerFly);
    }
  }

  setupInput() {
    window.addEventListener('keydown', e => {
      this.sound.init();
      this.keys[e.code] = true;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (this.state === 'dialogue') {
          this.advanceDialogue();
        } else if (this.state === 'playing' && this.nearMember) {
          this.startDialogue(this.nearMember);
        }
      }

      if (e.code === 'KeyF' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.arari.flying = !this.arari.flying;
        this.addParticles(this.arari.x, this.arari.y, '#38bdf8', 6);
      }
    });

    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
  }

  setupUI() {
    const volSlider = document.getElementById('volume-slider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        this.sound.init();
        setMusicVolume(e.target.value);
      });
    }

    const btnMusic = document.getElementById('btn-music-toggle');
    if (btnMusic) {
      btnMusic.addEventListener('click', () => {
        this.sound.init();
        toggleMusic();
      });
    }

    const btnZoom = document.getElementById('btn-zoom');
    if (btnZoom) {
      btnZoom.addEventListener('click', () => {
        this.sound.init();
        this.targetZoom = this.targetZoom === 1.9 ? 2.5 : (this.targetZoom === 2.5 ? 1.5 : 1.9);
      });
    }

    const btnSound = document.getElementById('btn-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.sound.init();
        this.sound.enabled = !this.sound.enabled;
        btnSound.textContent = this.sound.enabled ? '🔊' : '🔇';
      });
    }

    const btnDiagNext = document.getElementById('dialogue-btn-next');
    if (btnDiagNext) btnDiagNext.addEventListener('click', () => this.advanceDialogue());

    const diagBox = document.getElementById('dialogue-box');
    if (diagBox) {
      diagBox.addEventListener('click', () => this.advanceDialogue());
    }

    this.canvas.addEventListener('click', (e) => {
      if (this.state === 'dialogue') {
        this.advanceDialogue();
        return;
      }
      if (this.state !== 'playing') return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;
      const worldX = (canvasX / (this.zoom * this.dpr)) + this.camera.x;
      const worldY = (canvasY / (this.zoom * this.dpr)) + this.camera.y;

      const target = this.members.find(m => Math.hypot(m.x - worldX, m.y - worldY) < 70);
      if (target) {
        this.sound.init();
        const dx = target.x - this.arari.x;
        const dy = target.y - this.arari.y;
        this.arari.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        if (Math.hypot(dx, dy) > 85) {
          this.arari.x = target.x - Math.sign(dx || 1) * 45;
          this.arari.y = target.y - Math.sign(dy || 1) * 35;
        }
        this.startDialogue(target);
      }
    });

    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) btnReplay.addEventListener('click', () => this.resetGame());
  }

  resetGame() {
    document.getElementById('tribute-modal').classList.add('hidden');
    this.foundCount = 0;
    this.score = 0;
    this.members.forEach(m => m.found = false);
    this.arari.x = 1300;
    this.arari.y = 1100;
    this.renderMembersHUD();
    this.updateScoreUI();
    this.spawnCollectibles();
  }

  startDialogue(member) {
    this.state = 'dialogue';
    this.currentMember = member;
    this.dialogueQueue = [...member.dialogue];
    this.dialogueIndex = 0;
    this.sound.playInteract();
    this.showDialogue(
      member.name,
      member.skzoo,
      member.role,
      this.dialogueQueue[0],
      member.id
    );
  }

  advanceDialogue() {
    if (this.state !== 'dialogue' || !this.currentMember) return;
    this.dialogueIndex++;

    if (this.dialogueIndex < this.dialogueQueue.length) {
      this.sound.playInteract();
      this.showDialogue(
        this.currentMember.name,
        this.currentMember.skzoo,
        this.currentMember.role,
        this.dialogueQueue[this.dialogueIndex],
        this.currentMember.id
      );
    } else {
      this.closeDialogue();
      this.currentMember.found = true;
      this.foundCount++;
      this.score += 150;
      this.sound.playFanfare();

      this.addParticles(this.currentMember.x, this.currentMember.y, this.currentMember.color, 25);
      this.renderMembersHUD();
      this.updateScoreUI();

      this.state = 'playing';
      this.arari.dancing = true;
      this.arari.danceTimer = 2.0;

      if (this.foundCount >= 8) {
        setTimeout(() => this.triggerTributeFinale(), 1200);
      }
    }
  }

  showDialogue(name, skzoo, role, text, memberIdx) {
    const box = document.getElementById('dialogue-box');
    const spk = document.getElementById('dialogue-speaker');
    const txt = document.getElementById('dialogue-text');
    const avatar = document.getElementById('dialogue-avatar');

    if (!box) return;
    box.classList.remove('hidden');
    if (spk) spk.innerHTML = `${name} <small style="color:#aaa;font-size:10px;">(${skzoo} - ${role})</small>`;
    if (txt) txt.textContent = text;
    if (avatar) {
      avatar.src = `assets/characters/${memberIdx}_profile.png`;
      avatar.style.borderColor = this.currentMember.color;
    }
  }

  closeDialogue() {
    const box = document.getElementById('dialogue-box');
    if (box) box.classList.add('hidden');
  }

  triggerTributeFinale() {
    this.state = 'tribute';
    this.sound.playFanfare();
    const modal = document.getElementById('tribute-modal');
    if (modal) modal.classList.remove('hidden');

    for (let i = 0; i < 60; i++) {
      this.addParticles(
        this.arari.x + (Math.random() - 0.5) * 400,
        this.arari.y + (Math.random() - 0.5) * 300,
        ['#ffd700', '#38bdf8', '#e879f9', '#4ade80'][Math.floor(Math.random() * 4)],
        1
      );
    }
  }

  renderMembersHUD() {
    const container = document.getElementById('members-list');
    if (container) {
      container.innerHTML = '';
      this.members.forEach(m => {
        const item = document.createElement('div');
        item.className = 'member-item' + (m.found ? ' found' : '');
        item.style.borderColor = m.color;

        const img = document.createElement('img');
        img.src = `assets/characters/${m.id}_profile.png`;
        img.style.filter = m.found ? 'none' : 'grayscale(1) opacity(0.6)';

        const textSpan = document.createElement('span');
        textSpan.textContent = m.found ? m.name : '??????';
        if (m.found) textSpan.style.color = m.color;

        item.appendChild(img);
        item.appendChild(textSpan);
        container.appendChild(item);
      });
    }

    const counter = document.getElementById('members-counter');
    if (counter) counter.textContent = `${this.foundCount}/8`;
  }

  updateScoreUI() {
    const el = document.getElementById('score-display');
    if (el) el.textContent = this.score;
  }

  addParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 3.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1.0,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }

  addFloatingText(x, y, text) {
    this.floatingTexts.push({ x, y: y - 20, text, life: 1.0, vy: -1.2 });
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt * 1.5;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life -= dt * 1.2;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  checkCollision(nextX, nextY) {
    const radius = 16;
    for (const c of COLLIDERS) {
      if (this.arari.flying && !c.hard) continue;

      if (
        nextX + radius > c.x &&
        nextX - radius < c.x + c.w &&
        nextY + radius > c.y &&
        nextY - radius < c.y + c.h
      ) {
        return true;
      }
    }

    // Solid collision with Stray Kids members on stage (Arari won't walk through them!)
    if (!this.arari.flying && this.members) {
      const memberRadius = 24;
      for (const m of this.members) {
        const dist = Math.hypot(nextX - m.x, nextY - m.y);
        if (dist < memberRadius) {
          return true;
        }
      }
    }

    return false;
  }

  update(dt) {
    this.zoom += (this.targetZoom - this.zoom) * 0.1;

    if (this.arari.dancing) {
      this.arari.danceTimer -= dt;
      if (this.arari.danceTimer <= 0) this.arari.dancing = false;
    }

    if (this.state === 'playing') {
      let dx = 0;
      let dy = 0;

      // Keyboard input (WASD / Arrows)
      if (this.keys['ArrowLeft'] || this.keys['KeyA']) dx -= 1;
      if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += 1;
      if (this.keys['ArrowUp'] || this.keys['KeyW']) dy -= 1;
      if (this.keys['ArrowDown'] || this.keys['KeyS']) dy += 1;

      // Mobile Dynamic Touch Joystick input
      if (this.touchJoystick.active) {
        dx = this.touchJoystick.moveX;
        dy = this.touchJoystick.moveY;
      } else if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      this.arari.moving = (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05);
      const spd = this.arari.flying ? this.arari.flySpeed : this.arari.speed;

      if (this.arari.moving) {
        // True 8-directional facing angle
        const angle = Math.atan2(dy, dx); // -PI to +PI
        if (angle >= -Math.PI / 8 && angle <= Math.PI / 8) {
          this.arari.facing = 2; // Right
        } else if (angle > Math.PI / 8 && angle < (3 * Math.PI) / 8) {
          this.arari.facing = 4; // Down-Right
        } else if (angle >= (3 * Math.PI) / 8 && angle <= (5 * Math.PI) / 8) {
          this.arari.facing = 0; // Down
        } else if (angle > (5 * Math.PI) / 8 && angle < (7 * Math.PI) / 8) {
          this.arari.facing = 5; // Down-Left
        } else if (angle >= (7 * Math.PI) / 8 || angle <= (-7 * Math.PI) / 8) {
          this.arari.facing = 3; // Left
        } else if (angle > (-7 * Math.PI) / 8 && angle < (-5 * Math.PI) / 8) {
          this.arari.facing = 7; // Up-Left
        } else if (angle >= (-5 * Math.PI) / 8 && angle <= (-3 * Math.PI) / 8) {
          this.arari.facing = 1; // Up
        } else if (angle > (-3 * Math.PI) / 8 && angle < -Math.PI / 8) {
          this.arari.facing = 6; // Up-Right
        }

        const nextX = this.arari.x + dx * spd;
        const nextY = this.arari.y + dy * spd;

        if (!this.checkCollision(nextX, this.arari.y)) this.arari.x = nextX;
        if (!this.checkCollision(this.arari.x, nextY)) this.arari.y = nextY;

        // Animate legs and wings crisply
        // frameDuration controls animation FPS: 0.055 = ~18fps for walk, 0.065 for fly
        this.arari.animTimer += dt;
        const frameDuration = this.arari.flying ? 0.065 : 0.055;
        if (this.arari.animTimer >= frameDuration) {
          this.arari.animTimer = 0;
          // Keep mod 5 so the frame number directly maps to sprite columns (0-4)
          this.arari.animFrame = (this.arari.animFrame + 1) % 5;
        }
      } else {
        this.arari.animFrame = 0;
      }

      // Collectibles (Hearts & Peanuts)
      for (const c of this.collectibles) {
        if (c.collected) continue;
        const dist = Math.hypot(this.arari.x - c.x, this.arari.y - c.y);
        if (dist < 28) {
          c.collected = true;
          this.score += 50;

          // Risadinha HIHI!
          this.sound.playGiggle();
          this.addFloatingText(this.arari.x, this.arari.y, 'HIHI! ✨');

          this.updateScoreUI();
          this.addParticles(c.x, c.y, '#ffd700', 10);
        }
      }

      // Proximity to members
      this.nearMember = null;
      for (const m of this.members) {
        if (m.found) continue;
        const dist = Math.hypot(this.arari.x - m.x, this.arari.y - m.y);
        if (dist < 64) {
          this.nearMember = m;
          break;
        }
      }

      const hint = document.getElementById('interaction-hint');
      if (hint) {
        if (this.nearMember) {
          hint.textContent = `Pressione [X] para falar com ${this.nearMember.name}! (${this.nearMember.skzoo})`;
          hint.classList.remove('hidden');
        } else {
          hint.classList.add('hidden');
        }
      }
    }

    // Camera follow
    const viewW = (this.canvas.width / this.dpr) / this.zoom;
    const viewH = (this.canvas.height / this.dpr) / this.zoom;
    let targetCamX = this.arari.x - viewW / 2;
    let targetCamY = this.arari.y - viewH / 2;

    targetCamX = Math.max(0, Math.min(WORLD_W - viewW, targetCamX));
    targetCamY = Math.max(0, Math.min(WORLD_H - viewH, targetCamY));

    this.camera.x += (targetCamX - this.camera.x) * 0.12;
    this.camera.y += (targetCamY - this.camera.y) * 0.12;

    this.updateParticles(dt);
  }

  // ─── Render ───────────────────────────────────────────────────────────
  render(now) {
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.fillStyle = '#080410';
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.scale(this.zoom * this.dpr, this.zoom * this.dpr);
    ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    const vx = this.camera.x - 60;
    const vy = this.camera.y - 60;
    const vw = (cw / (this.zoom * this.dpr)) + 120;
    const vh = (ch / (this.zoom * this.dpr)) + 120;

    // 1. Stadium Floor & Unified Stage Architecture
    this.drawStadium(ctx, vx, vy, vw, vh, now);

    // 2. Soundwaves
    this.drawSpeakerSoundwaves(ctx, now);

    // 3. Stage Props & Barricades
    this.drawConcertProps(ctx, vx, vy, vw, vh, now);

    // 4. Collectibles
    this.drawCollectibles(ctx, vx, vy, vw, vh, now);

    // 5. Stray Kids Members
    this.drawMembers(ctx, vx, vy, vw, vh, now);

    // 6. Particles
    this.drawParticles(ctx);

    // 7. Arari Mascot
    this.drawArari(ctx, now);

    ctx.restore();
  }

  drawStadium(ctx, vx, vy, vw, vh, now) {
    // 1. Arena Base Floor (Clean, deep stadium floor)
    ctx.fillStyle = '#0a0818';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 2. Backstage Floor
    if (this.patterns.backstage) {
      ctx.fillStyle = this.patterns.backstage;
      ctx.fillRect(200, 80, 2200, 360);
    }

    // 3. UNIFIED STAGE PLATFORM (Main Stage + Catwalk Runway + Extended B-Stage)
    if (this.patterns.stage_skz) {
      ctx.fillStyle = this.patterns.stage_skz;
      // Main Stage
      ctx.fillRect(380, 460, 1840, 450);
      // Catwalk Runway
      ctx.fillRect(1180, 910, 240, 460);
      // Extended B-Stage
      ctx.fillRect(1020, 1370, 560, 350);
    } else {
      ctx.fillStyle = '#223046';
      ctx.fillRect(380, 460, 1840, 450);
      ctx.fillRect(1180, 910, 240, 460);
      ctx.fillRect(1020, 1370, 560, 350);
    }

    // Stage Edge Sleek Neon Glow & Border
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(380, 460, 1840, 450);
    ctx.strokeRect(1020, 1370, 560, 350);
  }

  drawSpeakerSoundwaves(ctx, now) {
    const waveTime = (now * 0.003) % 1.0;
    const colors = ['#38bdf8', '#c084fc', '#ffd700'];

    SPEAKERS.forEach((spk, idx) => {
      for (let i = 0; i < 3; i++) {
        const progress = (waveTime + i * 0.33) % 1.0;
        const radius = 15 + progress * 45;
        const alpha = (1.0 - progress) * 0.6;

        ctx.strokeStyle = colors[(idx + i) % colors.length];
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2.5 - progress;

        ctx.beginPath();
        if (spk.dir === 'right') {
          ctx.arc(spk.x + 12, spk.y, radius, -0.4 * Math.PI, 0.4 * Math.PI);
        } else {
          ctx.arc(spk.x - 12, spk.y, radius, 0.6 * Math.PI, 1.4 * Math.PI);
        }
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1.0;
  }

  drawConcertProps(ctx, vx, vy, vw, vh, now) {
    // 1. Runway Edge Lamps
    const lampImg = this.assets.edgeLamp;
    if (lampImg && lampImg.complete) {
      RUNWAY_LAMPS.forEach(lp => {
        ctx.drawImage(lampImg, lp.x - 10, lp.y - 15, 20, 30);
      });
    }

    // 2. Barricades (Properly Rotated: Vertical along catwalk, Horizontal along front)
    const barrImg = this.assets.barricade;
    if (barrImg && barrImg.complete) {
      BARRICADES.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        if (b.rot === 90) {
          ctx.rotate(Math.PI / 2);
        }
        ctx.drawImage(barrImg, -45, -17, 90, 35);
        ctx.restore();
      });
    }

    // 3. Backstage Equipment Crates (backstage area only, not on the open stage)
    const crates = this.assets.stackedCrates;
    if (crates && crates.complete) {
      ctx.drawImage(crates, 220, 220, 100, 70);
      ctx.drawImage(crates, 2340, 220, 100, 70);
    }

    // 6. Stage Wings — glass planters only on backstage, not on accessible stage floor
    const planter = this.assets.glassPlanter;
    if (planter && planter.complete) {
      // Only in backstage corners (behind stage wall, y < 460)
      ctx.drawImage(planter, 240, 310, 42, 52);
      ctx.drawImage(planter, 2320, 310, 42, 52);
    }

    // 7. Speakers
    const spkImg = this.assets.props.speaker;
    if (spkImg) {
      const beatScale = 1.0 + Math.sin(now * 0.012) * 0.04;
      SPEAKERS.forEach(s => {
        const w = 36 * beatScale;
        const h = 64 * beatScale;
        ctx.drawImage(spkImg, s.x - w / 2, s.y - h / 2, w, h);
      });
    }

    // 8. Light Poles
    const poleImg = this.assets.props.light_pole;
    if (poleImg) {
      LIGHT_POLES.forEach(p => {
        ctx.drawImage(poleImg, p.x - 12, p.y - 60, 24, 72);
      });
    }
  }

  drawCollectibles(ctx, vx, vy, vw, vh, now) {
    for (const c of this.collectibles) {
      if (c.collected) continue;
      if (c.x < vx || c.x > vx + vw || c.y < vy || c.y > vy + vh) continue;

      const bob = Math.sin(now * 0.003 + c.bobOffset) * 3;
      const drawX = Math.floor(c.x);
      const drawY = Math.floor(c.y + bob);

      const img = this.assets.items[c.type];
      const size = (c.type === 'peanut') ? 22 : 20;

      if (img) {
        ctx.drawImage(img, drawX - size / 2, drawY - size / 2, size, size);
      }
    }
  }

  drawMembers(ctx, vx, vy, vw, vh, now) {
    for (const m of this.members) {
      if (m.x < vx - 50 || m.x > vx + vw + 50 || m.y < vy - 50 || m.y > vy + vh + 50) continue;

      // Authentic Pixel-Art Ground Shadow (under feet)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(Math.floor(m.x), Math.floor(m.y + 20), 16, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.fill();
      ctx.restore();

      const atlas = this.assets.memberAtlases[m.id];
      const tex = this.assets.memberTextures[m.id];
      const scale = 2.0;

      if (atlas && tex && atlas.frames && atlas.frames.length > 0) {
        let frameIdx = 26;
        if (m.found || this.state === 'tribute') {
          const danceCycle = Math.floor(now * 0.008) % 16;
          frameIdx = 30 + danceCycle;
        } else {
          const idleCycle = Math.floor(now * 0.004 + m.id) % 4;
          frameIdx = 26 + idleCycle;
        }

        const frameData = atlas.frames[frameIdx];
        if (frameData) {
          const f = frameData.frame;
          const ss = frameData.spriteSourceSize;
          const src = frameData.sourceSize;

          const dx = Math.floor(m.x - (src.w * scale) / 2 + ss.x * scale);
          const dy = Math.floor(m.y - (src.h * scale) / 2 + ss.y * scale);
          const dw = Math.floor(f.w * scale);
          const dh = Math.floor(f.h * scale);

          ctx.drawImage(tex, f.x, f.y, f.w, f.h, dx, dy, dw, dh);
        }
      }

      ctx.textAlign = 'center';
      if (m.found) {
        ctx.font = 'bold 9px DePixelBold, monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`★ ${m.name}`, m.x, m.y + 36);

        ctx.font = '7px DePixel, monospace';
        ctx.fillStyle = m.color;
        ctx.fillText(`(${m.skzoo})`, m.x, m.y + 46);
      } else {
        ctx.font = 'bold 9px DePixelBold, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('??????', m.x, m.y + 36);
      }
      ctx.textAlign = 'left';
    }
  }

  drawArari(ctx, now) {
    const { x, y, facing, animFrame, moving, flying, dancing } = this.arari;
    const sheet = this.assets.arariSheet;

    const FRAME_SIZE = 96;
    const DISPLAY_SIZE = 60;

    // 1. Authentic Pixel-Art Ground Shadow (remains cast on floor beneath Arari)
    ctx.save();
    ctx.beginPath();
    if (flying) {
      // High flight: shadow shrinks and softens on the ground
      ctx.ellipse(Math.floor(x), Math.floor(y + 22), 11, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    } else {
      // Walking / Idle on ground
      ctx.ellipse(Math.floor(x), Math.floor(y + 20), 15, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    }
    ctx.fill();
    ctx.restore();

    // Gentle footstep bob while moving on the ground (or float lift when flying)
    // Increased amplitude (3px) for clearly visible walking rhythm
    const walkBob = flying ? -6 + Math.sin(now * 0.006) * 3 : ((moving) ? Math.sin(now * 0.025) * 3 : 0);

    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y + walkBob));

    // For left-facing movement (Left, Down-Left, Up-Left), flip horizontally
    const goingLeft = (facing === 3 || facing === 5 || facing === 7);

    if (sheet) {
      let row = 0;
      let col = 0;

      if (dancing) {
        // Victory Dance: Row 8 (back) or Row 7 (front)
        const isUp = (facing === 1 || facing === 6 || facing === 7);
        row = isUp ? 8 : 7;
        col = Math.floor(now * 0.008) % 4;
      } else if (flying) {
        // Flying in all directions:
        if (facing === 1 || facing === 6 || facing === 7) {
          row = 5; // Fly Up (back wings flapping)
          col = Math.floor(now * 0.01) % 4;
        } else if (facing === 0) {
          row = 6; // Fly Down (front wings flapping)
          col = Math.floor(now * 0.01) % 4;
        } else {
          row = 4; // Fly Side (5 frames, flipped if going left)
          col = Math.floor(now * 0.01) % 5;
        }
      } else if (moving) {
        // Walking in all 8 directions:
        switch (facing) {
          case 0: // Down: Row 2 (3/4 walk cycle with active stepping paws, 5 frames)
          case 4: // Down-Right: Row 2
          case 5: // Down-Left: Row 2 (flipped)
            row = 2;
            col = animFrame % 5;
            break;
          case 1: // Up: Row 3 (Back walk cycle, 4 frames)
          case 6: // Up-Right
          case 7: // Up-Left (flipped)
            row = 3;
            col = animFrame % 4;
            break;
          case 2: // Right: Row 1 (Side walk, 5 frames)
          case 3: // Left: Row 1 (flipped, 5 frames)
          default:
            row = 1;
            col = animFrame % 5;
            break;
        }
      } else {
        // Idle when stopped in any direction:
        if (facing === 1 || facing === 6 || facing === 7) {
          row = 9; // Idle Back
          col = Math.floor(now * 0.003) % 4;
        } else if (facing === 2 || facing === 3) {
          row = 1; // Idle Side posture
          col = 0;
        } else {
          row = 0; // Idle Front
          const t = Math.floor(now * 0.001) % 8;
          col = (t === 7) ? 2 : 0;
        }
      }

      const sx = col * FRAME_SIZE;
      const sy = row * FRAME_SIZE;

      // Flip sprite horizontally when moving or looking left
      if (goingLeft) {
        ctx.scale(-1, 1);
      }

      ctx.drawImage(
        sheet,
        sx, sy, FRAME_SIZE, FRAME_SIZE,
        -DISPLAY_SIZE / 2, -DISPLAY_SIZE / 2, DISPLAY_SIZE, DISPLAY_SIZE
      );

      if (goingLeft) {
        ctx.scale(-1, 1);
      }
    }

    ctx.font = 'bold 8px DePixelBold, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('ARARI', 0, -DISPLAY_SIZE / 2 - 4);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1.0;

    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.font = 'bold 11px DePixelBold, monospace';
      ctx.textAlign = 'center';

      const tw = ctx.measureText(ft.text).width;
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(ft.x - tw / 2 - 6, ft.y - 12, tw + 12, 16);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.strokeRect(ft.x - tw / 2 - 6, ft.y - 12, tw + 12, 16);

      ctx.fillStyle = '#0f172a';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  loop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    this.update(dt);
    this.render(now);

    requestAnimationFrame((t) => this.loop(t));
  }
}

window._arariGame = null;
window.initArariGame = function() {
  if (!window._arariGame) {
    window._arariGame = new ArariGame();
  }
};