export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body.email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // 1️⃣ Add subscriber to NisseMor Orders group → triggers MailerLite confirmation email to client
    const subscriberRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email: body.email,
        fields: {
          name:          body.name          || '',
          last_name:     '',
          package:       body.package       || '',
          occasion:      body.occasion      || '',
          delivery_time: body.delivery_time || '',
          names:         body.names         || '',
          voice_type:    body.voice_type    || '',
          music_style:   body.music_style   || '',
          tempo:         body.tempo         || '',
          language:      body.language      || '',
          story:         body.story         || ''
        },
        groups: ['187015975721240041'] // NisseMor Orders
      })
    });

    const subscriberResult = await subscriberRes.json();
    console.log('MailerLite subscriber result:', subscriberResult);

    if (!subscriberRes.ok) {
      return res.status(500).json({ success: false, error: 'MailerLite failed', details: subscriberResult });
    }

    // 2️⃣ Send admin notification to yourself via Formspree
    await fetch('https://formspree.io/f/xjgjrorb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `🎶 NEW ORDER from ${body.name || 'New Client'} — Nisse Mor`,
        '👤 Name':     body.name          || '—',
        '📧 Email':    body.email         || '—',
        '📦 Package':  body.package       || '—',
        '🎯 Occasion': body.occasion      || '—',
        '🚚 Delivery': body.delivery_time || '—',
        '👥 Names':    body.names         || '—',
        '🎤 Voice':    body.voice_type    || '—',
        '🎵 Style':    body.music_style   || '—',
        '⏱ Tempo':    body.tempo         || '—',
        '🌐 Language': body.language      || '—',
        '📖 Story':    body.story         || '—'
      })
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.log('Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
