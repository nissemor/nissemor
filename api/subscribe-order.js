export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, fields } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: fields?.name || ""
        },
        listIds: [6],
        updateEnabled: true
      })
    });

    // 201 = created, 204 = already existed (both are OK)
    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json();

    // Contact already exists but updated = still OK
    if (data.code === "duplicate_parameter") {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: data.message || "Brevo error" });

  } catch (err) {
    console.error("Brevo error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
