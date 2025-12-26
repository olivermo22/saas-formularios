import { getSupabaseAdmin } from "../db/supabase.js";
import { generateOTP, getOTPExpiry } from "../lib/otp.js";

export async function createOtpForWhatsapp(whatsapp) {
  const supabase = getSupabaseAdmin();
  const otp = generateOTP();

  const { error } = await supabase
    .from("otp_requests")
    .insert({
      whatsapp_number: whatsapp,
      otp_code: otp,
      expires_at: getOTPExpiry(5)
    });

  if (error) throw error;

  return otp;
}

export async function verifyOtp(whatsapp, otp) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("otp_requests")
    .select("*")
    .eq("whatsapp_number", whatsapp)
    .eq("otp_code", otp)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return false;

  await supabase
    .from("otp_requests")
    .update({ used: true })
    .eq("id", data.id);

  return true;
}

