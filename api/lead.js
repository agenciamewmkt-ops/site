const SERVICES = new Set([
  "Marketing e gestão de redes sociais",
  "Branding e identidade visual",
  "Desenvolvimento de website",
  "Design e comunicação",
  "Mais de uma solução",
  "Ainda não sei, preciso de orientação"
]);

function valid(value, max) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Método não permitido." });
  }

  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return res.status(403).json({ ok: false, message: "Origem não autorizada." });
      }
    } catch {
      return res.status(403).json({ ok: false, message: "Origem inválida." });
    }
  }

  if (Number(req.headers["content-length"] || 0) > 6000) {
    return res.status(413).json({ ok: false, message: "Solicitação muito grande." });
  }

  const data = req.body || {};
  // Campo invisível: envios de bots não chegam à planilha.
  if (data.website) return res.status(200).json({ ok: true });

  const whatsapp = String(data.whatsapp || "").replace(/\D/g, "");
  if (!valid(data.nome, 100) || !valid(data.empresa, 120) ||
      whatsapp.length < 10 || whatsapp.length > 13 ||
      !SERVICES.has(data.servico) || data.consent !== true ||
      typeof data.investimento !== "string" || data.investimento.length > 100) {
    return res.status(400).json({ ok: false, message: "Confira os campos obrigatórios." });
  }

  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.MEW_SHEETS_SECRET;
  if (!endpoint || !secret) {
    return res.status(503).json({ ok: false, message: "Formulário temporariamente indisponível." });
  }
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
    return res.status(503).json({ ok: false, message: "Configuração do formulário incompleta." });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret,
        nome: data.nome.trim(),
        empresa: data.empresa.trim(),
        whatsapp,
        servico: data.servico,
        investimento: data.investimento,
        consent: true,
        policyVersion: "2026-11",
        source: data.source === "consulta" ? "consulta" : "homepage",
        receivedAt: new Date().toISOString()
      }),
      redirect: "follow",
      signal: controller.signal
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true) throw new Error("Sem confirmação da planilha");
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Erro ao registrar lead:", error.message);
    return res.status(502).json({ ok: false, message: "Não foi possível enviar agora. Tente novamente." });
  } finally {
    clearTimeout(timeout);
  }
}
