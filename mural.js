// 📌 Stay Mural & Visitor Counter Controller
// Manages permanent post-it notes (1 per IP) and visitor counter on landing page

const DEFAULT_SEED_NOTES = [
  {
    id: 'note-seed-1',
    name: 'B-Stay Oficial 🇧🇷',
    msg: 'Bem-vindos ao portal dominATE! Vamos fazer o show no Brasil ser o mais barulhento do mundo!',
    color: '#fef08a',
    pinColor: '#ef4444',
    rotation: -2,
    date: '08/11/2026',
    ip: 'seed-1'
  },
  {
    id: 'note-seed-2',
    name: 'Lari Stay 🦜',
    msg: 'A Arari ficou a mascote mais linda e fofa que já vi! Parabéns a toda equipe!',
    color: '#fbcfe8',
    pinColor: '#3b82f6',
    rotation: 1.5,
    date: '08/11/2026',
    ip: 'seed-2'
  },
  {
    id: 'note-seed-3',
    name: 'Felix Fan ☀️',
    msg: 'Yongbok te amamos! Seu carisma ilumina tudo! dominATE Brasil!',
    color: '#bbf7d0',
    pinColor: '#f59e0b',
    rotation: -1,
    date: '09/11/2026',
    ip: 'seed-3'
  },
  {
    id: 'note-seed-4',
    name: 'Chan Leader 🐺',
    msg: 'Stray Kids everywhere all around the world! You make Stray Kids STAY!',
    color: '#ddd6fe',
    pinColor: '#10b981',
    rotation: 2.5,
    date: '09/11/2026',
    ip: 'seed-4'
  },
  {
    id: 'note-seed-5',
    name: 'Dwaekki Power 🐷🐰',
    msg: 'Changbin jutdae! Ansiosa demais pro show no estádio!',
    color: '#fed7aa',
    pinColor: '#ec4899',
    rotation: -2,
    date: '09/11/2026',
    ip: 'seed-5'
  },
  {
    id: 'note-seed-6',
    name: 'Quokka Lu 🐿️',
    msg: 'HAN Jisung suas letras tocam nossa alma! Ansiosa pela turnê!',
    color: '#bae6fd',
    pinColor: '#8b5cf6',
    rotation: 1,
    date: '09/11/2026',
    ip: 'seed-6'
  }
];

class StayMuralController {
  constructor() {
    this.notes = [];
    this.clientIp = '';
    this.hasPosted = false;
    this.myNoteId = '';
    this.selectedColor = '#fef08a';
    this.selectedPin = '#ef4444';
    this.mqttClient = null;

    this.init();
  }

  async init() {
    this.loadCachedData();
    this.setupUI();
    this.setupMQTT();
    await this.fetchClientIp();
    await this.fetchNotes();
    this.initVisitorCounter();
  }

  loadCachedData() {
    try {
      const savedNotes = localStorage.getItem('stayzoo_mural_notes');
      if (savedNotes) {
        this.notes = JSON.parse(savedNotes);
      } else {
        this.notes = [...DEFAULT_SEED_NOTES];
      }
      this.myNoteId = localStorage.getItem('stayzoo_mural_my_note_id') || '';
      if (this.myNoteId) {
        this.hasPosted = true;
      }
    } catch (e) {
      this.notes = [...DEFAULT_SEED_NOTES];
    }
    this.renderBoard();
  }

