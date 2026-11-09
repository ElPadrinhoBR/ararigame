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

// Security Guards stationed facing crowd
const GUARDS = [
  { x: 1145, y: 960 }, { x: 1145, y: 1150 }, { x: 1145, y: 1300 },
  { x: 1455, y: 960 }, { x: 1455, y: 1150 }, { x: 1455, y: 1300 },
  { x: 620, y: 915 }, { x: 920, y: 915 },
  { x: 1680, y: 915 }, { x: 1980, y: 915 },
  { x: 985, y: 1450 }, { x: 985, y: 1600 },
  { x: 1615, y: 1450 }, { x: 1615, y: 1600 }
];

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

// ─── Stray Kids Members (Unified on Main Stage, Catwalk & B-Stage) ──────
const MEMBERS = [
  {
    id: 0, name: 'Lee Know', skzoo: 'Leebit', role: 'Dançarino Principal / Vocal',
    color: '#a855f7', x: 1300, y: 680, zone: 'Palco Principal', found: false,
    dialogue: [
      'Olá Arari! Que alegria ver uma mascote tão expressiva aqui no palco!',
      'Gostei muito dos seus passos de asa! Já vi que você tem o ritmo e a paixão brasileira!',
      'Recebemos todo o amor dos B-STAYs no show! Vamos continuar dançando juntos!'
    ]
  },
  {
    id: 1, name: 'HAN', skzoo: 'Han Quokka', role: 'All-Rounder / Rapper / Produtor',
    color: '#f59e0b', x: 1050, y: 680, zone: 'Palco Principal', found: false,
    dialogue: [
      'E aí, Arari! Você veio voando do Brasil até aqui?! Haha, que incrível!',
      'Ouvir a plateia brasileira cantando cada verso das nossas músicas foi surreal de emocionante!',
      'Muito obrigado pelo apoio e carinho! O Brasil tem uma energia única no mundo inteiro!'
    ]
  },
  {
    id: 2, name: 'Bang Chan', skzoo: 'Wolf Chan', role: 'Líder / Produtor / Vocal',
    color: '#ef4444', x: 1300, y: 1560, zone: 'Palco B-Stage', found: false,
    dialogue: [
      "G'day Arari! Que honra receber a mascote oficial dos B-STAYs no nosso show dominATE!",
      'Os fãs do Brasil são nossa grande inspiração e sempre nos dão forças para superar desafios.',
      'Obrigado por essa linda homenagem! Stray Kids e STAY estarão sempre juntos pelo mundo!'
    ]
  },
  {
    id: 3, name: 'Felix', skzoo: 'BbokAri', role: 'Dançarino Líder / Rapper',
    color: '#fb923c', x: 1300, y: 1200, zone: 'Passarela Central', found: false,
    dialogue: [
      'Arari! Minha grande parceira do Trio Caótico! (Arari + BbokAri + Dwaekki!)',
      'Você é incrivelmente fofa! O amor dos fãs brasileiros é tão quente e acolhedor...',
      'Muito obrigado pela visita e pela homenagem, B-Stay! Saranghaeyo, Brasil! ♥'
    ]
  },
  {
    id: 4, name: 'Seungmin', skzoo: 'PuppyM', role: 'Vocalista Principal',
    color: '#22c55e', x: 1920, y: 680, zone: 'Asa Direita do Palco', found: false,
    dialogue: [
      'Arari! Você canta bem também ou só bate as asas? Haha!',
      'A harmonia das vozes dos B-STAYs cantando nos estádios é perfeita, arrepia até a alma!',
      'Muito obrigado pelo amor contínuo. Prometemos voltar ao Brasil sempre!'
    ]
  },
  {
    id: 5, name: 'I.N', skzoo: 'FoxI.Ny', role: 'Vocalista / Maknae',
    color: '#38bdf8', x: 1300, y: 960, zone: 'Início da Passarela', found: false,
    dialogue: [
      'Arari! Que mascote linda! Fiquei encantado com suas cores tropicais!',
      'Nunca imaginei ver um projeto tão carinhoso criado exclusivamente pelos fãs do Brasil!',
      'Obrigado B-Stay! Vocês são os melhores fãs do mundo inteiro, sem dúvida!'
    ]
  },
  {
    id: 6, name: 'Changbin', skzoo: 'Dwaekki', role: 'Rapper Principal / Produtor',
    color: '#f43f5e', x: 1550, y: 680, zone: 'Palco Principal', found: false,
    dialogue: [
      'YOH! Arari! O Dwaekki do Trio Caótico está aqui treinando firme!',
      'A força dos gritos dos B-STAYs no show fez o chão do estádio tremer de verdade!',
      'Obrigado de coração! A vibe do Brasil é pura energia e motivação pra gente!'
    ]
  },
  {
    id: 7, name: 'Hyunjin', skzoo: 'Jiniret', role: 'Dançarino Principal / Rapper / Visual',
    color: '#818cf8', x: 680, y: 680, zone: 'Asa Esquerda do Palco', found: false,
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
    promises.push(this.loadImage('assets/arari/arari_spritesheet.png').then(img => {
      this.assets.arariSheet = img;
    }));

    // Transparent Stage Props & Objects
    promises.push(this.loadImage('assets/official/skz_arch_clean.png').then(img => { this.assets.skzArch = img; }));
    promises.push(this.loadImage('assets/official/cyber_neon_wall.png').then(img => { this.assets.cyberWall = img; }));
    promises.push(this.loadImage('assets/official/barricade_official.png').then(img => { this.assets.barricade = img; }));
    promises.push(this.loadImage('assets/official/security_guard_official.png').then(img => { this.assets.securityGuard = img; }));
    promises.push(this.loadImage('assets/official/stage_edge_lamp.png').then(img => { this.assets.edgeLamp = img; }));
    promises.push(this.loadImage('assets/official/glass_planter.png').then(img => { this.assets.glassPlanter = img; }));
    promises.push(this.loadImage('assets/official/diagonal_stairs.png').then(img => { this.assets.diagStairs = img; }));
    promises.push(this.loadImage('assets/official/stacked_crates.png').then(img => { this.assets.stackedCrates = img; }));
    promises.push(this.loadImage('assets/official/stage_spotlight_beams.png').then(img => { this.assets.spotlightBeams = img; }));
    promises.push(this.loadImage('assets/official/metal_truss.png').then(img => { this.assets.metalTruss = img; }));

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

  // ─── Touch Controls for Mobile ─────────────────────────────────────────
  setupMobileTouchpad() {
    const joyZone = document.getElementById('touchpad-zone');
    const joyKnob = document.getElementById('touchpad-knob');
    if (!joyZone || !joyKnob) return;

    const maxRadius = 38;
    let touchId = null;

    const handleMove = (clientX, clientY) => {
      const rect = joyZone.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.touchJoystick.moveX = dx / maxRadius;
      this.touchJoystick.moveY = dy / maxRadius;
      this.touchJoystick.active = true;
    };

    joyZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.sound.init();
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
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
          joyKnob.style.transform = 'translate(0px, 0px)';
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
        textSpan.textContent = m.found ? m.name : '???';
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

      // Keyboard input
      if (this.keys['ArrowLeft'] || this.keys['KeyA']) { dx -= 1; this.arari.facing = 3; }
      if (this.keys['ArrowRight'] || this.keys['KeyD']) { dx += 1; this.arari.facing = 2; }
      if (this.keys['ArrowUp'] || this.keys['KeyW']) { dy -= 1; this.arari.facing = 1; }
      if (this.keys['ArrowDown'] || this.keys['KeyS']) { dy += 1; this.arari.facing = 0; }

      // Mobile Touchpad / Joystick input
      if (this.touchJoystick.active) {
        dx = this.touchJoystick.moveX;
        dy = this.touchJoystick.moveY;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.arari.facing = dx > 0 ? 2 : 3;
        } else {
          this.arari.facing = dy > 0 ? 0 : 1;
        }
      } else if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      this.arari.moving = (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05);
      const spd = this.arari.flying ? this.arari.flySpeed : this.arari.speed;

      if (this.arari.moving) {
        const nextX = this.arari.x + dx * spd;
        const nextY = this.arari.y + dy * spd;

        if (!this.checkCollision(nextX, this.arari.y)) this.arari.x = nextX;
        if (!this.checkCollision(this.arari.x, nextY)) this.arari.y = nextY;

        // Animate legs and wings crisply
        this.arari.animTimer += dt;
        const frameDuration = this.arari.flying ? 0.07 : 0.09;
        if (this.arari.animTimer >= frameDuration) {
          this.arari.animTimer = 0;
          this.arari.animFrame = (this.arari.animFrame + 1) % 10;
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
    // 1. Arena Base Floor
    ctx.fillStyle = '#0a0618';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 2. Blinking Concert Lights in Crowd Zones
    this.drawCrowdLights(ctx, vx, vy, vw, vh, now);

    // 3. Backstage Floor
    if (this.patterns.backstage) {
      ctx.fillStyle = this.patterns.backstage;
      ctx.fillRect(200, 80, 2200, 360);
    }

    // 4. Left Wing Area (rebaixada)
    if (this.patterns.wing_skz) {
      ctx.fillStyle = this.patterns.wing_skz;
      ctx.fillRect(100, 460, 280, 440);
    }

    // 5. UNIFIED STAGE PLATFORM (Main Stage + Catwalk + B-Stage)
    if (this.patterns.stage_skz) {
      ctx.fillStyle = this.patterns.stage_skz;
      // Main Stage
      ctx.fillRect(380, 460, 1840, 450);
      // Catwalk Runway
      ctx.fillRect(1180, 910, 240, 460);
      // Extended B-Stage
      ctx.fillRect(1020, 1370, 560, 350);
    } else {
      ctx.fillStyle = '#324258';
      ctx.fillRect(380, 460, 1840, 450);
      ctx.fillRect(1180, 910, 240, 460);
      ctx.fillRect(1020, 1370, 560, 350);
    }

    // Stage Edge Subtle Border
    ctx.strokeStyle = '#435875';
    ctx.lineWidth = 2;
    ctx.strokeRect(380, 460, 1840, 450);
    ctx.strokeRect(1020, 1370, 560, 350);

    // 6. Top Cyber LED Monitor Wall
    const cyberWall = this.assets.cyberWall;
    if (cyberWall && cyberWall.complete) {
      for (let wx = 380; wx < 2200; wx += 435) {
        ctx.drawImage(cyberWall, wx, 416, 435, 46);
      }
    }

    // 7. Transparent Giant Chrome STRAY KIDS Arch Statue (Centered over Stage Entrance!)
    const arch = this.assets.skzArch;
    if (arch && arch.complete) {
      ctx.drawImage(arch, 1125, 385, 350, 145);
    }

    // 8. Overhead Concert Spotlights
    const beams = this.assets.spotlightBeams;
    if (beams && beams.complete) {
      ctx.globalAlpha = 0.5 + 0.2 * Math.sin(now * 0.002);
      ctx.drawImage(beams, 450, 420, 800, 170);
      ctx.drawImage(beams, 1350, 420, 800, 170);
      ctx.globalAlpha = 1.0;
    }
  }

  // Blinking, twinkling concert lights representing the audience
  drawCrowdLights(ctx, vx, vy, vw, vh, now) {
    const colors = ['#ffffff', '#38bdf8', '#e879f9', '#ffd700', '#4ade80', '#fb923c'];
    const t = now * 0.003;

    // Left Crowd Zone
    for (let cy = 930; cy < 1780; cy += 42) {
      for (let cx = 80; cx < 1140; cx += 42) {
        if (cx >= vx && cx <= vx + vw && cy >= vy && cy <= vy + vh) {
          const seed = cx * 13.17 + cy * 17.83;
          const pulse = Math.sin(t + seed);
          if (pulse > 0.15) {
            const alpha = 0.25 + 0.7 * ((pulse + 1) / 2);
            const color = colors[Math.floor(Math.abs(seed) % colors.length)];
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Right Crowd Zone
    for (let cy = 930; cy < 1780; cy += 42) {
      for (let cx = 1460; cx < 2520; cx += 42) {
        if (cx >= vx && cx <= vx + vw && cy >= vy && cy <= vy + vh) {
          const seed = cx * 13.17 + cy * 17.83;
          const pulse = Math.sin(t + seed);
          if (pulse > 0.15) {
            const alpha = 0.25 + 0.7 * ((pulse + 1) / 2);
            const color = colors[Math.floor(Math.abs(seed) % colors.length)];
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    ctx.globalAlpha = 1.0;
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

    // 3. Security Guards
    const guardImg = this.assets.securityGuard;
    if (guardImg && guardImg.complete) {
      GUARDS.forEach(g => {
        ctx.drawImage(guardImg, g.x - 15, g.y - 25, 30, 50);
      });
    }

    // 4. Backstage Diagonal Stairs
    const diagStairs = this.assets.diagStairs;
    if (diagStairs && diagStairs.complete) {
      ctx.drawImage(diagStairs, 300, 160, 212, 127);
      ctx.drawImage(diagStairs, 2040, 160, 212, 127);
    }

    // 5. Backstage Stacked Flight Crates
    const crates = this.assets.stackedCrates;
    if (crates && crates.complete) {
      ctx.drawImage(crates, 520, 260, 137, 90);
      ctx.drawImage(crates, 920, 260, 137, 90);
      ctx.drawImage(crates, 1620, 260, 137, 90);
      ctx.drawImage(crates, 1960, 260, 137, 90);
    }

    // 6. Glass Cyber Planters on Stage Wings
    const planter = this.assets.glassPlanter;
    if (planter && planter.complete) {
      ctx.drawImage(planter, 460, 520, 49, 59);
      ctx.drawImage(planter, 460, 780, 49, 59);
      ctx.drawImage(planter, 2120, 520, 49, 59);
      ctx.drawImage(planter, 2120, 780, 49, 59);
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

      ctx.font = 'bold 9px DePixelBold, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = m.found ? '#ffd700' : '#ffffff';
      ctx.fillText(m.found ? `★ ${m.name}` : `? ${m.name}`, m.x, m.y + 36);

      ctx.font = '7px DePixel, monospace';
      ctx.fillStyle = m.color;
      ctx.fillText(`(${m.skzoo})`, m.x, m.y + 46);
      ctx.textAlign = 'left';
    }
  }

  drawArari(ctx, now) {
    const { x, y, facing, animFrame, moving, flying, dancing } = this.arari;
    const sheet = this.assets.arariSheet;

    const FRAME_SIZE = 96;
    const DISPLAY_SIZE = 56;

    // Gentle footstep bob while moving on the ground
    const walkBob = (moving && !flying) ? Math.sin(now * 0.02) * 2 : 0;

    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y + walkBob));

    if (sheet) {
      let row = 0;
      let col = 0;

      if (dancing) {
        row = 5;
        col = Math.floor(now * 0.008) % 5;
      } else if (flying) {
        row = 4;
        col = Math.floor(now * 0.01) % 5;
      } else if (moving) {
        row = facing;
        if (facing === 0 || facing === 1) {
          // Down & Up walk: alternate crisply stepping paws
          col = animFrame % 4;
        } else {
          // Right (row 2), Left (row 3): full 5-frame side walk cycle with paws stepping forward & push off
          col = animFrame % 5;
        }
      } else {
        // Idle breathing: stay in idle posture, occasional happy wink
        row = 0;
        col = (Math.floor(now * 0.001) % 6 === 5) ? 3 : 0;
      }

      const sx = col * FRAME_SIZE;
      const sy = row * FRAME_SIZE;

      ctx.drawImage(
        sheet,
        sx, sy, FRAME_SIZE, FRAME_SIZE,
        -DISPLAY_SIZE / 2, -DISPLAY_SIZE / 2, DISPLAY_SIZE, DISPLAY_SIZE
      );
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