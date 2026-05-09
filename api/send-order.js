export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('send-order called', req.method);

    // Email 1: To Denisse (order notification)
    await fetch('https://api.resend.com/emails', {
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
          <div style="font-family:Arial,sans-serif;max-width:600px;background:#0d0b0f;color:#fff;padding:32px;border-radius:12px;">
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

    // Email 2: To client (confirmation)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [body.email],
        subject: `🎶 Thank you for your order, ${body.name}! / ¡Gracias por tu orden!`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0b0f;color:#fff;padding:40px 32px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-family:Georgia,serif;color:#e060a0;font-size:2rem;margin:0;">Nisse Mor 🎶</h1>
              <p style="color:#f4a0cc;font-style:italic;margin:6px 0 0;">Personalized Songs · Canciones Personalizadas</p>
            </div>
            <h2 style="color:#fff;font-size:1.3rem;">Thank you for your purchase, ${body.name}! 💖</h2>
            <p style="color:#c8a8bc;font-style:italic;">¡Gracias por tu compra, ${body.name}!</p>
            <p style="color:#c8a8bc;line-height:1.7;">I am so honored to create something truly special for you. Every song I make is crafted with love, intention, and care — just for you. 🎵</p>
            <p style="color:#c8a8bc;font-style:italic;line-height:1.7;">Me siento muy honrada de crear algo especial para ti. Cada canción está hecha con amor y cuidado — solo para ti.</p>
            <div style="background:#1e0a28;border:1px solid rgba(224,96,160,.3);border-radius:12px;padding:24px;margin:24px 0;">
              <h3 style="color:#e060a0;margin-top:0;">📋 Your Order Details · Detalles de tu Orden</h3>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">📦 Package:</strong> ${body.package}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">🎯 Occasion:</strong> ${body.occasion}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">🚚 Delivery:</strong> ${body.delivery_time}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">👤 Names:</strong> ${body.names}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">🎤 Voice:</strong> ${body.voice_type}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">🎵 Style:</strong> ${body.music_style}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">⏱ Tempo:</strong> ${body.tempo}</p>
              <p style="color:#c8a8bc;margin:8px 0;"><strong style="color:#fff;">🌐 Language:</strong> ${body.language}</p>
            </div>
            <p style="color:#c8a8bc;line-height:1.7;">I will start working on your song right away and will be in touch within <strong style="color:#fff;">24 hours</strong>. 💕</p>
            <p style="color:#c8a8bc;font-style:italic;line-height:1.7;">Comenzaré a trabajar en tu canción de inmediato y me pondré en contacto en <strong style="color:#fff;">24 horas</strong>.</p>
            <p style="color:#c8a8bc;">Questions? <a href="mailto:info@nissemor.com" style="color:#e060a0;">info@nissemor.com</a> 🎶</p>
            <div style="text-align:center;margin-top:32px;border-top:1px solid rgba(224,96,160,.2);padding-top:24px;">
              <p style="color:#e060a0;font-family:Georgia,serif;font-size:1.1rem;margin:0;">Con amor · With love,</p>
              <p style="color:#fff;font-family:Georgia,serif;font-size:1.2rem;margin:4px 0;">Denisse · Nisse Mor 🎶</p>
              <p style="color:#c8a8bc;font-size:.85rem;">info@nissemor.com · nissemor.com</p>
            </div>
          </div>
        `
      })
    });

    res.status(200).json({ success: true });
  } catch(err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
