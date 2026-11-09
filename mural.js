// 📌 Stay Mural & Visitor Counter Controller
// Manages permanent post-it notes (1 per IP) and visitor counter on landing page

const DEFAULT_SEED_NOTES = [
  {
    id: 'note-arari-official',
    name: 'Arari Mascote 🦜',
    msg: 'Sejam bem-vindos ao Mural dos Stays! Deixe seu recadinho de carinho para o Stray Kids brilhar no Brasil! 🇧🇷✨',
    color: '#fef08a',
    pinColor: '#ef4444',
    rotation: -1.5,
    date: '09/11/2026',
    ip: 'arari-mascote-official'
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
        const parsed = JSON.parse(savedNotes);
        // Remove old dummy seed notes, keep only real user notes + arari note
        this.notes = parsed.filter(n => !n.id.startsWith('note-seed-'));
        if (!this.notes.some(n => n.id === 'note-arari-official')) {
          this.notes.unshift(DEFAULT_SEED_NOTES[0]);
        }
      } else {
        this.notes = [...DEFAULT_SEED_NOTES];
      }
      this.myNoteId = localStorage.getItem('stayzoo_mural_my_note_id') || '';
      if (this.myNoteId && this.myNoteId !== 'note-arari-official') {
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
          // Filter out any legacy dummy seed notes from server response
          const cleanServerNotes = data.notes.filter(n => !n.id.startsWith('note-seed-'));
          const map = new Map();
          map.set(DEFAULT_SEED_NOTES[0].id, DEFAULT_SEED_NOTES[0]);
          cleanServerNotes.forEach(n => map.set(n.id, n));
          this.notes = Array.from(map.values());
          localStorage.setItem('stayzoo_mural_notes', JSON.stringify(this.notes));
        }
        if (data.clientIp) this.clientIp = data.clientIp;
        if (data.hasPosted) this.hasPosted = true;
        if (data.visitorCount) {
          this.displayVisitorCount(data.visitorCount);
        }
      }
    } catch (e) {
      // Offline fallback
    }

    // Check if clientIp already has a note in this.notes (excluding arari note)
    if (this.clientIp) {
      const found = this.notes.find(n => n.ip === this.clientIp && n.id !== 'note-arari-official');
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
              this.notes.push(note);
              localStorage.setItem('stayzoo_mural_notes', JSON.stringify(this.notes));
              this.renderBoard();
            }
          } catch (e) {}
        }
      });
    } catch (e) {}
  }

  setupUI() {
    const form = document.getElementById('postit-inline-form');
    const nameInput = document.getElementById('postit-name-input');
    const msgInput = document.getElementById('postit-msg-input');
    const charCounter = document.getElementById('postit-char-counter');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePostItSubmit();
      });
    }

    if (msgInput && charCounter) {
      msgInput.addEventListener('input', () => {
        const rem = 140 - msgInput.value.length;
        charCounter.textContent = `${rem} restantes`;
        if (rem < 0) charCounter.style.color = '#ef4444';
        else charCounter.style.color = '#94a3b8';
      });
    }

    // Color swatches
    document.querySelectorAll('.postit-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.postit-color-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedColor = btn.dataset.color || '#fef08a';
      });
    });

    // Pin swatches
    document.querySelectorAll('.pin-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pin-color-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedPin = btn.dataset.pin || '#ef4444';
      });
    });
  }

  async handlePostItSubmit() {
    const nameInput = document.getElementById('postit-name-input');
    const msgInput = document.getElementById('postit-msg-input');
    const feedback = document.getElementById('postit-feedback');

    const name = nameInput ? nameInput.value.trim() : '';
    const msg = msgInput ? msgInput.value.trim() : '';

    if (!name || name.length < 2) {
      if (feedback) {
        feedback.textContent = '⚠️ Por favor, informe seu nome ou apelido Stay (mínimo 2 letras).';
        feedback.className = 'postit-feedback error';
      }
      return;
    }
    if (!msg || msg.length < 3) {
      if (feedback) {
        feedback.textContent = '⚠️ Por favor, escreva um recadinho carinhoso para fixar no mural.';
        feedback.className = 'postit-feedback error';
      }
      return;
    }

    if (feedback) {
      feedback.textContent = '📌 Fixando seu recadinho permanente no mural...';
      feedback.className = 'postit-feedback info';
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
      const data = await res.json();
      if (data && data.notes) {
        this.notes = data.notes;
      } else {
        const existingIdx = this.notes.findIndex(n => n.id === newNote.id || (this.clientIp && n.ip === this.clientIp));
        if (existingIdx >= 0) this.notes[existingIdx] = newNote;
        else this.notes.push(newNote);
      }
    } catch (e) {
      // Local fallback
      const existingIdx = this.notes.findIndex(n => n.id === newNote.id);
      if (existingIdx >= 0) this.notes[existingIdx] = newNote;
      else this.notes.push(newNote);
    }

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

    if (msgInput) msgInput.value = '';
    const charCounter = document.getElementById('postit-char-counter');
    if (charCounter) charCounter.textContent = '140 restantes';

    if (feedback) {
      feedback.textContent = '✨ Post-it fixado com sucesso! Sua mensagem está permanente no mural!';
      feedback.className = 'postit-feedback success';
    }

    this.renderBoard();

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
      const isOfficialArari = (note.id === 'note-arari-official');

      if (isMine) el.classList.add('my-postit');
      if (isOfficialArari) el.classList.add('arari-official-postit');

      let badgeHtml = '';
      if (isOfficialArari) {
        badgeHtml = '<span class="postit-badge-mine" style="background:#f59e0b;color:#000;">OFICIAL MASCOTE</span>';
      } else if (isMine) {
        badgeHtml = '<span class="postit-badge-mine">SEU RECADO</span>';
      }

      el.innerHTML = `
        <div class="postit-pin" style="background:${note.pinColor || '#ef4444'};"></div>
        ${badgeHtml}
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

  displayVisitorCount(count) {
    const odo = document.getElementById('visitor-odometer');
    if (!odo) return;
    const num = parseInt(count, 10);
    if (!isNaN(num) && num >= 1) {
      const padded = String(num).padStart(6, '0');
      odo.textContent = padded.slice(0, 3) + '.' + padded.slice(3);
    }
  }

  initVisitorCounter() {
    // Read secure visitorCount directly from /api/mural (no browser CORS issues)
    fetch('/api/mural')
      .then(res => res.json())
      .then(data => {
        if (data && data.visitorCount) {
          this.displayVisitorCount(data.visitorCount);
        }
      })
      .catch(() => {});
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
