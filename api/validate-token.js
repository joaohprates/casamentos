import { validateToken } from "../googleSheets.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    return res.status(200).json({ familia: result.familia, adultos: result.adultos });
  } catch (err) {
    console.error("Validate token error:", err);
    return res.status(500).json({ error: "Erro ao validar convite" });
  }
}
