import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

app.post("/api/pix", async (req, res) => {
  const { amount, description } = req.body;

  try {
    const response = await fetch(
      "https://api.mercadopago.com/v1/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          type: "online",
          total_amount: (amount / 100).toFixed(2),
          external_reference: "gift-" + Date.now(),
          processing_mode: "automatic",
          transactions: {
            payments: [
              {
                amount: (amount / 100).toFixed(2),
                payment_method: {
                  id: "pix",
                  type: "bank_transfer",
                },
                expiration_time: "PT1H",
              },
            ],
          },
          payer: {
            email: "convidado@casamento.com",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const payment = data.transactions.payments[0];
    res.json({
      data: {
        brCode: payment.payment_method.qr_code,
        brCodeBase64: `data:image/png;base64,${payment.payment_method.qr_code_base64}`,
      },
    });
  } catch (err) {
    console.error("MercadoPago error:", err);
    res.status(500).json({ error: "Erro ao gerar cobrança Pix" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
