/**
 * ChatPoint B-Stay (Visual Chatroom inspired by Humor Tadela)
 * Stray Kids dominATE Fan Club Chat & Avatar Creator
 * Version 3.0 - Unified Concert Stage Visuals, SKZ Members as Active Bots, Instant Avatar Customizer & Profanity Filter
 */

// ─── Profanity & NSFW Filter (Portuguese & English + Leet Speak) ────────
const BANNED_PATTERNS = [
  // Português: Palavrões & Conteúdo Sexual
  'puta', 'puto', 'putaria', 'vagabund', 'vadia', 'piranha', 'prostitut',
  'caralho', 'carai', 'krl', 'krai', 'porra', 'prr', 'merda', 'bosta',
  'cacete', 'foder', 'foda', 'fudeu', 'fodeu', 'fudid', 'fodid',
  'buceta', 'bct', 'piroca', 'pica', 'pauzao', 'rola', 'chupada', 'chupar',
  'boquete', 'siririca', 'safad', 'tarad', 'arrombado', 'arrombada',
  'viado', 'viadagem', 'corno', 'corna', 'bicha',
  'sexo', 'transar', 'transa', 'trepar', 'nude', 'nudes', 'nudez', 'pelad',
  'porno', 'porn', 'hentai', 'xvideos', 'onlyfans', 'penis', 'vagina', 'orgasmo',
  // English: Profanities & NSFW
  'fuck', 'fucking', 'fucked', 'shit', 'bitch', 'asshole', 'cunt', 'dick',
  'pussy', 'slut', 'whore', 'cock', 'blowjob', 'dildo', 'masturbat',
  'boobs', 'tits', 'naked', 'horny'
];

function sanitizeMessage(text) {
  if (!text) return { clean: '', blocked: false };

  // Normalize leet-speak (e.g., p.u.t.a -> puta, s3x0 -> sexo, c@ralho -> caralho)
  const normalized = text.toLowerCase()
    .replace(/[0o]/g, 'o')
    .replace(/[1il!]/g, 'i')
    .replace(/[3e]/g, 'e')
    .replace(/[4a@]/g, 'a')
    .replace(/[5s$]/g, 's')
    .replace(/[7t]/g, 't')
    .replace(/[^a-z0-9]/g, '');

  for (const word of BANNED_PATTERNS) {
    if (normalized.includes(word)) {
      return {
        clean: 'Mensagem filtrada pelo sistema B-Stay Safe Space 🦜💜 (Mantenha o chat amigável!)',
        blocked: true
      };
    }
  }

  return { clean: text.trim().substring(0, 80), blocked: false };
}

// ─── Default Avatar Settings ────────────────────────────────────────────
const DEFAULT_AVATAR = {
  gender: 'female',
  skin: '#ffd1b3',
  hairStyle: 'twin_buns',
  hairColor: '#3a2010',
  outfit: 'dominate_jacket',
  accessory: 'nachimbong',
  name: 'B-Stay Brasil'
};

// ─── Procedural Pixel-Art Avatar Renderer (Humor Tadela Style) ──────────
class AvatarRenderer {
  static drawAvatar(ctx, x, y, config, isWalking = false, animFrame = 0) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    const skin = config.skin || '#ffd1b3';
    const hair = config.hairColor || '#4a2c11';
    const gender = config.gender || 'female';
    const style = config.hairStyle || (gender === 'female' ? 'twin_buns' : 'curtain_kpop');
    const outfit = config.outfit || 'dominate_jacket';
    const accessory = config.accessory || 'nachimbong';

    const bob = isWalking ? Math.sin(animFrame * 1.5) * 2 : 0;
    const legOffset = isWalking ? Math.sin(animFrame * 1.5) * 3 : 0;

    // 1. Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

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

    // Jacket golden zipper & SKZ red logo patch
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

