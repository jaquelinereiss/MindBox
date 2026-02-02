import { supabase } from "../../lib/supabaseClient";

export async function getOverdueItems(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("ITEM")
    .select("*")
    .eq("user_id", userId)
    .lt("realization_date", today)
    .eq("item_completed", false);

  if (error) {
    console.error("Erro ao buscar itens atrasados", error);
    return [];
  }

  return data ?? [];
}
