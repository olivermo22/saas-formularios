import { getSupabaseAdmin } from "../db/supabase.js";

export async function addFieldToForm(formId, field) {
  const supabase = getSupabaseAdmin();

  // Obtener la última posición usada
  const { data: lastField } = await supabase
    .from("form_fields")
    .select("position")
    .eq("form_id", formId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = lastField ? lastField.position + 1 : 1;

  const { data, error } = await supabase
    .from("form_fields")
    .insert({
      form_id: formId,
      type: field.type,
      label: field.label,
      required: !!field.required,
      options: field.options || null,
      position: nextPosition
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listFields(formId) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("form_fields")
    .select("*")
    .eq("form_id", formId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

