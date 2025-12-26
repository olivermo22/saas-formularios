import { getSupabaseAdmin } from "../db/supabase.js";
import { generateSessionToken, getSessionExpiry } from "../lib/session.js";

export async function getOrCreateAccount(whatsapp) {
  const supabase = getSupabaseAdmin();

  // 1) Buscar cuenta existente
  const { data: existing } = await supabase
    .from("accounts")
    .select("*")
    .eq("whatsapp_number", whatsapp)
    .limit(1)
    .single();

  if (existing) return existing;

  // 2) Crear cuenta nueva (plan free)
  const { data: created, error } = await supabase
    .from("accounts")
    .insert({
      whatsapp_number: whatsapp,
      plan: "free"
    })
    .select()
    .single();

  if (error) throw error;

  return created;
}

export async function createSessionForAccount(accountId) {
  const supabase = getSupabaseAdmin();
  const token = generateSessionToken();

  const { error } = await supabase
    .from("sessions")
    .insert({
      account_id: accountId,
      session_token: token,
      expires_at: getSessionExpiry(7)
    });

  if (error) throw error;

  return token;
}

