/**
 * Stayzoo Arari: ChatPoint VIP Lounge
 * Version 4.0 - Humor Tadela Visual Chat with Animal Mascots, DJ Booth, Unique Nicknames & Mobile View
 */

// ─── Profanity & NSFW Filter ──────────────────────────────────────────
const BLOCKED_WORDS = [
  'caralho', 'porra', 'puta', 'puto', 'foder', 'fodeu', 'fodase', 'foda-se',
  'buceta', 'carai', 'cacete', 'piroca', 'pica', 'rola', 'cu', 'cuzão',
  'viado', 'viadinho', 'arrombado', 'merda', 'bosta', 'vagabunda', 'vadia',
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'nigger', 'cunt',
  'sexo', 'sex', 'nude', 'nudes', 'porn', 'porno', 'safada', 'safado'
];

function sanitizeMessage(text) {
  if (!text) return { clean: '', blocked: false };
  let clean = text;
  let blocked = false;
  const lower = text.toLowerCase();
  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    if (regex.test(lower)) {
      blocked = true;
      clean = clean.replace(regex, '***');
    }
  }
  return { clean, blocked };
}

// ─── Default Avatar Settings ──────────────────────────────────────────
const DEFAULT_AVATAR = {
  name: 'B-Stay Brasil',
  category: 'human', // 'human' or 'mascot'
  mascot: 'arari',   // 'arari', 'bbokari', 'dwaekki', 'wolfchan', 'leebit', 'jiniret', 'hanquokka', 'puppym', 'foxiny'
  gender: 'female',
  skin: '#ffd1b3',
  hairStyle: 'twin_buns',
  hairColor: '#4a2c11',
  outfit: 'dominate_jacket',
  accessory: 'nachimbong'
};

// ─── Procedural Pixel-Art Avatar Renderer (Humor Tadela Style) ──────────
class AvatarRenderer {
  static drawAvatar(ctx, x, y, config, isWalking = false, animFrame = 0) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    const bob = isWalking ? Math.sin(animFrame * 1.5) * 2 : 0;
    const legOffset = isWalking ? Math.sin(animFrame * 1.5) * 3 : 0;

    // 1. Ground Shadow (under feet)
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // If animal mascot is selected, draw cute SKZ mascot!
    if (config.category === 'mascot') {
      this.drawMascotAvatar(ctx, config.mascot || 'arari', bob, legOffset);
      ctx.restore();
      return;
    }

