import { getSupabaseAdmin } from "../db/supabase.js";

export async function listResponses(accountId, formId) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("responses")
    .select(`
      id,
      created_at,
      response_answers (
        value,
        form_fields (
          label
        )
      )
    `)
    .eq("account_id", accountId)
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

