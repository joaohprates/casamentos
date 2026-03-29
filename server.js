import "dotenv/config";
import express from "express";
import cors from "cors";
import { validateToken, saveRsvpToSheet } from "./googleSheets.js";

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
            email: "zanyprates@gmail.com",
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

app.post("/api/boleto", async (req, res) => {
  const { amount, description, cpf, firstName, lastName } = req.body;

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: parseFloat((amount / 100).toFixed(2)),
        description: description || "Presente de casamento",
        payment_method_id: "bolbradesco",
        payer: {
          email: "zanyprates@gmail.com",
          first_name: firstName || "Convidado",
          last_name: lastName || "Casamento",
          identification: {
            type: "CPF",
            number: cpf || "00000000000",
          },
          address: {
            zip_code: "87000000",
            street_name: "Maringá",
            street_number: 0,
            neighborhood: "Centro",
            city: "Maringá",
            federal_unit: "PR",
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Erro ao gerar boleto" });
    }

    res.json({
      data: {
        barCode: data.barcode?.content || "",
        pdfUrl: data.transaction_details?.external_resource_url || "",
      },
    });
  } catch (err) {
    console.error("Boleto error:", err);
    res.status(500).json({ error: "Erro ao gerar boleto" });
  }
});

app.get("/api/validate-token", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token é obrigatório" });
  }

  try {
    const result = await validateToken(token);

    if (!result.valid) {
      if (result.reason === "already_used") {
        return res.status(409).json({ error: "Este convite já foi confirmado" });
      }
      return res.status(404).json({ error: "Convite não encontrado" });
    }

    res.json({ familia: result.familia, adultos: result.adultos });
  } catch (err) {
    console.error("Validate token error:", err);
    res.status(500).json({ error: "Erro ao validar convite" });
  }
});

app.post("/api/rsvp", async (req, res) => {
  const { token, name, email, criancas } = req.body;

  if (!token || !name || !email) {
    return res.status(400).json({ error: "Token, nome e e-mail são obrigatórios" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "E-mail inválido" });
  }

  try {
    const tokenResult = await validateToken(token);

    if (!tokenResult.valid) {
      if (tokenResult.reason === "already_used") {
        return res.status(409).json({ error: "Este convite já foi confirmado" });
      }
      return res.status(404).json({ error: "Convite não encontrado" });
    }

    const saved = await saveRsvpToSheet({
      token,
      name,
      email,
      adultos: tokenResult.adultos,
      criancas: Math.max(0, parseInt(criancas, 10) || 0),
    });

    res.json({ success: true, saved });
  } catch (err) {
    console.error("RSVP error:", err);
    res.status(500).json({ error: "Erro ao salvar confirmação" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
