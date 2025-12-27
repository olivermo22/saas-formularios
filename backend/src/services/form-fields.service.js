import { getSupabaseAdmin } from "../db/supabase.js";

// ---------- ADD FIELD ----------
export async function addFieldToForm(formId, field) {
  const supabase = getSupabaseAdmin();

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

// ---------- LIST FIELDS ----------
export async function listFields(formId) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("form_fields")
    .select("*")
    .eq("form_id", formId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

// ---------- REORDER FIELDS ----------
export async function reorderFields(formId, orderedFieldIds) {
  const supabase = getSupabaseAdmin();

  if (!Array.isArray(orderedFieldIds)) {
    throw new Error("orderedFieldIds inválido");
  }

  for (let i = 0; i < orderedFieldIds.length; i++) {
    const { error } = await supabase
      .from("form_fields")
      .update({ position: i + 1 })
      .eq("id", orderedFieldIds[i])
      .eq("form_id", formId);

    if (error) throw error;
  }

  return true;
}

// ---------- DELETE FIELD ----------
export async function deleteField(formId, fieldId) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("form_fields")
    .delete()
    .eq("id", fieldId)
    .eq("form_id", formId);

  if (error) throw error;
  return true;
}

