export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, description } = req.body;

  try {
    const response = await fetch(
      "https://api.abacatepay.com/v1/pixQrCode/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          expiresIn: 3600,
          description,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("AbacatePay error:", err);
    res.status(500).json({ error: "Erro ao gerar cobrança Pix" });
  }
}
