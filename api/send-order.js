export default async function handler(req, res) {
  console.log('send-order called', req.method);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['official.nissemor@gmail.com'],
        subject: `🎶 New Order from ${body.name}!`,
        html: `
          <div style="font-family:Arial,sans-serif; max-width:600px; background:#0d0b0f; color:#fff; padding:32px; border-radius:12px;">
            <h2 style="color:#e060a0;">🎶 New Nisse Mor Order!</h2>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Package:</strong> ${body.package}</p>
            <p><strong>Occasion:</strong> ${body.occasion}</p>
            <p><strong>Delivery:</strong> ${body.delivery_time}</p>
            <p><strong>Names:</strong> ${body.names}</p>
            <p><strong>Voice:</strong> ${body.voice_type}</p>
            <p><strong>Style:</strong> ${body.music_style}</p>
            <p><strong>Tempo:</strong> ${body.tempo}</p>
            <p><strong>Language:</strong> ${body.language}</p>
            <p><strong>Story:</strong> ${body.story}</p>
          </div>
        `
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
