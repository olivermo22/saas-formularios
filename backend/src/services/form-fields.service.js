import { getSupabaseAdmin } from "../db/supabase.js";

export async function addFieldToForm(formId, field) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("form_fields")
    .insert({
      form_id: formId,
      type: field.type,
      label: field.label,
      required: !!field.required,
      options: field.options || null,
      position: field.position
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

