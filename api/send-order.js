export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('send-order called', req.method);

    // 1) Email to Nisse Mor (you)
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

    // 2) Confirmation email to client
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [body.email],
        subject: `🎶 Your Nisse Mor order is confirmed! · ¡Tu orden está confirmada!`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;background:#0d0b0f;color:#fff;padding:32px;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-family:Georgia,serif;font-size:36px;color:#e060a0;font-style:italic;">Nisse Mor♡</div>
              <div style="color:#c8a8bc;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Personalized Songs Made With Heart</div>
            </div>
            <h2 style="color:#e060a0;text-align:center;">🎶 Order Confirmed! · ¡Orden Confirmada!</h2>
            <p style="color:#d4b8c8;">Hi ${body.name}! · ¡Hola ${body.name}!</p>
            <p style="color:#d4b8c8;">
              Thank you so much for your order! I'm so excited to create your personalized song. 
              I will contact you within 24 hours to confirm all the details.<br/><br/>
              <em style="color:#9a7a8a;">¡Muchas gracias por tu orden! Estoy muy emocionada de crear tu canción personalizada. 
              Me pondré en contacto contigo en menos de 24 horas para confirmar todos los detalles.</em>
            </p>
            <div style="background:#1a0010;border:1px solid #e060a0;border-radius:12px;padding:20px;margin:20px 0;">
              <h3 style="color:#e060a0;margin-bottom:12px;">Order Summary · Resumen de Orden</h3>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Name · Nombre:</strong> ${body.name}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Email:</strong> ${body.email}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Package · Paquete:</strong> ${body.package}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Occasion · Ocasión:</strong> ${body.occasion}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Delivery · Entrega:</strong> ${body.delivery_time}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Names in song · Nombres en la canción:</strong> ${body.names}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Voice · Voz:</strong> ${body.voice_type}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Music style · Estilo musical:</strong> ${body.music_style}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Tempo:</strong> ${body.tempo}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Language · Idioma:</strong> ${body.language}</p>
              <p style="color:#d4b8c8;margin:6px 0;"><strong style="color:#fff;">Your story · Tu historia:</strong><br/><em style="color:#9a7a8a;">${body.story}</em></p>
            </div>
            <p style="color:#d4b8c8;">
              If you have any questions, reply to this email or contact us at 
              <a href="mailto:info@nissemor.com" style="color:#e060a0;">info@nissemor.com</a><br/>
              <em style="color:#9a7a8a;">Si tienes alguna pregunta, responde este email o escríbenos a info@nissemor.com</em>
            </p>
            <div style="text-align:center;margin-top:24px;">
              <div style="color:#e060a0;font-size:22px;">♡</div>
              <div style="color:#c8a8bc;font-size:13px;font-style:italic;">With love · Con amor,<br/>Nisse Mor</div>
            </div>
          </div>
        `
      })
    });

    res.status(200).json({ ok: true });
  } catch(err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
