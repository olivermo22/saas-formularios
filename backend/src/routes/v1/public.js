import { Router } from "express";
import { getPublicFormBySlug } from "../../services/public-forms.service.js";
import { saveResponse } from "../../services/responses.service.js";

export const publicRouter = Router();

/**
 * Obtener formulario público
 */
publicRouter.get("/f/:slug", async (req, res) => {
  try {
    const form = await getPublicFormBySlug(req.params.slug);
    res.json({ ok: true, form });
  } catch (e) {
    res.status(404).json({ ok: false, error: "Formulario no encontrado" });
  }
});

/**
 * Enviar respuesta pública
 */
publicRouter.post("/f/:slug", async (req, res) => {
  try {
    const result = await saveResponse(req.params.slug, req.body);
    res.json({ ok: true, response_id: result.id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ ok: false, error: "Error enviando respuesta" });
  }
});

