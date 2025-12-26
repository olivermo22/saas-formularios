import { getSupabaseAdmin } from "../db/supabase.js";
import { sendWhatsappOTP } from "./whatsapp.service.js";
import { sendWhatsappNotification } from "./whatsapp.service.js";

export async function saveResponse(slug, payload) {
  const supabase = getSupabaseAdmin();

  // 1️⃣ Obtener formulario
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*, form_fields(*)")
    .eq("slug", slug)
    .single();

  if (formError || !form) {
    throw new Error("Form not found");
  }

  // 2️⃣ LÍMITE FREE (50 respuestas / mes)
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("account_id", form.account_id)
    .gte("created_at", monthStart.toISOString());

  if (count >= 100) {
    throw new Error("Límite mensual alcanzado");
  }

  // 3️⃣ Crear response
  const { data: response, error: responseError } = await supabase
    .from("responses")
    .insert({
      form_id: form.id,
      account_id: form.account_id
    })
    .select()
    .single();

  if (responseError) {
    throw responseError;
  }

  // 4️⃣ Guardar respuestas
  for (const field of form.form_fields) {
    const value = payload[field.id] ?? null;

    await supabase
      .from("response_answers")
      .insert({
        response_id: response.id,
        field_id: field.id,
        value: value ? String(value) : null
      });
  }

  // 5️⃣ Enviar WhatsApp (resumen simple)
  const resumen = form.form_fields
    .map(f => `• ${f.label}: ${payload[f.id] ?? "-"}`)
    .join("\n");

// Obtener número de WhatsApp del negocio
const { data: account } = await supabase
  .from("accounts")
  .select("whatsapp_number")
  .eq("id", form.account_id)
  .single();

if (account?.whatsapp_number) {
await sendWhatsappNotification(
  account.whatsapp_number,
  `📩 *Nueva respuesta recibida*\n\n📋 *Formulario:* ${form.name}\n\n${resumen}`
);
}

  return response;
}

