export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('send-order called', req.method);

    // ── 1) Email de notificación a Nisse Mor ──
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'Nisse Mor Orders', email: 'info@nissemor.com' },
        to: [{ email: 'official.nissemor@gmail.com', name: 'Nisse Mor' }],
        subject: `🎶 New Order from ${body.name}!`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;background:#0d0b0f;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#e060a0;">🎶 New Nisse Mor Order!</h2>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Package:</strong> ${body.package}</p>
            <p><strong>Occasion:</strong> ${body.occasion}</p>
            <p><strong>Delivery:</strong> ${body.delivery_time}</p>
            <p><strong>Names in song:</strong> ${body.names}</p>
            <p><strong>Voice:</strong> ${body.voice_type}</p>
            <p><strong>Style:</strong> ${body.music_style}</p>
            <p><strong>Tempo:</strong> ${body.tempo}</p>
            <p><strong>Language:</strong> ${body.language}</p>
            <p><strong>Story:</strong><br/><em style="color:#c8a8bc;">${body.story}</em></p>
          </div>
        `
      })
    });

    // ── 2) Email de confirmación al cliente ──
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'Nisse Mor', email: 'info@nissemor.com' },
        to: [{ email: body.email, name: body.name }],
        replyTo: { email: 'info@nissemor.com', name: 'Nisse Mor' },
        subject: `🎶 Your Nisse Mor order is confirmed! · ¡Tu orden está confirmada!`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0b0f;color:#fff;padding:32px;border-radius:12px;">
            
            <!-- Header -->
            <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(224,96,160,.3);">
              <div style="font-family:Georgia,serif;font-size:38px;color:#e060a0;font-style:italic;letter-spacing:2px;">Nisse Mor♡</div>
              <div style="color:#c8a8bc;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Personalized Songs Made With Heart</div>
            </div>

            <!-- Title -->
            <h2 style="color:#e060a0;text-align:center;font-size:22px;margin-bottom:6px;">🎶 Order Confirmed!</h2>
            <p style="color:#f4a0cc;text-align:center;font-style:italic;font-size:14px;margin-top:0;">¡Tu orden está confirmada!</p>

            <!-- Greeting -->
            <p style="color:#d4b8c8;font-size:15px;line-height:1.7;margin-top:24px;">
              Hi <strong style="color:#fff;">${body.name}</strong>! Thank you so much for trusting me to create something so special for you. 
              I'm already excited to bring your story to life through music. 🎵<br/><br/>
              <em style="color:#9a7a8a;font-size:13px;">¡Hola <strong>${body.name}</strong>! Muchas gracias por confiarme algo tan especial. 
              Ya estoy emocionada de darle vida a tu historia a través de la música.</em>
            </p>
            <p style="color:#d4b8c8;font-size:15px;line-height:1.7;">
              I will contact you at <strong style="color:#e060a0;">${body.email}</strong> within <strong style="color:#fff;">24 hours</strong> to confirm all the details and get started! 💖<br/>
              <em style="color:#9a7a8a;font-size:13px;">Me pondré en contacto contigo en menos de 24 horas para confirmar los detalles y comenzar.</em>
            </p>

            <!-- Order Summary -->
            <div style="background:#1a0010;border:1px solid rgba(224,96,160,.4);border-radius:12px;padding:24px;margin:28px 0;">
              <h3 style="color:#e060a0;margin:0 0 16px;font-size:16px;letter-spacing:1px;text-transform:uppercase;">Order Summary · Resumen de Orden</h3>
              
              <table style="width:100%;border-collapse:collapse;">
                <tr style="border-bottom:1px solid rgba(224,96,160,.1);">
                  <td style="color:#c8a8bc;font-size:13px;padding:8px 0;width:40%;">📦 Package · Paquete</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;"><strong>${body.package}</strong></td>
                </tr>
                <tr style="border-bottom:1px solid rgba(224,96,160,.1);">
                  <td style="color:#c8a8bc;font-size:13px;padding:8px 0;">🎉 Occasion · Ocasión</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${body.occasion}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(224,96,160,.1);">
                  <td style="color:#c8a8bc;font-size:13px;padding:8px 0;">⏱ Delivery · Entrega</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${body.delivery_time === 'rush' ? '⚡ Rush (48hrs)' : 'Standard (5–7 days)'}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(224,96,160,.1);">
                  <td style="color:#c8a8bc;font-size:13px;padding:8px 0;">🎤 Names · Nombres</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${body.names}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(224,96,160,.1);">
                  <td style="color:#c8a8bc;font-size:13px;padding:8px 0;">🎵 Style · Estilo</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${body.music_style} · ${body.tempo} · ${body.voice_type}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(224,96,160,.1);">
                  <td style="color:#c8a8bc;font-size:13px;padding:8px 0;">🌍 Language · Idioma</td>
                  <td style="color:#fff;font-size:13px;padding:8px 0;">${body.language}</td>
                </tr>
                <tr>
                  <td style="color:#c8a8bc;font-size:13px;padding:10px 0;vertical-align:top;">💬 Your story · Tu historia</td>
                  <td style="color:#c8a8bc;font-size:12px;padding:10px 0;font-style:italic;line-height:1.6;">${body.story}</td>
                </tr>
              </table>
            </div>

            <!-- What's next -->
            <div style="background:rgba(224,96,160,.06);border-radius:10px;padding:20px;margin-bottom:24px;">
              <h4 style="color:#e060a0;margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1px;">What happens next · Qué sigue</h4>
              <p style="color:#c8a8bc;font-size:13px;margin:0 0 6px;">✦ I'll review your details and reach out within 24 hours.</p>
              <p style="color:#c8a8bc;font-size:13px;margin:0 0 6px;">✦ Your song will be created with love and care.</p>
              <p style="color:#c8a8bc;font-size:13px;margin:0;">✦ You'll receive the final song delivered to this email.</p>
              <p style="color:#9a7a8a;font-size:12px;font-style:italic;margin-top:10px;">Revisaré tus detalles y me pondré en contacto en 24 horas. Tu canción será creada con amor y enviada a este correo.</p>
            </div>

            <!-- Contact -->
            <p style="color:#c8a8bc;font-size:13px;line-height:1.7;text-align:center;">
              Questions? Reply to this email or write to<br/>
              <a href="mailto:info@nissemor.com" style="color:#e060a0;text-decoration:none;font-weight:bold;">info@nissemor.com</a><br/>
              <em style="color:#9a7a8a;font-size:12px;">¿Preguntas? Responde este correo o escríbenos a info@nissemor.com</em>
            </p>

            <!-- Footer -->
            <div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid rgba(224,96,160,.2);">
              <div style="color:#e060a0;font-size:24px;">♡</div>
              <div style="color:#c8a8bc;font-size:13px;font-style:italic;margin-top:4px;">With love · Con amor,</div>
              <div style="font-family:Georgia,serif;color:#e060a0;font-size:20px;font-style:italic;margin-top:2px;">Nisse Mor</div>
              <div style="color:#5a3a4a;font-size:11px;margin-top:12px;">© 2026 Nisse Mor · nissemor.com</div>
            </div>

          </div>
        `
      })
    });

    // ── 3) Agregar contacto a Brevo — lista de Orders ──
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: body.email,
        attributes: {
          FIRSTNAME: body.name,
          PACKAGE: body.package,
          OCCASION: body.occasion,
          DELIVERY: body.delivery_time,
          NAMES: body.names,
          VOICETYPE: body.voice_type,
          MUSICSTYLE: body.music_style,
          TEMPO: body.tempo,
          LANGUAGE: body.language,
          STORY: body.story
        },
        listIds: [Number(process.env.BREVO_ORDERS_LIST_ID || 7)],
        updateEnabled: true
      })
    });

    if (!brevoRes.ok) {
      const brevoErr = await brevoRes.json();
      console.error('Brevo error:', brevoErr);
    }

    res.status(200).json({ ok: true });

  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