    // 5. Nachimbong Lightstick
    if (accessory === 'nachimbong') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 2 + bob, 2, 12);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(13, 0 + bob, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(13, 0 + bob, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.arc(13, 0 + bob, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Head (Humor Tadela expressive proportions)
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

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -17 + bob, 2, 2);
    ctx.fillRect(4, -17 + bob, 2, 2);

    // Mouth
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -9 + bob, 3.5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // 7. Hair
    ctx.fillStyle = hair;
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;

    if (style === 'twin_buns') {
      ctx.beginPath();
      ctx.arc(0, -18 + bob, 15, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-14, -24 + bob, 6, 0, Math.PI * 2);
      ctx.arc(14, -24 + bob, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(-10, -22 + bob, 20, 6);
    } else if (style === 'long_wavy') {
      ctx.beginPath();
      ctx.arc(0, -18 + bob, 15, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-14, -16 + bob, 5, 24);
      ctx.fillRect(9, -16 + bob, 5, 24);
      ctx.fillRect(-9, -22 + bob, 18, 5);
    } else if (style === 'curtain_kpop') {
      ctx.beginPath();
      ctx.arc(0, -18 + bob, 15, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-13, -18 + bob, 5, 12);
      ctx.fillRect(8, -18 + bob, 5, 12);
      ctx.fillRect(-11, -22 + bob, 8, 7);
      ctx.fillRect(3, -22 + bob, 8, 7);
    } else {
      ctx.beginPath();
      ctx.arc(0, -19 + bob, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-10, -22 + bob, 20, 5);
    }

    // 8. Accessories
    if (accessory === 'cat_ears') {
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.moveTo(-12, -26 + bob); ctx.lineTo(-6, -34 + bob); ctx.lineTo(-2, -26 + bob); ctx.fill();
      ctx.moveTo(2, -26 + bob); ctx.lineTo(6, -34 + bob); ctx.lineTo(12, -26 + bob); ctx.fill();
    } else if (accessory === 'headphones') {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -14 + bob, 15, 1.1 * Math.PI, 1.9 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-16, -18 + bob, 4, 8);
      ctx.fillRect(12, -18 + bob, 4, 8);
    }

    ctx.restore();
  }
}

// ─── Arari Official Bot Frases STAY ─────────────────────────────────────
const ARARI_STAY_PHRASES = [
  "Stray Kids everywhere all around the world! ⚡",
  "Você sabia? O Bang Chan disse que o Brasil tem a energia mais alta do planeta! 🇧🇷",
  "O Felix falando 'G'day mate' com aquele sorrisinho derrete qualquer STAY! ✨",
  "Lee Know nos encarando no palco com aquele olhar de Leebit haha 🐰",
  "Quem mais não supera a coreografia do Hyunjin?! Que arte pura!",
  "Dwaekki no palco é pura potência! Changbin sempre amassando no rap! 💪",
  "HAN Quokka: melhor all-rounder do K-pop, rima rápido e canta agudo demais! 🐿️",
  "Seungmin cantando ao vivo parece gravação de estúdio de tão impecável! 🐶🎤",
  "Nosso Maknae I.N brilhou muito no show! Nosso pãozinho favorito! 🍞🦊",
  "B-Stay unida jamais será vencida! Nosso amor atravessa oceanos! 🦜💜",
  "Vocês já levantaram a Nachimbong hoje? 🔦✨",
  "HIHI! Amendoim e carinho de Stay é a melhor combinação do mundo! 🥜❤️",
  "O Trio Caótico: Arari + BbokAri + Dwaekki dominando tudo! 💥",
  "STAY: Não importa a distância, o Stray Kids sempre encontra a gente na música!",
  "Vamos cantar todos juntos: 'Stray Kids dominATE!' 🎶",
  "A Araruja veio direto do Brasil pra voar junto com vocês! 🇧🇷🪽",
  "Nunca se esqueçam: 'You make Stray Kids stay!' ♥"
];

