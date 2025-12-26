import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const meRouter = Router();

meRouter.get("/me", requireAuth, (req, res) => {
  res.json({
    ok: true,
    account: req.account,
    branding: req.account.plan === "free"
  });
});