    // Otherwise, draw Humano K-Pop (Humor Tadela Style)
    this.drawHumanAvatar(ctx, config, bob, legOffset);
    ctx.restore();
  }

  static drawMascotAvatar(ctx, mascot, bob, legOffset) {
    const m = mascot.toLowerCase();
    
    // Paws / Feet
    let footColor = '#f97316';
    if (m === 'wolfchan') footColor = '#334155';
    else if (m === 'leebit' || m === 'jiniret') footColor = '#e2e8f0';
    else if (m === 'dwaekki') footColor = '#f472b6';
    else if (m === 'hanquokka') footColor = '#78350f';
    else if (m === 'puppym') footColor = '#78350f';
    else if (m === 'foxiny') footColor = '#ea580c';

    ctx.fillStyle = footColor;
    ctx.fillRect(-8, 16 + bob - legOffset, 6, 5);
    ctx.fillRect(2, 16 + bob + legOffset, 6, 5);

    // Body
    let bodyColor = '#0284c7';
    if (m === 'bbokari') bodyColor = '#facc15';
    else if (m === 'dwaekki') bodyColor = '#f472b6';
    else if (m === 'wolfchan') bodyColor = '#64748b';
    else if (m === 'leebit') bodyColor = '#f8fafc';
    else if (m === 'jiniret') bodyColor = '#ffffff';
    else if (m === 'hanquokka') bodyColor = '#a16207';
    else if (m === 'puppym') bodyColor = '#fef08a';
    else if (m === 'foxiny') bodyColor = '#fb923c';

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4 + bob, 14, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Belly patch
    if (m === 'arari') {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, 5 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-2, 3 + bob, 4, 4);
    } else if (m === 'wolfchan' || m === 'bbokari' || m === 'foxiny' || m === 'hanquokka') {
      ctx.fillStyle = (m === 'wolfchan') ? '#cbd5e1' : '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 6 + bob, 8, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Head
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(0, -12 + bob, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ears / Crest
    if (m === 'arari') {
      // Cyan crest
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(-4, -26 + bob);
      ctx.lineTo(0, -32 + bob);
      ctx.lineTo(4, -26 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (m === 'leebit' || m === 'dwaekki') {
      // Bunny / Dwaekki ears
      ctx.fillStyle = bodyColor;
      ctx.fillRect(-10, -32 + bob, 6, 16);
      ctx.fillRect(4, -32 + bob, 6, 16);
      ctx.strokeRect(-10, -32 + bob, 6, 16);
      ctx.strokeRect(4, -32 + bob, 6, 16);
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(-8, -30 + bob, 3, 12);
      ctx.fillRect(6, -30 + bob, 3, 12);
    } else if (m === 'wolfchan' || m === 'foxiny') {
      // Pointed ears
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(-14, -18 + bob); ctx.lineTo(-10, -30 + bob); ctx.lineTo(-4, -22 + bob); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -18 + bob); ctx.lineTo(10, -30 + bob); ctx.lineTo(4, -22 + bob); ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (m === 'puppym') {
      // Floppy ears
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -16 + bob, 5, 14);
      ctx.fillRect(11, -16 + bob, 5, 14);
    } else if (m === 'hanquokka' || m === 'jiniret') {
      // Round ears
      ctx.fillStyle = bodyColor;
      ctx.beginPath(); ctx.arc(-12, -22 + bob, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(12, -22 + bob, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    // Cheeks
    ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.beginPath(); ctx.arc(-7, -9 + bob, 3, 0, Math.PI * 2); ctx.arc(7, -9 + bob, 3, 0, Math.PI * 2); ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(-5, -13 + bob, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.ellipse(5, -13 + bob, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(-5, -13 + bob, 2.2, 0, Math.PI * 2); ctx.arc(5, -13 + bob, 2.2, 0, Math.PI * 2); ctx.fill();

    // Snout / Beak
    if (m === 'arari' || m === 'bbokari') {
      ctx.fillStyle = '#f97316';
      ctx.beginPath(); ctx.moveTo(-3, -11 + bob); ctx.lineTo(0, -6 + bob); ctx.lineTo(3, -11 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (m === 'dwaekki') {
      ctx.fillStyle = '#db2777';
      ctx.fillRect(-4, -10 + bob, 8, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -9 + bob, 1.5, 2); ctx.fillRect(0.5, -9 + bob, 1.5, 2);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(0, -9 + bob, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  static drawHumanAvatar(ctx, config, bob, legOffset) {
    const skin = config.skin || '#ffd1b3';
    const hair = config.hairColor || '#4a2c11';
    const gender = config.gender || 'female';
    const style = config.hairStyle || (gender === 'female' ? 'twin_buns' : 'curtain_kpop');
    const outfit = config.outfit || 'dominate_jacket';
    const accessory = config.accessory || 'nachimbong';

    // 2. Legs & Shoes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, 10 + bob - legOffset, 4, 10 + legOffset);
    ctx.fillRect(2, 10 + bob + legOffset, 4, 10 - legOffset);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, 18 + bob - legOffset, 6, 4);
    ctx.fillRect(1, 18 + bob + legOffset, 6, 4);

    // 3. Torso & Outfit
    ctx.fillStyle = outfit === 'dominate_jacket' ? '#18181b' :
                    outfit === 'bstay_hoodie' ? '#1d4ed8' :
                    outfit === 'tour_tee' ? '#dc2626' : '#9333ea';
    ctx.fillRect(-9, -2 + bob, 18, 14);

    // Jacket golden zipper
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-1, -2 + bob, 2, 14);
    if (outfit === 'dominate_jacket') {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-6, 0 + bob, 3, 2);
    }

    // 4. Arms & Hands
    ctx.fillStyle = ctx.fillStyle;
    ctx.fillRect(-12, -1 + bob, 3, 10);
    ctx.fillRect(9, -1 + bob, 3, 10);
    ctx.fillStyle = skin;
    ctx.fillRect(-12, 9 + bob, 3, 3);
    ctx.fillRect(9, 9 + bob, 3, 3);

    // 5. Lightstick (Nachimbong)
    if (accessory === 'nachimbong') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 2 + bob, 2, 12);
      ctx.beginPath(); ctx.arc(13, 0 + bob, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(13, 0 + bob, 2.5, 0, Math.PI * 2); ctx.fill();
    }

    // 6. Head
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(0, -14 + bob, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(-7, -11 + bob, 3, 0, Math.PI * 2);
    ctx.arc(7, -11 + bob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-5, -15 + bob, 3.5, 4.5, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -15 + bob, 3.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(-5, -14.5 + bob, 2, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -14.5 + bob, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -8 + bob, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Hair
    ctx.fillStyle = hair;
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1;

    if (style === 'twin_buns') {
      ctx.beginPath(); ctx.arc(-14, -24 + bob, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(14, -24 + bob, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -20 + bob, 15, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (style === 'long_wavy') {
      ctx.beginPath(); ctx.arc(0, -20 + bob, 15, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillRect(-15, -16 + bob, 4, 18); ctx.fillRect(11, -16 + bob, 4, 18);
    } else if (style === 'curtain_kpop') {
      ctx.beginPath(); ctx.arc(0, -20 + bob, 15, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillRect(-13, -16 + bob, 4, 8); ctx.fillRect(9, -16 + bob, 4, 8);
    } else {
      ctx.beginPath(); ctx.arc(0, -21 + bob, 14, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }
}

// ─── Arari Official Bot Frases STAY ─────────────────────────────────────
const ARARI_STAY_PHRASES = [
  "STAY! Vocês são a luz que guia o Stray Kids em cada batida! 💜",
  "A dominATE Tour no Brasil vai ser ÉPICA! Quem tá pronto pra gritar até perder a voz? 🇧🇷",
  "O Trio Caótico: Arari + BbokAri + Dwaekki dominando tudo! 🦜🐥🐰",
  "Vocês sabiam que a cada Chk Chk Boom o meu coração bate mais forte? ✨",
  "Felix mandou um abraço especial para todas as B-Stays! 🍪",
  "Bang Chan disse que o Brasil é a casa do Stray Kids! 🐺💙",
  "Comam muito bem, bebam água e nunca deixem de sonhar, STAYs! 🌸",
  "STAY tuned! A nossa família global nunca para de crescer! 🌍💫",
  "B-Stay é a torcida mais apaixonada do mundo inteiro! 🎉"
];

// ─── 8 Stray Kids Member Bots ───────────────────────────────────────────
const SKZ_MEMBER_BOTS = [
  { id: 0, name: 'Lee Know', color: '#a855f7', x: 180, y: 150, targetX: 180, targetY: 150, isWalking: false, animFrame: 0, phrases: ["Olá B-Stay! Arari é fofa demais! 🐰", "Já comeram pudim hoje? Não esqueçam das refeições!"], timer: 14, bubble: null },
  { id: 1, name: 'HAN', color: '#38bdf8', x: 280, y: 180, targetX: 280, targetY: 180, isWalking: false, animFrame: 0, phrases: ["Trio Caótico com a Arari é imbatível! 🐿️", "Escrevendo novas músicas pensando nos STAYs!"], timer: 18, bubble: null },
  { id: 2, name: 'Bang Chan', color: '#ef4444', x: 400, y: 140, targetX: 400, targetY: 140, isWalking: false, animFrame: 0, phrases: ["STAY, vocês são a nossa maior força! 🐺", "Brasil, mal posso esperar pelo show! 🇧🇷"], timer: 22, bubble: null },
  { id: 3, name: 'Felix', color: '#ffd700', x: 520, y: 170, targetX: 520, targetY: 170, isWalking: false, animFrame: 0, phrases: ["BbokAri & Arari: As mascotes mais brilhantes! 🐥", "Bake some cookies for B-STAY! 🍪"], timer: 16, bubble: null },
  { id: 4, name: 'Seungmin', color: '#10b981', x: 620, y: 150, targetX: 620, targetY: 150, isWalking: false, animFrame: 0, phrases: ["Cantando com o coração para cada um de vocês! 🐶", "O palco está perfeito hoje!"], timer: 24, bubble: null },
  { id: 5, name: 'Hyunjin', color: '#ec4899', x: 220, y: 250, targetX: 220, targetY: 250, isWalking: false, animFrame: 0, phrases: ["Dançando com toda a minha paixão por vocês! 🦡", "A energia do Brasil é sem igual!"], timer: 20, bubble: null },
  { id: 6, name: 'Changbin', color: '#f97316', x: 480, y: 260, targetX: 480, targetY: 260, isWalking: false, animFrame: 0, phrases: ["Dwaekki aprova esse Lounge VIP! 🐰💪", "YOH! Vamos quebrar tudo no dominATE!"], timer: 26, bubble: null },
  { id: 7, name: 'I.N', color: '#06b6d4', x: 590, y: 240, targetX: 590, targetY: 240, isWalking: false, animFrame: 0, phrases: ["Nosso Maknae on Top ama vocês! 🦊", "Vocês nos fazem os artistas mais felizes do mundo!"], timer: 28, bubble: null }
];

// ─── ChatPoint Room Controller ──────────────────────────────────────────
class ChatPointRoom {
  constructor() {
    this.canvas = document.getElementById('chatCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Persistent Unique Client ID (prevents character duplication on reload!)
    this.myClientId = sessionStorage.getItem('stayzoo_chat_client_id');
    if (!this.myClientId) {
      this.myClientId = 'stay_' + Math.random().toString(16).substr(2, 8);
      sessionStorage.setItem('stayzoo_chat_client_id', this.myClientId);
    }

    this.arariSheet = new Image();
    this.arariSheet.src = 'assets/arari/arari_spritesheet.png?v=8.5';

    this.stageTile = new Image();
    this.stageTile.src = 'assets/tiles/tile_stage_skz.png';
    this.stagePattern = null;
    this.stageTile.onload = () => {
      if (this.ctx) {
        try { this.stagePattern = this.ctx.createPattern(this.stageTile, 'repeat'); } catch(e){}
      }
    };

    this.cyberWall = new Image();
    this.cyberWall.src = 'assets/official/cyber_neon_wall.png';

    this.skzArch = new Image();
    this.skzArch.src = 'assets/official/skz_arch_clean.png';

    // Member textures and atlases (0..7)
    this.memberTextures = [];
    this.memberAtlases = [];
    for (let i = 0; i < 8; i++) {
      const tex = new Image();
      tex.src = `assets/characters/${i}_texture.png`;
      this.memberTextures[i] = tex;
      fetch(`assets/characters/${i}_atlas.json`).then(r => r.json()).then(j => {
        this.memberAtlases[i] = j;
      }).catch(() => {});
    }

    this.userAvatar = { ...DEFAULT_AVATAR };
    this.loadUserAvatar();

    this.myPosition = { x: 380, y: 280, targetX: 380, targetY: 280, isWalking: false, animFrame: 0, bubble: null };

    // Arari Mascot Bot
    this.arariBot = {
      name: 'Arari 🦜',
      x: 380, y: 210, targetX: 380, targetY: 210,
      isWalking: false, animFrame: 0,
      bubble: { text: "Olá B-Stay! Bem-vinda ao Lounge VIP oficial! 🦜💜", timer: 9.0 },
      phraseTimer: 12.0
    };

    // SKZ Member Bots
    this.skzBots = SKZ_MEMBER_BOTS.map(b => ({ ...b, phrases: [...b.phrases] }));

    // Remote users stored in a Map keyed by unique clientId (NO DUPLICATES!)
    this.remoteUsers = new Map();

    // DJ Booth System & YouTube Queue
    this.djBooth = { x: 690, y: 120, w: 90, h: 50 };
    this.djState = {
      currentTrack: {
        id: 'gGzpAi8-8mU',
        title: 'Stray Kids - Chk Chk Boom',
        dj: 'DJ Arari 🦜'
      },
      queue: [
        { id: 'EaswWdtB7n8', title: 'Stray Kids - MANIAC', requestedBy: 'B-Stay Oficial' },
        { id: 'TQTlCHxyuu8', title: "Stray Kids - God's Menu", requestedBy: 'Felix Stan' },
        { id: 'OvioeS1ZZ7o', title: 'Stray Kids - LALALALA', requestedBy: 'Changbin Fan' }
      ]
    };

    this.heartbeatTimer = 0;
    this.mqttClient = null;
    this.ytPlayer = null;
    this._ytPendingPlay = false;

    this.setupMQTT();
    this.setupUI();
    this.setupDjEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // If YouTube player already initialized, grab it
    if (window.ytPlayer) this.ytPlayer = window.ytPlayer;

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  // Called by onYouTubeIframeAPIReady when player is ready
  onYtPlayerReady(player) {
    this.ytPlayer = player;
    try {
      player.loadVideoById(this.djState.currentTrack.id);
      player.setVolume(70);
      this._ytPendingPlay = true;
    } catch(e) {}
  }

  // Trigger playback after first user gesture (browser autoplay policy)
  _ensureYtPlaying() {
    if (this.ytPlayer && this._ytPendingPlay) {
      try { this.ytPlayer.playVideo(); this._ytPendingPlay = false; } catch(e) {}
    }
  }

  loadUserAvatar() {
    try {
      const saved = localStorage.getItem('stayzoo_user_avatar');
      if (saved) {
        this.userAvatar = { ...DEFAULT_AVATAR, ...JSON.parse(saved) };
      }
    } catch (e) {}
  }

  saveUserAvatar() {
    try {
      localStorage.setItem('stayzoo_user_avatar', JSON.stringify(this.userAvatar));
    } catch (e) {}
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 800;
    this.canvas.height = rect.height || 420;
    if (this.stageTile.complete && this.ctx && !this.stagePattern) {
      try { this.stagePattern = this.ctx.createPattern(this.stageTile, 'repeat'); } catch(e){}
    }
  }

  setupMQTT() {
    if (typeof mqtt === 'undefined') return;
    try {
      this.mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
        clientId: this.myClientId,
        keepalive: 60,
        clean: true
      });

      this.mqttClient.on('connect', () => {
        this.mqttClient.subscribe('stayzoo/arari/chatpoint/messages');
        this.mqttClient.subscribe('stayzoo/arari/chatpoint/movement');
        this.mqttClient.subscribe('stayzoo/arari/chatpoint/presence');
        this.mqttClient.subscribe('stayzoo/arari/chatpoint/dj_queue');
        this.broadcastPresence();
      });

      this.mqttClient.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          if (data.senderId === this.myClientId) return;

          if (topic.includes('messages')) {
            this.handleRemoteMessage(data);
          } else if (topic.includes('movement')) {
            this.handleRemoteMovement(data);
          } else if (topic.includes('presence')) {
            this.handleRemotePresence(data);
          } else if (topic.includes('dj_queue')) {
            this.handleRemoteDjQueue(data);
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  broadcastPresence() {
    if (!this.mqttClient || !this.mqttClient.connected) return;
    try {
      this.mqttClient.publish('stayzoo/arari/chatpoint/presence', JSON.stringify({
        senderId: this.myClientId,
        name: this.userAvatar.name,
        avatar: this.userAvatar,
        x: this.myPosition.x,
        y: this.myPosition.y
      }));
    } catch(e) {}
  }

  handleRemotePresence(data) {
    if (!data.senderId) return;
    const existing = this.remoteUsers.get(data.senderId);
    if (existing) {
      existing.name = data.name || existing.name;
      existing.avatar = data.avatar || existing.avatar;
      existing.lastSeen = Date.now();
    } else {
      this.remoteUsers.set(data.senderId, {
        id: data.senderId,
        name: data.name || 'Stay',
        avatar: data.avatar || { ...DEFAULT_AVATAR },
        x: data.x || 300, y: data.y || 260,
        targetX: data.x || 300, targetY: data.y || 260,
        isWalking: false, animFrame: 0,
        bubble: null,
        lastSeen: Date.now()
      });
    }
  }

  handleRemoteMessage(data) {
    if (!data.senderId) return;
    this.handleRemotePresence(data);
    const user = this.remoteUsers.get(data.senderId);
    if (user) {
      user.bubble = { text: data.text, timer: 7.0 };
      user.lastSeen = Date.now();
    }
    this.addLogMessage(data.name, data.text);
  }

  handleRemoteMovement(data) {
    if (!data.senderId) return;
    this.handleRemotePresence(data);
    const user = this.remoteUsers.get(data.senderId);
    if (user) {
      user.targetX = data.x;
      user.targetY = data.y;
      user.lastSeen = Date.now();
    }
  }

  handleRemoteDjQueue(data) {
    if (data.currentTrack) this.djState.currentTrack = data.currentTrack;
    if (Array.isArray(data.queue)) this.djState.queue = data.queue;
    this.updateDjUI();
  }

  sendMessage(rawText) {
    if (!rawText || !rawText.trim()) return;

    const result = sanitizeMessage(rawText);
    const cleanText = result.clean;

    this.myPosition.bubble = { text: cleanText, timer: 7.0 };
    this.addLogMessage(this.userAvatar.name, cleanText);

    if (!result.blocked && this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish('stayzoo/arari/chatpoint/messages', JSON.stringify({
          senderId: this.myClientId,
          name: this.userAvatar.name,
          avatar: this.userAvatar,
          x: this.myPosition.x,
          y: this.myPosition.y,
          text: cleanText
        }));
      } catch (e) {}
    }

    setTimeout(() => {
      const responder = Math.random() < 0.5 ? this.arariBot : this.skzBots[Math.floor(Math.random() * this.skzBots.length)];
      if (responder === this.arariBot) {
        const phrase = ARARI_STAY_PHRASES[Math.floor(Math.random() * ARARI_STAY_PHRASES.length)];
        this.arariBot.bubble = { text: phrase, timer: 7.5 };
        this.addLogMessage('Arari 🦜', phrase);
      } else if (responder) {
        const phrase = responder.phrases[Math.floor(Math.random() * responder.phrases.length)];
        responder.bubble = { text: phrase, timer: 7.5 };
        this.addLogMessage(responder.name + ' ⭐', phrase);
      }
    }, 1200 + Math.random() * 2000);
  }

  addLogMessage(author, text) {
    const log = document.getElementById('chat-log');
    if (!log) return;

    const item = document.createElement('div');
    item.className = 'chat-log-item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'chat-log-name';
    nameSpan.textContent = author + ': ';

    const textSpan = document.createElement('span');
    textSpan.className = 'chat-log-text';
    textSpan.textContent = text;

    item.appendChild(nameSpan);
    item.appendChild(textSpan);
    log.appendChild(item);

    log.scrollTop = log.scrollHeight;
  }

  setupUI() {
    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-input-field');
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value;
        if (text) {
          this.sendMessage(text);
          input.value = '';
        }
      });
    }

    if (this.canvas) {
      const handleStageClick = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;

        // Check if clicked on DJ Booth
        if (
          clickX >= this.djBooth.x - 10 && clickX <= this.djBooth.x + this.djBooth.w + 10 &&
          clickY >= this.djBooth.y - 10 && clickY <= this.djBooth.y + this.djBooth.h + 10
        ) {
          this.openDjModal();
          return;
        }

        // Safe-zone movement limits
        const safeMinX = 40;
        const safeMaxX = Math.max(100, this.canvas.width - 40);
        const safeMinY = 70;
        const safeMaxY = Math.max(120, this.canvas.height - 40);

        this.myPosition.targetX = Math.max(safeMinX, Math.min(safeMaxX, clickX));
        this.myPosition.targetY = Math.max(safeMinY, Math.min(safeMaxY, clickY));

        if (this.mqttClient && this.mqttClient.connected) {
          try {
            this.mqttClient.publish('stayzoo/arari/chatpoint/movement', JSON.stringify({
              senderId: this.myClientId,
              name: this.userAvatar.name,
              avatar: this.userAvatar,
              x: this.myPosition.targetX,
              y: this.myPosition.targetY
            }));
          } catch(e) {}
        }
      };

      this.canvas.addEventListener('click', (e) => {
        this._ensureYtPlaying(); // First click = user gesture = allow audio
        handleStageClick(e.clientX, e.clientY);
      });
      this.canvas.addEventListener('touchstart', (e) => {
        this._ensureYtPlaying(); // First touch = user gesture = allow audio
        if (e.touches && e.touches[0]) {
          handleStageClick(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
    }

    const modal = document.getElementById('avatar-creator-modal');
    const btnCustomizer = document.getElementById('btn-open-customizer');
    const btnSave = document.getElementById('btn-save-avatar-enter');

    if (btnCustomizer && modal) {
      btnCustomizer.addEventListener('click', () => {
        modal.classList.remove('hidden');
        this.renderAvatarPreview();
      });
    }

    // Category Tabs: Human vs Mascot
    const tabHuman = document.getElementById('tab-btn-human');
    const tabMascot = document.getElementById('tab-btn-mascot');
    const groupHuman = document.getElementById('group-human-controls');
    const groupMascot = document.getElementById('group-mascot-picker');

    if (tabHuman && tabMascot) {
      tabHuman.addEventListener('click', () => {
        tabHuman.classList.add('active');
        tabMascot.classList.remove('active');
        if (groupHuman) groupHuman.classList.remove('hidden');
        if (groupMascot) groupMascot.classList.add('hidden');
        this.userAvatar.category = 'human';
        this.renderAvatarPreview();
      });

      tabMascot.addEventListener('click', () => {
        tabMascot.classList.add('active');
        tabHuman.classList.remove('active');
        if (groupHuman) groupHuman.classList.add('hidden');
        if (groupMascot) groupMascot.classList.remove('hidden');
        this.userAvatar.category = 'mascot';
        this.renderAvatarPreview();
      });
    }

    // Mascot picker buttons
    document.querySelectorAll('.mascot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mascot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.userAvatar.category = 'mascot';
        this.userAvatar.mascot = btn.dataset.value;
        this.renderAvatarPreview();
      });
    });

    // Human avatar options
    document.querySelectorAll('.avatar-gender-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.avatar-gender-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.userAvatar.gender = btn.dataset.gender;
        this.renderAvatarPreview();
      });
    });

    document.querySelectorAll('.avatar-opt-btn:not(.mascot-btn)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = btn.dataset.type;
        const val = btn.dataset.value;
        if (type && val) {
          this.userAvatar[type] = val;
          this.renderAvatarPreview();
        }
      });
    });

    // Save & Enter (With Unique Nickname Validation!)
    if (btnSave && modal) {
      btnSave.addEventListener('click', () => {
        const nickInput = document.getElementById('avatar-nickname-input');
        const chosen = (nickInput ? nickInput.value.trim() : '') || 'Stay';

        // Check for duplicate names among active participants
        const isDuplicate = Array.from(this.remoteUsers.values()).some(
          u => u.name && u.name.toLowerCase() === chosen.toLowerCase() && u.id !== this.myClientId
        ) || this.skzBots.some(b => b.name.toLowerCase() === chosen.toLowerCase())
          || chosen.toLowerCase() === 'arari';

        if (isDuplicate) {
          alert(`O nome "${chosen}" já está em uso por outro Stay na sala! Escolha outro nome.`);
          return;
        }

        this.userAvatar.name = chosen;
        this.saveUserAvatar();
        modal.classList.add('hidden');

        // Broadcast updated avatar to everyone immediately!
        this.broadcastPresence();
        this.addLogMessage('Sistema', `Você entrou como: ${this.userAvatar.name} ✨`);
      });
    }
  }

  setupDjEvents() {
    const btnOpenDj = document.getElementById('btn-open-dj');
    const djModal = document.getElementById('dj-booth-modal');
    const btnCloseDj = document.getElementById('btn-close-dj');
    const btnAddSong = document.getElementById('btn-dj-add-song');
    const songInput = document.getElementById('dj-song-input');
    const btnSkip = document.getElementById('btn-dj-skip');

    if (btnOpenDj) btnOpenDj.addEventListener('click', () => this.openDjModal());
    if (btnCloseDj && djModal) btnCloseDj.addEventListener('click', () => djModal.classList.add('hidden'));

    if (btnAddSong && songInput) {
      btnAddSong.addEventListener('click', () => {
        this._ensureYtPlaying(); // User gesture -> allow autoplay
        const query = songInput.value.trim();
        if (query) {
          this.addSongToDjQueue(query);
          songInput.value = '';
        }
      });
    }

    if (btnSkip) {
      btnSkip.addEventListener('click', () => this.skipDjTrack());
    }
  }

  openDjModal() {
    const djModal = document.getElementById('dj-booth-modal');
    if (djModal) {
      djModal.classList.remove('hidden');
      this.updateDjUI();
    }
  }

  updateDjUI() {
    const titleEl = document.getElementById('dj-current-title');
    const ownerEl = document.getElementById('dj-current-owner');
    const listEl = document.getElementById('dj-queue-items');

    if (titleEl) titleEl.textContent = this.djState.currentTrack.title;
    if (ownerEl) ownerEl.textContent = 'DJ da vez: ' + this.djState.currentTrack.dj;

    if (listEl) {
      listEl.innerHTML = '';
      if (this.djState.queue.length === 0) {
        listEl.innerHTML = '<div style="color:#64748b;font-size:10px;">Fila vazia. Peça uma música do Stray Kids acima!</div>';
      } else {
        this.djState.queue.forEach((item, idx) => {
          const div = document.createElement('div');
          div.style.cssText = 'font-size:10px;color:#94a3b8;padding:4px 6px;background:#180a36;border-radius:4px;';
          div.textContent = `${idx + 1}. ${item.title} (pedido por ${item.requestedBy})`;
          listEl.appendChild(div);
        });
      }
    }
  }

  addSongToDjQueue(query) {
    let videoId = 'gGzpAi8-8mU';
    let title = query;

    // Detect YouTube link
    if (query.includes('youtu.be/')) {
      videoId = query.split('youtu.be/')[1].split('?')[0];
    } else if (query.includes('watch?v=')) {
      videoId = query.split('watch?v=')[1].split('&')[0];
    } else {
      // Common SKZ favorites by keyword
      const q = query.toLowerCase();
      if (q.includes('maniac')) { videoId = 'EaswWdtB7n8'; title = 'Stray Kids - MANIAC'; }
      else if (q.includes('menu')) { videoId = 'TQTlCHxyuu8'; title = "Stray Kids - God's Menu"; }
      else if (q.includes('chk')) { videoId = 'gGzpAi8-8mU'; title = 'Stray Kids - Chk Chk Boom'; }
      else if (q.includes('lala')) { videoId = 'OvioeS1ZZ7o'; title = 'Stray Kids - LALALALA'; }
      else if (q.includes('thunder')) { videoId = 'EaswWdtB7n8'; title = 'Stray Kids - Thunderous'; }
      else { title = 'Stray Kids - ' + query; }
    }

    const item = { id: videoId, title, requestedBy: this.userAvatar.name };
    this.djState.queue.push(item);
    this.updateDjUI();

    this.addLogMessage('Mesa DJ 🎧', `${this.userAvatar.name} colocou "${title}" na fila de músicas!`);

    if (this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish('stayzoo/arari/chatpoint/dj_queue', JSON.stringify(this.djState));
      } catch(e) {}
    }
  }

  skipDjTrack() {
    if (this.djState.queue.length > 0) {
      const next = this.djState.queue.shift();
      this.djState.currentTrack = {
        id: next.id,
        title: next.title,
        dj: next.requestedBy
      };

      const yt = this.ytPlayer || window.ytPlayer;
      if (yt && typeof yt.loadVideoById === 'function') {
        try {
          yt.loadVideoById(next.id);
          yt.setVolume(70);
          yt.playVideo();
        } catch(e){}
      }

      this.addLogMessage('Mesa DJ 🎧', `Tocando agora: ${next.title} (pedido por ${next.requestedBy})`);
      this.updateDjUI();

      if (this.mqttClient && this.mqttClient.connected) {
        try {
          this.mqttClient.publish('stayzoo/arari/chatpoint/dj_queue', JSON.stringify(this.djState));
        } catch(e) {}
      }
    }
  }

  renderAvatarPreview() {
    const canvas = document.getElementById('avatar-preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    AvatarRenderer.drawAvatar(ctx, canvas.width / 2, canvas.height / 2 + 10, this.userAvatar, false, 0);
  }

  update(dt) {
    const cw = this.canvas ? this.canvas.width : 800;
    const ch = this.canvas ? this.canvas.height : 420;

    // Safe boundaries on mobile/desktop
    const safeMinX = 35;
    const safeMaxX = Math.max(100, cw - 35);
    const safeMinY = 70;
    const safeMaxY = Math.max(120, ch - 35);

    // 1. User Position
    const my = this.myPosition;
    const dist = Math.hypot(my.targetX - my.x, my.targetY - my.y);
    if (dist > 3) {
      my.isWalking = true;
      my.x += (my.targetX - my.x) * 0.08;
      my.y += (my.targetY - my.y) * 0.08;
      my.animFrame += dt * 6;
    } else {
      my.isWalking = false;
      my.animFrame = 0;
    }
    my.x = Math.max(safeMinX, Math.min(safeMaxX, my.x));
    my.y = Math.max(safeMinY, Math.min(safeMaxY, my.y));

    if (my.bubble) {
      my.bubble.timer -= dt;
      if (my.bubble.timer <= 0) my.bubble = null;
    }

    // 2. Arari Mascot Bot
    const arari = this.arariBot;
    arari.phraseTimer -= dt;
    if (arari.phraseTimer <= 0) {
      arari.phraseTimer = 20.0 + Math.random() * 15.0;
      const phrase = ARARI_STAY_PHRASES[Math.floor(Math.random() * ARARI_STAY_PHRASES.length)];
      arari.bubble = { text: phrase, timer: 7.5 };
      this.addLogMessage('Arari 🦜', phrase);
    }
    const aDist = Math.hypot(arari.targetX - arari.x, arari.targetY - arari.y);
    if (aDist > 3) {
      arari.isWalking = true;
      arari.x += (arari.targetX - arari.x) * 0.05;
      arari.y += (arari.targetY - arari.y) * 0.05;
      arari.animFrame += dt * 6;
    } else {
      arari.isWalking = false;
      arari.animFrame = 0;
    }
    arari.x = Math.max(safeMinX, Math.min(safeMaxX, arari.x));
    arari.y = Math.max(safeMinY, Math.min(safeMaxY, arari.y));

    if (arari.bubble) {
      arari.bubble.timer -= dt;
      if (arari.bubble.timer <= 0) arari.bubble = null;
    }
    if (Math.random() < 0.003 && !arari.isWalking) {
      arari.targetX = safeMinX + Math.random() * (safeMaxX - safeMinX);
      arari.targetY = safeMinY + Math.random() * (safeMaxY - safeMinY);
    }

    // 3. SKZ Member Bots
    this.skzBots.forEach(bot => {
      bot.timer -= dt;
      if (bot.timer <= 0) {
        bot.timer = 18.0 + Math.random() * 20.0;
        const phrase = bot.phrases[Math.floor(Math.random() * bot.phrases.length)];
        bot.bubble = { text: phrase, timer: 7.5 };
        this.addLogMessage(bot.name + ' ⭐', phrase);
      }
      const bDist = Math.hypot(bot.targetX - bot.x, bot.targetY - bot.y);
      if (bDist > 3) {
        bot.isWalking = true;
        bot.x += (bot.targetX - bot.x) * 0.04;
        bot.y += (bot.targetY - bot.y) * 0.04;
      } else {
        bot.isWalking = false;
      }
      bot.x = Math.max(safeMinX, Math.min(safeMaxX, bot.x));
      bot.y = Math.max(safeMinY, Math.min(safeMaxY, bot.y));

      if (bot.bubble) {
        bot.bubble.timer -= dt;
        if (bot.bubble.timer <= 0) bot.bubble = null;
      }
      if (Math.random() < 0.002 && !bot.isWalking) {
        bot.targetX = safeMinX + Math.random() * (safeMaxX - safeMinX);
        bot.targetY = safeMinY + Math.random() * (safeMaxY - safeMinY);
      }
    });

    // 4. Remote Users Animation & Stale Disconnect Cleanup
    const nowMs = Date.now();
    for (const [id, u] of this.remoteUsers.entries()) {
      if (nowMs - u.lastSeen > 25000) {
        this.remoteUsers.delete(id);
        continue;
      }
      const rDist = Math.hypot(u.targetX - u.x, u.targetY - u.y);
      if (rDist > 3) {
        u.isWalking = true;
        u.x += (u.targetX - u.x) * 0.08;
        u.y += (u.targetY - u.y) * 0.08;
        u.animFrame += dt * 6;
      } else {
        u.isWalking = false;
        u.animFrame = 0;
      }
      u.x = Math.max(safeMinX, Math.min(safeMaxX, u.x));
      u.y = Math.max(safeMinY, Math.min(safeMaxY, u.y));

      if (u.bubble) {
        u.bubble.timer -= dt;
        if (u.bubble.timer <= 0) u.bubble = null;
      }
    }

    // Heartbeat every 8s
    this.heartbeatTimer += dt;
    if (this.heartbeatTimer >= 8.0) {
      this.heartbeatTimer = 0;
      this.broadcastPresence();
    }
  }

  // Draw identical stage environment for the chatroom
  drawChatStageBackground(ctx, cw, ch) {
    const now = performance.now();

    // 1. Dark arena backdrop
    ctx.fillStyle = '#070412';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Upper Cyber Wall
    ctx.fillStyle = '#100b24';
    ctx.fillRect(0, 0, cw, 60);

    if (this.cyberWall.complete) {
      for (let wx = 0; wx < cw; wx += 435) {
        ctx.drawImage(this.cyberWall, wx, 14, 435, 46);
      }
    }

    // 3. Chrome STRAY KIDS Arch (Centered at top)
    if (this.skzArch.complete) {
      const archW = Math.min(260, cw * 0.38);
      const archH = archW * (145 / 350);
      ctx.drawImage(this.skzArch, (cw - archW) / 2, 4, archW, archH);
    }

    // 4. Main Stage Floor
    const stageY = 60;
    const stageH = ch - 100;
    if (this.stagePattern) {
      ctx.fillStyle = this.stagePattern;
      ctx.fillRect(0, stageY, cw, stageH);
    } else {
      ctx.fillStyle = '#2d3b50';
      ctx.fillRect(0, stageY, cw, stageH);
    }

    ctx.strokeStyle = '#435875';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, stageY, cw, stageH);

    // 5. Concert Stage Speakers & Soundwaves
    const beatPulse = Math.sin(now * 0.012);
    const spkScale = 1.0 + beatPulse * 0.05;

    // Left Speaker Stack
    ctx.fillStyle = '#111827';
    ctx.fillRect(14, 110, 24 * spkScale, 48 * spkScale);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 110, 24 * spkScale, 48 * spkScale);

    // Right Speaker Stack
    ctx.fillStyle = '#111827';
    ctx.fillRect(cw - 38, 110, 24 * spkScale, 48 * spkScale);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(cw - 38, 110, 24 * spkScale, 48 * spkScale);

    // Expanding Soundwaves
    ctx.strokeStyle = '#38bdf8';
    for (let i = 1; i <= 3; i++) {
      const waveRad = ((now * 0.04 + i * 20) % 60);
      const alpha = Math.max(0, 1 - waveRad / 60) * 0.5;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(36, 134, waveRad, -0.4 * Math.PI, 0.4 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cw - 36, 134, waveRad, 0.6 * Math.PI, 1.4 * Math.PI);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 6. DJ Booth Table on Stage
    this.djBooth.x = Math.min(cw - 110, Math.max(380, cw * 0.75));
    const dj = this.djBooth;
    ctx.fillStyle = '#1e113a';
    ctx.fillRect(dj.x, dj.y, dj.w, dj.h);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(dj.x, dj.y, dj.w, dj.h);

    // Dual Turntables
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(dj.x + 24, dj.y + 20, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(dj.x + dj.w - 24, dj.y + 20, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(dj.x + 24, dj.y + 20, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dj.x + dj.w - 24, dj.y + 20, 3, 0, Math.PI * 2); ctx.fill();

    // Equalizer LED bar
    for (let ei = 0; ei < 5; ei++) {
      const barH = 4 + Math.abs(Math.sin(now * 0.01 + ei)) * 12;
      ctx.fillStyle = ei % 2 === 0 ? '#10b981' : '#f59e0b';
      ctx.fillRect(dj.x + 38 + ei * 3, dj.y + 28 - barH, 2, barH);
    }

    ctx.font = 'bold 8px DePixelBold, monospace';
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'center';
    ctx.fillText('🎧 MESA DJ', dj.x + dj.w / 2, dj.y + 44);
    ctx.textAlign = 'left';

    // 7. Blinking concert lightsticks at the bottom
    const colors = ['#ffffff', '#38bdf8', '#e879f9', '#ffd700', '#4ade80', '#fb923c'];
    for (let lx = 14; lx < cw; lx += 22) {
      const pulse = Math.sin((lx * 0.05 + now * 0.003));
      if (pulse > 0.1) {
        const ci = Math.floor(Math.abs(lx * 7) % colors.length);
        ctx.fillStyle = colors[ci];
        ctx.globalAlpha = 0.3 + 0.6 * ((pulse + 1) / 2);
        ctx.beginPath();
        ctx.arc(lx, ch - 22 + Math.sin(lx * 0.2) * 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  render(now) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    // 1. Draw Authentic Stage Background with DJ & Speakers
    this.drawChatStageBackground(ctx, cw, ch);

    // 2. Draw Arari Mascot Bot
    this.drawArariBot(ctx, now);

    // 3. Draw SKZ Member Bots
    this.drawSkzBots(ctx, now);

    // 4. Draw Characters (My User + Remote Users, sorted by Y for natural depth!)
    const allUsers = [
      { ...this.myPosition, name: this.userAvatar.name, avatar: this.userAvatar, isMe: true },
      ...Array.from(this.remoteUsers.values()).map(u => ({ ...u, isMe: false }))
    ];
    allUsers.sort((a, b) => a.y - b.y);

    allUsers.forEach(c => {
      AvatarRenderer.drawAvatar(ctx, c.x, c.y, c.avatar, c.isWalking, c.animFrame);

      // Name Tag
      ctx.font = 'bold 9px DePixelBold, monospace';
      ctx.textAlign = 'center';
      const label = c.isMe ? `★ ${c.name}` : c.name;
      const tw = ctx.measureText(label).width;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(c.x - tw / 2 - 4, c.y + 26, tw + 8, 13);
      ctx.strokeStyle = c.isMe ? '#ffd700' : '#a855f7';
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x - tw / 2 - 4, c.y + 26, tw + 8, 13);

      ctx.fillStyle = c.isMe ? '#ffd700' : '#ffffff';
      ctx.fillText(label, c.x, c.y + 36);

      // Speech Bubble
      if (c.bubble) {
        this.drawSpeechBubble(ctx, c.x, c.y - 40, c.bubble.text);
      }
    });
  }

  drawArariBot(ctx, now) {
    const a = this.arariBot;

    // Ground Shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(Math.floor(a.x), Math.floor(a.y + 18), 14, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(Math.floor(a.x), Math.floor(a.y));

    if (this.arariSheet.complete && this.arariSheet.naturalWidth > 0) {
      const FRAME_SIZE = 96;
      const DISPLAY_SIZE = 54;
      
      let row = 0;
      let col = 0;
      let flipLeft = false;

      if (a.isWalking) {
        const dx = a.targetX - a.x;
        const dy = a.targetY - a.y;
        if (Math.abs(dx) > Math.abs(dy)) {
          row = 1; // Side walk
          col = Math.floor(now * 0.008) % 5;
          flipLeft = (dx < 0);
        } else if (dy < 0) {
          row = 3; // Up walk
          col = Math.floor(now * 0.008) % 4;
        } else {
          row = 2; // Down walk
          col = Math.floor(now * 0.008) % 5;
        }
      } else {
        row = 0; // Front idle
        col = (Math.floor(now * 0.001) % 6 === 5) ? 3 : 0;
      }

      if (flipLeft) ctx.scale(-1, 1);

      ctx.drawImage(
        this.arariSheet,
        col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
        -DISPLAY_SIZE / 2, -DISPLAY_SIZE / 2, DISPLAY_SIZE, DISPLAY_SIZE
      );

      if (flipLeft) ctx.scale(-1, 1);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    // Arari Badge
    ctx.font = 'bold 9px DePixelBold, monospace';
    ctx.textAlign = 'center';
    const tag = '🦜 Arari';
    const tw = ctx.measureText(tag).width;

    ctx.fillStyle = '#1e0836';
    ctx.fillRect(-tw / 2 - 4, 30, tw + 8, 14);
    ctx.strokeStyle = '#ffd700';
    ctx.strokeRect(-tw / 2 - 4, 30, tw + 8, 14);

    ctx.fillStyle = '#ffd700';
    ctx.fillText(tag, 0, 41);
    ctx.restore();

    if (a.bubble) {
      this.drawSpeechBubble(ctx, a.x, a.y - 36, a.bubble.text);
    }
  }

  drawSkzBots(ctx, now) {
    this.skzBots.forEach(bot => {
      // Ground Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(Math.floor(bot.x), Math.floor(bot.y + 18), 14, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.fill();
      ctx.restore();

      const atlas = this.memberAtlases[bot.id];
      const tex = this.memberTextures[bot.id];
      const scale = 1.7;

      ctx.save();
      if (atlas && tex && atlas.frames && atlas.frames.length > 0) {
        const frameIdx = bot.isWalking ? (26 + (Math.floor(now * 0.008) % 4)) : 26;
        const frameData = atlas.frames[frameIdx];
        if (frameData) {
          const f = frameData.frame;
          const ss = frameData.spriteSourceSize;
          const src = frameData.sourceSize;

          const dx = Math.floor(bot.x - (src.w * scale) / 2 + ss.x * scale);
          const dy = Math.floor(bot.y - (src.h * scale) / 2 + ss.y * scale);
          const dw = Math.floor(f.w * scale);
          const dh = Math.floor(f.h * scale);

          ctx.drawImage(tex, f.x, f.y, f.w, f.h, dx, dy, dw, dh);
        }
      } else {
        ctx.fillStyle = bot.color;
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Bot Name Tag
      ctx.font = 'bold 8px DePixelBold, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = bot.color;
      ctx.fillText(`★ ${bot.name}`, bot.x, bot.y + 34);

      if (bot.bubble) {
        this.drawSpeechBubble(ctx, bot.x, bot.y - 36, bot.bubble.text);
      }
    });
  }

  drawSpeechBubble(ctx, x, y, text) {
    ctx.save();
    ctx.font = '10px DePixel, monospace';
    const lines = text.length > 28 ? [text.slice(0, 26) + '...', text.slice(26, 52)] : [text];
    const maxLineW = Math.max(...lines.map(l => ctx.measureText(l).width));
    const boxW = maxLineW + 16;
    const boxH = lines.length * 14 + 10;
    const boxX = x - boxW / 2;
    const boxY = y - boxH;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Triangle pointer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.beginPath();
    ctx.moveTo(x - 5, boxY + boxH);
    ctx.lineTo(x, boxY + boxH + 6);
    ctx.lineTo(x + 5, boxY + boxH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    lines.forEach((line, idx) => {
      ctx.fillText(line, x, boxY + 14 + idx * 14);
    });
    ctx.restore();
  }

  loop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    this.update(dt);
    this.render(now);

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Global ChatPoint Singleton
window._chatPoint = null;
window.initChatPoint = function() {
  if (!window._chatPoint) {
    window._chatPoint = new ChatPointRoom();
  }
};