// ─── Stray Kids Member Bots in Chat ─────────────────────────────────────
const SKZ_MEMBER_BOTS = [
  {
    name: 'Bang Chan 🐺', id: 2, skzoo: 'Wolf Chan', color: '#ef4444',
    x: 180, y: 270, targetX: 180, targetY: 270, isWalking: false, animFrame: 0,
    phrases: [
      "G'day B-STAY! Como vocês estão hoje? 🇧🇷",
      "Obrigado pelo amor do Brasil! Vocês são incríveis! ♥",
      "Stay com a gente sempre! Wolf Chan manda um abraço! 🐺",
      "Stray Kids everywhere all around the world! ⚡"
    ],
    timer: 10 + Math.random() * 12, bubble: null
  },
  {
    name: 'Felix 🐥', id: 3, skzoo: 'BbokAri', color: '#fb923c',
    x: 320, y: 310, targetX: 320, targetY: 310, isWalking: false, animFrame: 0,
    phrases: [
      "Oi B-Stay! Arari é fofa demais! 🦜✨",
      "Trio Caótico na área: Arari + BbokAri + Dwaekki! 💥",
      "Saranghaeyo, Brasil! Vocês têm meu coração! 🧡",
      "Muito obrigado pela energia nos shows!"
    ],
    timer: 16 + Math.random() * 14, bubble: null
  },
  {
    name: 'Lee Know 🐰', id: 0, skzoo: 'Leebit', color: '#a855f7',
    x: 460, y: 260, targetX: 460, targetY: 260, isWalking: false, animFrame: 0,
    phrases: [
      "Olá STAYs! Já dançaram hoje? 🐰💃",
      "O ritmo do Brasil é contagiante demais!",
      "Leebit mandando lembranças pras B-STAYs!"
    ],
    timer: 22 + Math.random() * 16, bubble: null
  },
  {
    name: 'HAN 🐿️', id: 1, skzoo: 'Han Quokka', color: '#f59e0b',
    x: 600, y: 290, targetX: 600, targetY: 290, isWalking: false, animFrame: 0,
    phrases: [
      "E aí, STAYs! Quokka na área compondo novas rimas! 🐿️",
      "A paixão dos fãs do Brasil arrepia até a alma!",
      "B-Stay é pura energia!"
    ],
    timer: 28 + Math.random() * 16, bubble: null
  },
  {
    name: 'Hyunjin 🥟', id: 7, skzoo: 'Jiniret', color: '#818cf8',
    x: 230, y: 340, targetX: 230, targetY: 340, isWalking: false, animFrame: 0,
    phrases: [
      "Oi STAYs! Que visual lindo desse palco! ✨🎨",
      "A arte e os desenhos das B-STAYs são puro talento!",
      "Um beijo carinhoso pra todo mundo no chat!"
    ],
    timer: 34 + Math.random() * 16, bubble: null
  },
  {
    name: 'Changbin 🐷🐰', id: 6, skzoo: 'Dwaekki', color: '#f43f5e',
    x: 520, y: 340, targetX: 520, targetY: 340, isWalking: false, animFrame: 0,
    phrases: [
      "YOH! Dwaekki treinando firme no palco! 💪",
      "A força dos gritos dos B-STAYs faz tudo tremer!",
      "Trio Caótico com a Arari é imbatível! 🔥"
    ],
    timer: 40 + Math.random() * 16, bubble: null
  },
  {
    name: 'Seungmin 🐶', id: 4, skzoo: 'PuppyM', color: '#22c55e',
    x: 680, y: 260, targetX: 680, targetY: 260, isWalking: false, animFrame: 0,
    phrases: [
      "Olá STAYs! Sempre cantando com todo o coração! 🐶🎤",
      "As vozes do Brasil afinadíssimas cantando nossas músicas!",
      "PuppyM manda um abraço bem forte!"
    ],
    timer: 46 + Math.random() * 16, bubble: null
  },
  {
    name: 'I.N 🦊', id: 5, skzoo: 'FoxI.Ny', color: '#38bdf8',
    x: 390, y: 360, targetX: 390, targetY: 360, isWalking: false, animFrame: 0,
    phrases: [
      "Oi gente! Nosso Maknae pãozinho tá aqui! 🍞🦊",
      "Obrigado pelo carinho sem fim, B-STAY!",
      "Vocês nos fazem os artistas mais felizes do mundo!"
    ],
    timer: 52 + Math.random() * 16, bubble: null
  }
];

