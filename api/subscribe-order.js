export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body.email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email: body.email,
        fields: {
          name: body.fields?.name || body.name || ''
        },
        groups: body.groups || ['186956983193044012']
      })
    });
    const result = await response.json();
    console.log('MailerLite response:', result);
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'MailerLite failed',
        details: result
      });
    }
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.log('Subscribe error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