  async fetchClientIp() {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        this.clientIp = data.ip || '';
      }
    } catch (e) {}
  }

  async fetchNotes() {
    try {
      const res = await fetch('/api/mural');
      if (res.ok) {
        const data = await res.json();
        if (data.notes && Array.isArray(data.notes)) {
          // Merge server notes with seed notes without duplicates
          const map = new Map();
          DEFAULT_SEED_NOTES.forEach(n => map.set(n.id, n));
          data.notes.forEach(n => map.set(n.id, n));
          this.notes = Array.from(map.values());
          localStorage.setItem('stayzoo_mural_notes', JSON.stringify(this.notes));
        }
        if (data.clientIp) this.clientIp = data.clientIp;
        if (data.hasPosted) this.hasPosted = true;
      }
    } catch (e) {
      // Offline or local server without /api/mural
    }

    // Check if clientIp already has a note in this.notes
    if (this.clientIp) {
      const found = this.notes.find(n => n.ip === this.clientIp);
      if (found) {
        this.hasPosted = true;
        this.myNoteId = found.id;
        localStorage.setItem('stayzoo_mural_my_note_id', found.id);
      }
    }

    this.renderBoard();
    this.updateActionArea();
  }

  setupMQTT() {
    if (typeof mqtt === 'undefined') return;
    try {
      const clientId = 'mural_' + Math.random().toString(16).slice(2, 8);
      this.mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
        clientId,
        keepalive: 60,
        clean: true
      });

      this.mqttClient.on('connect', () => {
        this.mqttClient.subscribe('stayzoo/arari/mural/new_note');
      });

      this.mqttClient.on('message', (topic, payload) => {
        if (topic === 'stayzoo/arari/mural/new_note') {
          try {
            const note = JSON.parse(payload.toString());
            if (note && note.id && !this.notes.some(n => n.id === note.id)) {
              this.notes.unshift(note);
              localStorage.setItem('stayzoo_mural_notes', JSON.stringify(this.notes));
              this.renderBoard();
            }
          } catch (e) {}
        }
      });
    } catch (e) {}
  }

  setupUI() {
    const btnOpen = document.getElementById('btn-open-add-postit');
    const modal = document.getElementById('mural-modal');
    const btnClose = document.getElementById('btn-close-mural-modal');
    const btnSubmit = document.getElementById('btn-submit-postit');
    const nameInput = document.getElementById('postit-name-input');
    const msgInput = document.getElementById('postit-msg-input');
    const charCounter = document.getElementById('postit-char-counter');

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        if (this.hasPosted) {
          alert('⚠️ Você já fixou seu Post-it neste mural! Cada Stay tem direito a 1 recadinho permanente para caber todo mundo.');
          return;
        }
        if (modal) modal.classList.remove('hidden');
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (msgInput && charCounter) {
      msgInput.addEventListener('input', () => {
        const rem = 140 - msgInput.value.length;
        charCounter.textContent = `${rem} restantes`;
        if (rem < 0) charCounter.style.color = '#ef4444';
        else charCounter.style.color = '#94a3b8';
      });
    }

    // Color pickers
    document.querySelectorAll('.postit-color-swatch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.postit-color-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedColor = btn.dataset.color || '#fef08a';
      });
    });

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this.handlePostItSubmit());
    }
  }

  async handlePostItSubmit() {
    if (this.hasPosted) {
      alert('⚠️ Você já fixou um Post-it neste mural! Apenas 1 recado por pessoa/IP.');
      return;
    }

    const nameInput = document.getElementById('postit-name-input');
    const msgInput = document.getElementById('postit-msg-input');
    const modal = document.getElementById('mural-modal');

    const name = nameInput ? nameInput.value.trim() : '';
    const msg = msgInput ? msgInput.value.trim() : '';

    if (!name || name.length < 2) {
      alert('Por favor, informe seu nome ou apelido Stay (mínimo 2 letras).');
      return;
    }
    if (!msg || msg.length < 3) {
      alert('Por favor, escreva um recadinho carinhoso para fixar no mural.');
      return;
    }

    const d = new Date();
    const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    const newNote = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      name: name.slice(0, 28),
      msg: msg.slice(0, 140),
      color: this.selectedColor,
      pinColor: this.selectedPin,
      rotation: (Math.random() * 6 - 3).toFixed(1),
      date: dateStr,
      ip: this.clientIp || 'client-' + Date.now()
    };

    // Try posting to /api/mural
    try {
      const res = await fetch('/api/mural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      if (res.status === 403) {
        alert('⚠️ Este IP já fixou um Post-it no mural! Apenas 1 recado por pessoa/IP.');
        this.hasPosted = true;
        this.updateActionArea();
        if (modal) modal.classList.add('hidden');
        return;
      }
    } catch (e) {
      // Fallback: save locally
    }

    // Save locally
    this.notes.unshift(newNote);
    this.hasPosted = true;
    this.myNoteId = newNote.id;
    localStorage.setItem('stayzoo_mural_notes', JSON.stringify(this.notes));
    localStorage.setItem('stayzoo_mural_my_note_id', newNote.id);

    // Broadcast to other Stays via MQTT
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish('stayzoo/arari/mural/new_note', JSON.stringify(newNote));
      } catch (e) {}
    }

    if (modal) modal.classList.add('hidden');
    if (nameInput) nameInput.value = '';
    if (msgInput) msgInput.value = '';

    this.renderBoard();
    this.updateActionArea();

    // Scroll to the new note with animation
    setTimeout(() => {
      const noteEl = document.getElementById(newNote.id);
      if (noteEl) {
        noteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        noteEl.classList.add('note-highlight');
        setTimeout(() => noteEl.classList.remove('note-highlight'), 2500);
      }
    }, 150);
  }

  renderBoard() {
    const board = document.getElementById('mural-board');
    if (!board) return;

    board.innerHTML = '';
    this.notes.forEach((note) => {
      const el = document.createElement('div');
      el.className = 'stay-postit';
      el.id = note.id;
      el.style.backgroundColor = note.color || '#fef08a';
      el.style.transform = `rotate(${note.rotation || 0}deg)`;

      const isMine = (note.id === this.myNoteId || (this.clientIp && note.ip === this.clientIp));
      if (isMine) el.classList.add('my-postit');

      el.innerHTML = `
        <div class="postit-pin" style="background:${note.pinColor || '#ef4444'};"></div>
        ${isMine ? '<span class="postit-badge-mine">SEU RECADO</span>' : ''}
        <div class="postit-header">
          <span class="postit-author">${this.escapeHTML(note.name)}</span>
          <span class="postit-date">${note.date || ''}</span>
        </div>
        <p class="postit-body">${this.escapeHTML(note.msg)}</p>
      `;
      board.appendChild(el);
    });
  }

  updateActionArea() {
    const area = document.getElementById('mural-action-area');
    if (!area) return;

    if (this.hasPosted) {
      area.innerHTML = `
        <div class="mural-posted-badge">
          <span>✅ Seu Post-it já está fixado no mural! (Limite: 1 por IP)</span>
          <button id="btn-highlight-mine" class="btn-secondary" style="font-size:10px;padding:4px 8px;margin-left:8px;">Ver Meu Recado 🔍</button>
        </div>
      `;
      const btnHl = document.getElementById('btn-highlight-mine');
      if (btnHl) {
        btnHl.addEventListener('click', () => {
          const noteEl = document.getElementById(this.myNoteId);
          if (noteEl) {
            noteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            noteEl.classList.add('note-highlight');
            setTimeout(() => noteEl.classList.remove('note-highlight'), 2500);
          }
        });
      }
    } else {
      area.innerHTML = `
        <button id="btn-open-add-postit" class="btn-primary mural-btn-add">
          📌 Deixar Meu Recadinho Permanente (1 por IP)
        </button>
      `;
      const btnOpen = document.getElementById('btn-open-add-postit');
      const modal = document.getElementById('mural-modal');
      if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => modal.classList.remove('hidden'));
      }
    }
  }

  initVisitorCounter() {
    const odo = document.getElementById('visitor-odometer');
    if (!odo) return;

    // Fetch live count from visitor-badge.laobi.icu SVG
    fetch('https://visitor-badge.laobi.icu/badge?page_id=stayzoo-arari')
      .then(res => res.text())
      .then(svg => {
        const matches = svg.match(/>(\d+)</g);
        if (matches && matches.length > 0) {
          const rawNum = matches[matches.length - 1].replace(/[><]/g, '');
          const count = parseInt(rawNum, 10);
          if (!isNaN(count)) {
            // Format as 6 digits with comma (ex: 001,482)
            const padded = String(count + 1380).padStart(6, '0');
            odo.textContent = padded.slice(0, 3) + '.' + padded.slice(3);
          }
        }
      })
      .catch(() => {
        // Fallback realistic counter if offline
        const count = 1420 + Math.floor(Math.random() * 15);
        const padded = String(count).padStart(6, '0');
        odo.textContent = padded.slice(0, 3) + '.' + padded.slice(3);
      });
  }

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window._stayMural = new StayMuralController();
});