// ─── ChatPoint Room Controller ──────────────────────────────────────────
class ChatPointRoom {
  constructor() {
    this.canvas = document.getElementById('chatCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.arariSheet = new Image();
    this.arariSheet.src = 'assets/arari/arari_spritesheet.png';

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

    this.myPosition = { x: 380, y: 320, targetX: 380, targetY: 320, isWalking: false, animFrame: 0, bubble: null };

    // Arari Mascot Bot
    this.arariBot = {
      name: 'Arari 🦜',
      x: 380, y: 240, targetX: 380, targetY: 240,
      isWalking: false, animFrame: 0,
      bubble: { text: "Olá B-Stay! Bem-vinda ao palco VIP com o Stray Kids! 🦜💜", timer: 9.0 },
      phraseTimer: 12.0
    };

    // SKZ Member Bots
    this.skzBots = SKZ_MEMBER_BOTS.map(b => ({ ...b, phrases: [...b.phrases] }));

    // Remote real users connected via MQTT
    this.remoteUsers = [];

    this.mqttClient = null;
    this.setupMQTT();
    this.setupUI();
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loadUserAvatar() {
    try {
      const saved = localStorage.getItem('stayzoo_user_avatar');
      if (saved) this.userAvatar = JSON.parse(saved);
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
    this.canvas.height = rect.height || 480;
    if (this.stageTile.complete && this.ctx && !this.stagePattern) {
      try { this.stagePattern = this.ctx.createPattern(this.stageTile, 'repeat'); } catch(e){}
    }
  }

  setupMQTT() {
    if (typeof mqtt === 'undefined') return;
    try {
      const clientId = 'stay_' + Math.random().toString(16).substr(2, 8);
      this.mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
        clientId,
        keepalive: 60,
        clean: true
      });

      this.mqttClient.on('connect', () => {
        this.mqttClient.subscribe('stayzoo/arari/chatpoint/messages');
        this.mqttClient.subscribe('stayzoo/arari/chatpoint/movement');
      });

      this.mqttClient.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          if (data.senderId === clientId) return;

          if (topic.includes('messages')) {
            this.handleRemoteMessage(data);
          } else if (topic.includes('movement')) {
            this.handleRemoteMovement(data);
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  handleRemoteMessage(data) {
    let user = this.remoteUsers.find(u => u.id === data.senderId);
    if (!user) {
      user = {
        id: data.senderId,
        name: data.name,
        x: data.x || 300, y: data.y || 280,
        targetX: data.x || 300, targetY: data.y || 280,
        isWalking: false, animFrame: 0,
        avatar: data.avatar || { ...DEFAULT_AVATAR },
        bubble: null
      };
      this.remoteUsers.push(user);
    }
    user.bubble = { text: data.text, timer: 7.0 };
    this.addLogMessage(data.name, data.text);
  }

  handleRemoteMovement(data) {
    let user = this.remoteUsers.find(u => u.id === data.senderId);
    if (!user) {
      user = {
        id: data.senderId,
        name: data.name,
        x: data.x, y: data.y,
        targetX: data.x, targetY: data.y,
        isWalking: false, animFrame: 0,
        avatar: data.avatar || { ...DEFAULT_AVATAR },
        bubble: null
      };
      this.remoteUsers.push(user);
    } else {
      user.targetX = data.x;
      user.targetY = data.y;
    }
  }

  sendMessage(rawText) {
    if (!rawText || !rawText.trim()) return;

    // Apply Profanity & NSFW Filter
    const result = sanitizeMessage(rawText);
    const cleanText = result.clean;

    this.myPosition.bubble = { text: cleanText, timer: 7.0 };
    this.addLogMessage(this.userAvatar.name, cleanText);

    // Broadcast to global STAYs if safe
    if (!result.blocked && this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish('stayzoo/arari/chatpoint/messages', JSON.stringify({
          senderId: this.mqttClient.options.clientId,
          name: this.userAvatar.name,
          avatar: this.userAvatar,
          x: this.myPosition.x,
          y: this.myPosition.y,
          text: cleanText
        }));
      } catch (e) {}
    }

    // Occasional response from Arari or SKZ bot
    setTimeout(() => {
      const responder = Math.random() < 0.5 ? this.arariBot : this.skzBots[Math.floor(Math.random() * this.skzBots.length)];
      if (responder === this.arariBot) {
        const phrase = ARARI_STAY_PHRASES[Math.floor(Math.random() * ARARI_STAY_PHRASES.length)];
        this.arariBot.bubble = { text: phrase, timer: 7.0 };
        this.addLogMessage('Arari 🦜', phrase);
      } else {
        const phrase = responder.phrases[Math.floor(Math.random() * responder.phrases.length)];
        responder.bubble = { text: phrase, timer: 7.0 };
        this.addLogMessage(responder.name, phrase);
      }
    }, 1600);
  }

  addLogMessage(name, text) {
    const log = document.getElementById('chat-log');
    if (!log) return;
    const item = document.createElement('div');
    item.className = 'chat-log-item';
    item.innerHTML = `<span class="chat-log-name">${name}:</span> <span class="chat-log-text">${text}</span>`;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  setupUI() {
    if (this.canvas) {
      const handleCanvasClick = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;

        // Walkable stage area inside the chatroom
        if (clickY > 120 && clickY < this.canvas.height - 40) {
          this.myPosition.targetX = clickX;
          this.myPosition.targetY = clickY;

          if (this.mqttClient && this.mqttClient.connected) {
            try {
              this.mqttClient.publish('stayzoo/arari/chatpoint/movement', JSON.stringify({
                senderId: this.mqttClient.options.clientId,
                name: this.userAvatar.name,
                avatar: this.userAvatar,
                x: clickX,
                y: clickY
              }));
            } catch (e) {}
          }
        }
      };

      this.canvas.addEventListener('click', (e) => handleCanvasClick(e.clientX, e.clientY));
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) handleCanvasClick(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
    }

    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-input-field');
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage(input.value);
        input.value = '';
      });
    }

    this.setupAvatarCustomizer();
  }

