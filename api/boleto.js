export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, description, cpf, firstName, lastName } = req.body;

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
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
}
