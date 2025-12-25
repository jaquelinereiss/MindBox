import { supabase } from "../../lib/supabaseClient";
import { CalendarItem } from "../../types/CalendarItem";

export default async function getItemsByDate(
  date: string,
  userId: string
): Promise<CalendarItem[]> {

  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;

  const { data, error } = await supabase
    .from("ITEM")
    .select(`
      id,
      item_title,
      item_description,
      priority_number,
      item_completed,
      realization_date,
      BOX:box_related!inner (
        id,
        box_title
      )
    `)
    .gte("realization_date", startOfDay)
    .lte("realization_date", endOfDay)
    .eq("item_completed", false)
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar itens por data:", error);
    return [];
  }

  return (data ?? []).map(item => ({
    id: item.id,
    item_title: item.item_title,
    item_description: item.item_description,
    priority_number: item.priority_number,
    item_completed: item.item_completed,
    realization_date: item.realization_date,
    BOX: Array.isArray(item.BOX) ? item.BOX[0] : item.BOX
  }));
}
