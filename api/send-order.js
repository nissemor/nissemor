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

    console.log('send-order called', req.method);
    console.log('Customer email:', body.email);

    if (!body.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer email is missing'
      });
    }

    const adminEmail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Nisse Mor <onboarding@resend.dev>',
        to: ['official.nissemor@gmail.com'],
        subject: `🎶 New Order from ${body.name || 'New Client'}!`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;background:#0d0b0f;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#e060a0;">🎶 New Nisse Mor Order!</h2>
            <p><strong>Name:</strong> ${body.name || ''}</p>
            <p><strong>Email:</strong> ${body.email || ''}</p>
            <p><strong>Package:</strong> ${body.package || ''}</p>
            <p><strong>Occasion:</strong> ${body.occasion || ''}</p>
            <p><strong>Delivery:</strong> ${body.delivery_time || ''}</p>
            <p><strong>Names:</strong> ${body.names || ''}</p>
            <p><strong>Voice:</strong> ${body.voice_type || ''}</p>
            <p><strong>Style:</strong> ${body.music_style || ''}</p>
            <p><strong>Tempo:</strong> ${body.tempo || ''}</p>
            <p><strong>Language:</strong> ${body.language || ''}</p>
            <p><strong>Story:</strong> ${body.story || ''}</p>
          </div>
        `
      })
    });

    const adminResult = await adminEmail.json();
    console.log('Admin email result:', adminResult);

    if (!adminEmail.ok) {
      return res.status(500).json({
        success: false,
        error: 'Admin email failed',
        details: adminResult
      });
    }

    const customerEmail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Nisse Mor <onboarding@resend.dev>',
        to: [body.email],
        subject: `🎶 Thank you for your order, ${body.name || ''}!`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0b0f;color:#fff;padding:40px 32px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-family:Georgia,serif;color:#e060a0;font-size:2rem;margin:0;">Nisse Mor 🎶</h1>
              <p style="color:#f4a0cc;font-style:italic;margin:6px 0 0;">Personalized Songs · Canciones Personalizadas</p>
            </div>

            <h2 style="color:#fff;font-size:1.3rem;">Thank you for your purchase, ${body.name || 'beautiful soul'}! 💖</h2>
            <p style="color:#c8a8bc;font-style:italic;">¡Gracias por tu compra!</p>

            <p style="color:#c8a8bc;line-height:1.7;">
              I am so honored to create something truly special for you. Every song is crafted with love, intention, and care.
            </p>

            <div style="background:#1e0a28;border:1px solid rgba(224,96,160,.3);border-radius:12px;padding:24px;margin:24px 0;">
              <h3 style="color:#e060a0;margin-top:0;">📋 Your Order Details</h3>
              <p><strong>Package:</strong> ${body.package || ''}</p>
              <p><strong>Occasion:</strong> ${body.occasion || ''}</p>
              <p><strong>Delivery:</strong> ${body.delivery_time || ''}</p>
              <p><strong>Names:</strong> ${body.names || ''}</p>
              <p><strong>Voice:</strong> ${body.voice_type || ''}</p>
              <p><strong>Style:</strong> ${body.music_style || ''}</p>
              <p><strong>Tempo:</strong> ${body.tempo || ''}</p>
              <p><strong>Language:</strong> ${body.language || ''}</p>
            </div>

            <p style="color:#c8a8bc;line-height:1.7;">
              I will start working on your song and will be in touch soon. 💕
            </p>

            <p style="color:#c8a8bc;">
              Questions? <a href="mailto:official.nissemor@gmail.com" style="color:#e060a0;">official.nissemor@gmail.com</a>
            </p>

            <div style="text-align:center;margin-top:32px;border-top:1px solid rgba(224,96,160,.2);padding-top:24px;">
              <p style="color:#e060a0;font-family:Georgia,serif;font-size:1.1rem;margin:0;">With love,</p>
              <p style="color:#fff;font-family:Georgia,serif;font-size:1.2rem;margin:4px 0;">Denisse · Nisse Mor 🎶</p>
            </div>
          </div>
        `
      })
    });

    const customerResult = await customerEmail.json();
    console.log('Customer email result:', customerResult);

    if (!customerEmail.ok) {
      return res.status(500).json({
        success: false,
        error: 'Customer email failed',
        details: customerResult
      });
    }

    return res.status(200).json({
      success: true,
      adminResult,
      customerResult
    });

  } catch (err) {
    console.log('Error:', err.message);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
