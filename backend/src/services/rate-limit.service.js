import { getSupabaseAdmin } from "../db/supabase.js";

export async function canRequestOtp(whatsapp, minutes = 1) {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("otp_requests")
    .select("id")
    .eq("whatsapp_number", whatsapp)
    .gt("created_at", since)
    .limit(1);

  return !data || data.length === 0;
}

