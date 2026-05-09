```js id="l3phmu"
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body;

    const response = await fetch(
      'https://connect.mailerlite.com/api/subscribers',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
        },

        body: JSON.stringify({
          email: body.email,

          fields: {
            name: body.name || ''
          },

          groups: ['187020663132783998']
        })
      }
    );

    const result = await response.json();

    return res.status(200).json({
      success: true,
      result
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
```
