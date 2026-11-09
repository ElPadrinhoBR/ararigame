// Vercel Serverless Function: /api/mural
// Persistent file storage + IP tracking + Visitor Counter
import fs from 'fs';
import os from 'os';
import path from 'path';

const TMP_COUNTER_FILE = path.join(os.tmpdir(), 'stayzoo_visits.txt');
const TMP_NOTES_FILE = path.join(os.tmpdir(), 'stayzoo_mural_notes.json');

const DEFAULT_NOTES = [
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

// Helper: Read Notes from Persistent File
function getStoredNotes() {
  try {
    if (fs.existsSync(TMP_NOTES_FILE)) {
      const content = fs.readFileSync(TMP_NOTES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (!parsed.some(n => n.id === 'note-arari-official')) {
          parsed.unshift(DEFAULT_NOTES[0]);
        }
        return parsed;
      }
    }
  } catch (err) {}
  return [...DEFAULT_NOTES];
}

// Helper: Save Notes to Persistent File
function saveStoredNotes(notes) {
  try {
    fs.writeFileSync(TMP_NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
  } catch (err) {}
}

// Track visited IPs in this execution
const visitedIps = new Set();

// Helper: Get & Increment Real Visitor Count
async function getLiveVisitorCount(clientIp) {
  let count = 10;
  try {
    if (fs.existsSync(TMP_COUNTER_FILE)) {
      const saved = parseInt(fs.readFileSync(TMP_COUNTER_FILE, 'utf-8'), 10);
      if (!isNaN(saved) && saved >= 1) count = saved;
    }
  } catch (err) {}

  // Check hits.sh to stay in sync with domain hits
  try {
    const res = await fetch('https://hits.sh/stayzoo-arari.vercel.app.svg', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const text = await res.text();
      const matches = text.match(/>(\d+)</g);
      if (matches && matches.length > 0) {
        const raw = matches[matches.length - 1].replace(/[><]/g, '');
        const n = parseInt(raw, 10);
        if (!isNaN(n) && n > count) count = n;
      }
    }
  } catch (err) {}

  // Increment if new IP in this session
  if (clientIp && clientIp !== 'unknown' && !visitedIps.has(clientIp)) {
    visitedIps.add(clientIp);
    count++;
    try {
      fs.writeFileSync(TMP_COUNTER_FILE, String(count), 'utf-8');
    } catch (err) {}
  }

  return count;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get client IP
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim();

  let notes = getStoredNotes();

  if (req.method === 'GET') {
    const visitorCount = await getLiveVisitorCount(clientIp);
    const hasPosted = notes.some(n => n.ip === clientIp && n.ip !== 'unknown');
    return res.status(200).json({
      notes,
      clientIp,
      hasPosted,
      visitorCount
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, msg, color, pinColor } = body || {};

      if (!name || !msg) {
        return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
      }

      const cleanName = String(name).trim().slice(0, 28);
      const cleanMsg = String(msg).trim().slice(0, 160);
      const validColors = ['#fef08a', '#fbcfe8', '#bbf7d0', '#ddd6fe', '#fed7aa', '#bae6fd'];
      const chosenColor = validColors.includes(color) ? color : '#fef08a';
      const pinColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      const chosenPin = pinColors.includes(pinColor) ? pinColor : '#ef4444';

      const d = new Date();
      const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

      // If user with same IP already posted, update their note instead of blocking
      let existingIdx = -1;
      if (clientIp !== 'unknown') {
        existingIdx = notes.findIndex(n => n.ip === clientIp && n.id !== 'note-arari-official');
      }

      const newNote = {
        id: existingIdx >= 0 ? notes[existingIdx].id : 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        name: cleanName,
        msg: cleanMsg,
        color: chosenColor,
        pinColor: chosenPin,
        rotation: (Math.random() * 6 - 3).toFixed(1),
        date: dateStr,
        ip: clientIp
      };

      if (existingIdx >= 0) {
        notes[existingIdx] = newNote;
      } else {
        notes.push(newNote);
      }

      saveStoredNotes(notes);

      return res.status(201).json({
        success: true,
        note: newNote,
        notes,
        hasPosted: true
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao processar post-it.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
