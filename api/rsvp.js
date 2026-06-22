import { validateToken, saveRsvpToSheet } from "../googleSheets.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, name, phone, criancas } = req.body;

  if (!token || !name || !phone) {
    return res.status(400).json({ error: "Token, nome e celular são obrigatórios" });
  }

  const phoneDigits = String(phone).replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return res.status(400).json({ error: "Celular inválido" });
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
      phone: phoneDigits,
      adultos: tokenResult.adultos,
      criancas: Math.max(0, parseInt(criancas, 10) || 0),
    });

    return res.status(200).json({ success: true, saved });
  } catch (err) {
    console.error("RSVP error:", err);
    return res.status(500).json({ error: "Erro ao salvar confirmação" });
  }
}
