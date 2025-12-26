import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { listResponses } from "../../services/responses-dashboard.service.js";
import { responsesToCSV } from "../../lib/csv.js";

export const responsesRouter = Router();

/**
 * Listar respuestas de un formulario (dashboard)
 */
responsesRouter.get("/forms/:id/responses", requireAuth, async (req, res) => {
  try {
    const responses = await listResponses(req.account.id, req.params.id);
    res.json({ ok: true, responses });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Error listando respuestas" });
  }
});

/**
 * Exportar respuestas a CSV (solo PRO)
 */
responsesRouter.get("/forms/:id/responses.csv", requireAuth, async (req, res) => {
  try {
    // Restricción por plan
    if (req.account.plan === "free") {
      return res.status(403).send("Export CSV disponible solo en PRO");
    }

    const responses = await listResponses(req.account.id, req.params.id);
    const csv = responsesToCSV(responses);

    res.header("Content-Type", "text/csv");
    res.attachment("responses.csv");
    res.send(csv);
  } catch (e) {
    res.status(500).send("Error exportando CSV");
  }
});

