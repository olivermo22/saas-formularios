import { getSupabaseAdmin } from "../db/supabase.js";

export async function getPublicFormBySlug(slug) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("forms")
    .select("*, form_fields(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;

  return data;
}

