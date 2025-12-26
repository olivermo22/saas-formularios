import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { createForm, listForms } from "../../services/forms.service.js";
import { addFieldToForm, listFields } from "../../services/form-fields.service.js";

export const formsRouter = Router();

/**
 * Crear formulario
 */
formsRouter.post("/forms", requireAuth, async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ ok: false, error: "Datos incompletos" });
  }

  try {
    const form = await createForm(req.account.id, { name, slug });
    res.json({ ok: true, form });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Error creando formulario" });
  }
});

/**
 * Listar formularios del negocio
 */
formsRouter.get("/forms", requireAuth, async (req, res) => {
  try {
    const forms = await listForms(req.account.id);
    res.json({ ok: true, forms });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Error listando formularios" });
  }
});

/**
 * Agregar campo a formulario
 */
formsRouter.post("/forms/:id/fields", requireAuth, async (req, res) => {
  const { id } = req.params;
  const field = req.body;

  try {
    const created = await addFieldToForm(id, field);
    res.json({ ok: true, field: created });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Error agregando campo" });
  }
});

/**
 * Listar campos de un formulario
 */
formsRouter.get("/forms/:id/fields", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const fields = await listFields(id);
    res.json({ ok: true, fields });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Error listando campos" });
  }
});

