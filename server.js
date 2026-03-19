import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ABACATEPAY_API_KEY;

app.post("/api/pix", async (req, res) => {
  const { amount, description } = req.body;

  try {
    const response = await fetch(
      "https://api.abacatepay.com/v1/pixQrCode/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
