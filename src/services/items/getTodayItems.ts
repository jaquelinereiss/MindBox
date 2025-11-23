import { supabase } from "../../lib/supabaseClient";

interface ItemRow {
  id: number;
  item_title: string;
  realization_date: string;
  item_completed: boolean;
  BOX: {
    id: number;
    box_title: string;
  } | null;
}

export async function getTodayItems(userId: string) {
  try {
    const now = new Date();

    const startLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const offsetMs = now.getTimezoneOffset() * 60 * 1000 * -1; // Brasil = UTC-3
    const startUTC = new Date(startLocal.getTime() + offsetMs).toISOString();
    const endUTC = new Date(endLocal.getTime() + offsetMs).toISOString();

    const { data, error } = await supabase
      .from("ITEM")
      .select(`
        id,
        item_title,
        realization_date,
        item_completed,
        BOX:box_related (
          id,
          box_title
        )
      `)
      .eq("user_id", userId)
      .eq("item_completed", false)
      .gte("realization_date", startUTC)
      .lte("realization_date", endUTC)
      .returns<ItemRow[]>();

    if (error) throw error;

    console.log("Itens de hoje:", data);

    return data.map((item) => ({
      title: item.item_title,
      subtitle: item.BOX?.box_title ?? "não encontrado",
    }));

  } catch (err) {
    console.error("Erro ao buscar itens do dia:", err);
    return [];
  }
}
