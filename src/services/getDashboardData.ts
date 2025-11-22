import { supabase } from "../lib/supabaseClient";

export async function getDashboardData(userId: string) {

  const { data: boxes, error: boxesError } = await supabase
    .from("BOX")
    .select("id, box_area")
    .eq("user_id", userId);

  if (boxesError) throw boxesError;

  const { data: areas } = await supabase
    .from("AREA")
    .select("id, area_name");

  const areaMap = areas?.reduce((acc, a) => {
    acc[a.id] = a.area_name;
    return acc;
  }, {} as Record<string, string>) || {};

  const areasCount: Record<string, number> = {};
  boxes.forEach(b => {
    const areaName = areaMap[b.box_area] ?? "Sem área";
    areasCount[areaName] = (areasCount[areaName] || 0) + 1;
  });

  const { data: items, error: itemsError } = await supabase
    .from("ITEM")
    .select("id, box_related, item_completed")
    .eq("user_id", userId);

  if (itemsError) throw itemsError;

  const totalBoxes = boxes.length;
  const totalItems = items.length;
  const completedItems = items.filter(i => i.item_completed).length;
  const overallProgress = totalItems > 0 ? completedItems / totalItems : 0;

  const progressPerBox = boxes.map(box => {
    const itemsInBox = items.filter(i => i.box_related === box.id);
    const completed = itemsInBox.filter(i => i.item_completed).length;
    return itemsInBox.length > 0 ? completed / itemsInBox.length : 0;
  });

  const averageProgress =
    progressPerBox.length > 0
      ? progressPerBox.reduce((acc, v) => acc + v, 0) / progressPerBox.length
      : 0;

  const topAreas = Object.entries(areasCount)
    .map(([name, count]) => ({
      name,
      percent: count / totalBoxes,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  return {
    totalBoxes,
    totalItems,
    completedItems,
    overallProgress,
    averageProgress,
    topAreas,
  };
}
