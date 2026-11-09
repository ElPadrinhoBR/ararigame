// Vercel Serverless Function: /api/mural
// In-memory + persistent store with IP tracking (1 post-it per IP)

let muralNotes = [
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

let cachedHitCount = 2;
let lastHitCheck = 0;

async function getLiveVisitorCount() {
  const now = Date.now();
  if (now - lastHitCheck < 15000 && cachedHitCount > 0) {
    return cachedHitCount;
  }
  try {
    const res = await fetch('https://hits.sh/stayzoo-arari.vercel.app.svg', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (res.ok) {
      const text = await res.text();
      const matches = text.match(/>(\d+)</g);
      if (matches && matches.length > 0) {
        const raw = matches[matches.length - 1].replace(/[><]/g, '');
        const n = parseInt(raw, 10);
        if (!isNaN(n) && n >= 1) {
          cachedHitCount = n;
          lastHitCheck = now;
        }
      }
    }
  } catch (err) {
    // Keep cached
  }
  return cachedHitCount;
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

  if (req.method === 'GET') {
    const visitorCount = await getLiveVisitorCount();
    const hasPosted = muralNotes.some(n => n.ip === clientIp && n.ip !== 'unknown');
    return res.status(200).json({
      notes: muralNotes,
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

      // Check if IP already posted (1 per IP rule)
      if (clientIp !== 'unknown') {
        const alreadyExists = muralNotes.some(n => n.ip === clientIp);
        if (alreadyExists) {
          return res.status(403).json({
            error: 'Este IP já possui um Post-it fixado no mural! Apenas 1 recado por pessoa/IP.',
            hasPosted: true
          });
        }
      }

      const cleanName = String(name).trim().slice(0, 28);
      const cleanMsg = String(msg).trim().slice(0, 160);
      const validColors = ['#fef08a', '#fbcfe8', '#bbf7d0', '#ddd6fe', '#fed7aa', '#bae6fd'];
      const chosenColor = validColors.includes(color) ? color : '#fef08a';
      const pinColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      const chosenPin = pinColors.includes(pinColor) ? pinColor : '#ef4444';

      const d = new Date();
      const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

      const newNote = {
        id: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        name: cleanName,
        msg: cleanMsg,
        color: chosenColor,
        pinColor: chosenPin,
        rotation: (Math.random() * 6 - 3).toFixed(1),
        date: dateStr,
        ip: clientIp
      };

      muralNotes.push(newNote);

      return res.status(201).json({
        success: true,
        note: newNote,
        notes: muralNotes,
        hasPosted: true
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao processar post-it.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
