import { useEffect, useState } from "react";
import { getOverdueItems } from "../../services/items/getOverdueItems";
import { Item } from "../../types/Item";

export function useOverdueItems(userId: string | null) {
  const [overdueItems, setOverdueItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizeOverdueItem = (item: any): Item => ({
    id: item.id,
    item_title: item.item_title,
    item_description: item.item_description,
    priority_number: item.priority_number,
    item_completed: item.item_completed,
    realization_date: item.realization_date ?? undefined,
    box_related: item.box_related ?? null,
    subarea_box: item.subarea_box ?? null,
  });

  const loadOverdueItems = async () => {
    if (!userId) {
      setOverdueItems([]);
      return;
    }

    setLoading(true);
    const data = await getOverdueItems(userId);
    setOverdueItems(data.map(normalizeOverdueItem));
    setLoading(false);
  };

  useEffect(() => {
    loadOverdueItems();
  }, [userId]);

  const handleOverdueItemUpdated = (updatedItem: Item) => {
    const today = new Date().toISOString().split("T")[0];

    const isStillOverdue =
      updatedItem.realization_date &&
      updatedItem.realization_date < today &&
      !updatedItem.item_completed;

    setOverdueItems((prev) => {
      if (!isStillOverdue) {
        return prev.filter((item) => item.id !== updatedItem.id);
      }

      return prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
    });
  };

  const handleOverdueItemDeleted = (itemId: number) => {
    setOverdueItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return {
    overdueItems,
    reloadOverdueItems: loadOverdueItems,
    handleOverdueItemUpdated,
    handleOverdueItemDeleted,
    loading,
  };
}
