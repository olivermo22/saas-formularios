import { getSupabaseAdmin } from "../db/supabase.js";

export async function createForm(accountId, { name, slug }) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("forms")
    .insert({
      account_id: accountId,
      name,
      slug
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listForms(accountId) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

