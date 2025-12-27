import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { createForm, listForms } from "../../services/forms.service.js";
import {
  addFieldToForm,
  listFields,
  reorderFields,
  deleteField
} from "../../services/form-fields.service.js";

export const formsRouter = Router();

// ---------- CREATE FORM ----------
formsRouter.post("/forms", requireAuth, async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ ok: false, error: "Datos incompletos" });
  }

  try {
    const form = await createForm(req.account.id, { name, slug });
    res.json({ ok: true, form });
  } catch {
    res.status(500).json({ ok: false, error: "Error creando formulario" });
  }
});

// ---------- LIST FORMS ----------
formsRouter.get("/forms", requireAuth, async (req, res) => {
  try {
    const forms = await listForms(req.account.id);
    res.json({ ok: true, forms });
  } catch {
    res.status(500).json({ ok: false, error: "Error listando formularios" });
  }
});

// ---------- ADD FIELD ----------
formsRouter.post("/forms/:id/fields", requireAuth, async (req, res) => {
  try {
    const field = await addFieldToForm(req.params.id, req.body);
    res.json({ ok: true, field });
  } catch {
    res.status(500).json({ ok: false, error: "Error agregando campo" });
  }
});

// ---------- LIST FIELDS ----------
formsRouter.get("/forms/:id/fields", requireAuth, async (req, res) => {
  try {
    const fields = await listFields(req.params.id);
    res.json({ ok: true, fields });
  } catch {
    res.status(500).json({ ok: false, error: "Error listando campos" });
  }
});

// ---------- REORDER FIELDS ----------
formsRouter.put("/forms/:id/fields/order", requireAuth, async (req, res) => {
  try {
    await reorderFields(req.params.id, req.body.orderedFieldIds);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// ---------- DELETE FIELD ----------
formsRouter.delete("/forms/:id/fields/:fieldId", requireAuth, async (req, res) => {
  try {
    await deleteField(req.params.id, req.params.fieldId);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "Error eliminando campo" });
  }
});