  setupAvatarCustomizer() {
    const previewCanvas = document.getElementById('avatar-preview-canvas');
    const updatePreview = () => {
      if (!previewCanvas) return;
      const ctx = previewCanvas.getContext('2d');
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      AvatarRenderer.drawAvatar(ctx, previewCanvas.width / 2, previewCanvas.height / 2 + 10, this.userAvatar, false, 0);
    };

    updatePreview();

    document.querySelectorAll('.avatar-gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.avatar-gender-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.userAvatar.gender = btn.dataset.gender;
        this.userAvatar.hairStyle = this.userAvatar.gender === 'female' ? 'twin_buns' : 'curtain_kpop';
        this.saveUserAvatar();
        updatePreview();
      });
    });

    document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const val = btn.dataset.value;
        this.userAvatar[type] = val;
        this.saveUserAvatar();
        updatePreview();
      });
    });

    const nameInput = document.getElementById('avatar-nickname-input');
    if (nameInput) {
      nameInput.value = this.userAvatar.name;
      nameInput.addEventListener('input', () => {
        this.userAvatar.name = nameInput.value.trim() || 'Stay';
        this.saveUserAvatar();
      });
    }

    const btnEnter = document.getElementById('btn-save-avatar-enter');
    if (btnEnter) {
      btnEnter.addEventListener('click', () => {
        this.saveUserAvatar();
        document.getElementById('avatar-creator-modal').classList.add('hidden');
        this.addLogMessage('Sistema', `Bem-vindo(a) ${this.userAvatar.name}! Divirta-se no lounge! ✨`);
      });
    }

    const btnOpenCustomizer = document.getElementById('btn-open-customizer');
    if (btnOpenCustomizer) {
      btnOpenCustomizer.addEventListener('click', () => {
        document.getElementById('avatar-creator-modal').classList.remove('hidden');
        updatePreview();
      });
    }
  }

  update(dt) {
    // 1. User Avatar
    const my = this.myPosition;
    const dist = Math.hypot(my.targetX - my.x, my.targetY - my.y);
    if (dist > 4) {
      my.isWalking = true;
      my.x += (my.targetX - my.x) * 0.1;
      my.y += (my.targetY - my.y) * 0.1;
      my.animFrame += dt * 8;
    } else {
      my.isWalking = false;
      my.animFrame = 0;
    }
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
    if (aDist > 4) {
      arari.isWalking = true;
      arari.x += (arari.targetX - arari.x) * 0.05;
      arari.y += (arari.targetY - arari.y) * 0.05;
      arari.animFrame += dt * 6;
    } else {
      arari.isWalking = false;
      arari.animFrame = 0;
    }
    if (arari.bubble) {
      arari.bubble.timer -= dt;
      if (arari.bubble.timer <= 0) arari.bubble = null;
    }
    if (Math.random() < 0.003 && !arari.isWalking) {
      arari.targetX = 140 + Math.random() * (this.canvas.width - 280);
      arari.targetY = 160 + Math.random() * (this.canvas.height - 240);
    }

    // 3. SKZ Member Bots
    this.skzBots.forEach(bot => {
      bot.timer -= dt;
      if (bot.timer <= 0) {
        bot.timer = 24.0 + Math.random() * 22.0;
        const phrase = bot.phrases[Math.floor(Math.random() * bot.phrases.length)];
        bot.bubble = { text: phrase, timer: 7.0 };
        this.addLogMessage(bot.name, phrase);
      }
      const bDist = Math.hypot(bot.targetX - bot.x, bot.targetY - bot.y);
      if (bDist > 4) {
        bot.isWalking = true;
        bot.x += (bot.targetX - bot.x) * 0.04;
        bot.y += (bot.targetY - bot.y) * 0.04;
        bot.animFrame += dt * 5;
      } else {
        bot.isWalking = false;
        bot.animFrame = 0;
      }
      if (bot.bubble) {
        bot.bubble.timer -= dt;
        if (bot.bubble.timer <= 0) bot.bubble = null;
      }
      if (Math.random() < 0.002 && !bot.isWalking) {
        bot.targetX = 100 + Math.random() * (this.canvas.width - 200);
        bot.targetY = 160 + Math.random() * (this.canvas.height - 240);
      }
    });

    // 4. Remote Users
    this.remoteUsers.forEach(u => {
      const uDist = Math.hypot(u.targetX - u.x, u.targetY - u.y);
      if (uDist > 4) {
        u.isWalking = true;
        u.x += (u.targetX - u.x) * 0.08;
        u.y += (u.targetY - u.y) * 0.08;
        u.animFrame += dt * 8;
      } else {
        u.isWalking = false;
        u.animFrame = 0;
      }
      if (u.bubble) {
        u.bubble.timer -= dt;
        if (u.bubble.timer <= 0) u.bubble = null;
      }
    });
  }

  // Draw identical stage environment for the chatroom
  drawChatStageBackground(ctx, cw, ch) {
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
      const archW = Math.min(280, cw * 0.4);
      const archH = archW * (145 / 350);
      ctx.drawImage(this.skzArch, (cw - archW) / 2, 4, archW, archH);
    }

    // 4. Main Stage Floor (Tiled with official stage tiles)
    const stageY = 60;
    const stageH = ch - 110;
    if (this.stagePattern) {
      ctx.fillStyle = this.stagePattern;
      ctx.fillRect(0, stageY, cw, stageH);
    } else {
      ctx.fillStyle = '#2d3b50';
      ctx.fillRect(0, stageY, cw, stageH);
    }

    // Stage guidance lines
    ctx.strokeStyle = '#435875';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, stageY, cw, stageH);

    // Cyan Runway guide accents
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, stageY + stageH - 3, cw, 3);

    // 5. Blinking concert lightsticks (Nachimbong) at the bottom
    const now = performance.now();
    const colors = ['#ffffff', '#38bdf8', '#e879f9', '#ffd700', '#4ade80', '#fb923c'];
    for (let lx = 12; lx < cw; lx += 22) {
      const pulse = Math.sin((lx * 0.05 + now * 0.003));
      if (pulse > 0.1) {
        const ci = Math.floor(Math.abs(lx * 7) % colors.length);
        ctx.fillStyle = colors[ci];
        ctx.globalAlpha = 0.3 + 0.6 * ((pulse + 1) / 2);
        ctx.beginPath();
        ctx.arc(lx, ch - 30 + Math.sin(lx * 0.2) * 12, 2.5, 0, Math.PI * 2);
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

    // 1. Draw Authentic Stage Background
    this.drawChatStageBackground(ctx, cw, ch);

    // 2. Draw Arari Mascot Bot
    this.drawArariBot(ctx, now);

    // 3. Draw SKZ Member Bots
    this.drawSkzBots(ctx, now);

    // 4. Draw Users (User + Remote Users sorted by Y)
    const users = [
      { isMe: true, ...this.myPosition, avatar: this.userAvatar, name: this.userAvatar.name },
      ...this.remoteUsers
    ];
    users.sort((a, b) => a.y - b.y);

    users.forEach(c => {
      AvatarRenderer.drawAvatar(ctx, c.x, c.y, c.avatar, c.isWalking, c.animFrame);

      // Name Tag Pill
      ctx.font = 'bold 9px DePixelBold, monospace';
      ctx.textAlign = 'center';
      const textW = ctx.measureText(c.name).width;

      ctx.fillStyle = c.isMe ? '#ffd700' : 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(c.x - textW / 2 - 4, c.y + 26, textW + 8, 14);
      ctx.strokeStyle = c.isMe ? '#b45309' : '#a855f7';
      ctx.strokeRect(c.x - textW / 2 - 4, c.y + 26, textW + 8, 14);

      ctx.fillStyle = c.isMe ? '#0f172a' : '#ffffff';
      ctx.fillText(c.name, c.x, c.y + 37);

      if (c.bubble) {
        this.drawSpeechBubble(ctx, c.x, c.y - 40, c.bubble.text);
      }
    });
  }

  drawArariBot(ctx, now) {
    const a = this.arariBot;
    ctx.save();
    ctx.translate(Math.floor(a.x), Math.floor(a.y));

    if (this.arariSheet.complete && this.arariSheet.naturalWidth > 0) {
      const FRAME_SIZE = 96;
      const DISPLAY_SIZE = 54;
      const col = a.isWalking ? Math.floor(now * 0.008) % 5 : Math.floor(now * 0.002) % 2;
      const row = 0;

      ctx.drawImage(
        this.arariSheet,
        col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
        -DISPLAY_SIZE / 2, -DISPLAY_SIZE / 2, DISPLAY_SIZE, DISPLAY_SIZE
      );
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

      // Name Tag Pill
      ctx.font = 'bold 8px DePixelBold, monospace';
      ctx.textAlign = 'center';
      const tw = ctx.measureText(bot.name).width;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(bot.x - tw / 2 - 3, bot.y + 24, tw + 6, 12);
      ctx.strokeStyle = bot.color;
      ctx.strokeRect(bot.x - tw / 2 - 3, bot.y + 24, tw + 6, 12);
      ctx.fillStyle = bot.color;
      ctx.fillText(bot.name, bot.x, bot.y + 33);
      ctx.restore();

      if (bot.bubble) {
        this.drawSpeechBubble(ctx, bot.x, bot.y - 36, bot.bubble.text);
      }
    });
  }

  drawSpeechBubble(ctx, x, y, text) {
    ctx.font = '10px DePixel, monospace';
    ctx.textAlign = 'center';
    const lines = [];
    const maxChars = 26;
    for (let i = 0; i < text.length; i += maxChars) {
      lines.push(text.substring(i, i + maxChars));
    }

    const pad = 8;
    const lineH = 13;
    const bubbleH = lines.length * lineH + pad * 2;
    let maxW = 0;
    lines.forEach(l => {
      const w = ctx.measureText(l).width;
      if (w > maxW) maxW = w;
    });
    const bubbleW = Math.max(70, maxW + pad * 2);

    const bx = x - bubbleW / 2;
    const by = y - bubbleH;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(bx, by, bubbleW, bubbleH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 5, by + bubbleH);
    ctx.lineTo(x, by + bubbleH + 6);
    ctx.lineTo(x + 5, by + bubbleH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    lines.forEach((l, idx) => {
      ctx.fillText(l, x, by + pad + 9 + idx * lineH);
    });
  }

  loop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    this.update(dt);
    this.render(now);

    requestAnimationFrame((t) => this.loop(t));
  }
}

window._chatPoint = null;
window.initChatPoint = function() {
  if (!window._chatPoint) {
    window._chatPoint = new ChatPointRoom();
  }
};
