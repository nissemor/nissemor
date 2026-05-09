export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const payload = {
      email: body.email,
      fields: {
        name: body.fields?.name || "",
        package: body.fields?.package || "",
        occasion: body.fields?.occasion || "",
        delivery_time: body.fields?.delivery_time || "",
        names: body.fields?.names || "",
        voice_type: body.fields?.voice_type || "",
        music_style: body.fields?.music_style || "",
        tempo: body.fields?.tempo || "",
        language: body.fields?.language || "",
        story: body.fields?.story || ""
      },
groups: ["187015975721240041"]
    };

    console.log('Sending to MailerLite:', JSON.stringify(payload));

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log('MailerLite response:', JSON.stringify(data));
    res.status(response.status).json(data);
  } catch(err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
