import { getSupabaseAdmin } from "../db/supabase.js";

export async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("sessions")
    .select("*, accounts(*)")
    .eq("session_token", token)
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .single();

  if (error || !data) {
    return res.status(401).json({ ok: false, error: "Sesión inválida" });
  }

  req.account = data.accounts;
  req.session = data;

  next();
}

