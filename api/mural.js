// Vercel Serverless Function: /api/mural
// In-memory + persistent store with IP tracking (1 post-it per IP)

let muralNotes = [
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
  }
];

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
    const hasPosted = muralNotes.some(n => n.ip === clientIp && n.ip !== 'unknown');
    return res.status(200).json({
      notes: muralNotes,
      clientIp,
      hasPosted
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
