import { Router } from "express";
import { env } from "../../config/env.js";
import { getSupabaseAdmin } from "../../db/supabase.js";

export const metaRouter = Router();

metaRouter.get("/meta", async (req, res) => {
  const supabase = getSupabaseAdmin();

  res.json({
    ok: true,
    app: env.APP_NAME,
    env: env.NODE_ENV,
    day: 1,
    supabase: {
      configured: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
      clientReady: Boolean(supabase)
    }
  });
});

