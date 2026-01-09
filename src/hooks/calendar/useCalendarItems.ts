import { useState, useEffect } from "react";
import getItemsByDate from "../../services/items/getItemsByDate";
import { Item } from "../../types/Item";
import { CalendarItem } from "../../types/CalendarItem";

export function useCalendarItems(
  selectedDate: string | null,
  userId: string | null
) {
  const [items, setItems] = useState<CalendarItem[]>([]);

  const sortByPriority = (list: CalendarItem[]) => {
    const pending = list
      .filter((i) => !i.item_completed)
      .sort((a, b) => (a.priority_number ?? 0) - (b.priority_number ?? 0));

    const completed = list
      .filter((i) => i.item_completed)
      .sort(
        (a, b) =>
          new Date(b.realization_date ?? 0).getTime() -
          new Date(a.realization_date ?? 0).getTime()
      );

    return [...pending, ...completed];
  };

  const loadItems = async () => {
    if (!selectedDate || !userId) {
      setItems([]);
      return;
    }

    const data = await getItemsByDate(selectedDate, userId);
    setItems(sortByPriority(data));
  };

  useEffect(() => {
    loadItems();
  }, [selectedDate, userId]);

  const handleItemUpdated = (updatedItem: Item) => {
    setItems((prev) =>
      sortByPriority(
        prev.map((item) =>
          item.id === updatedItem.id
            ? { ...item, ...updatedItem, BOX: item.BOX }
            : item
        )
      )
    );
  };

  const handleItemDeleted = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const normalizeItem = (item: CalendarItem): Item => ({
    id: item.id,
    item_title: item.item_title,
    item_description: item.item_description,
    priority_number: item.priority_number,
    item_completed: item.item_completed,
    realization_date: item.realization_date ?? undefined,
    box_related: item.BOX.id,
    subarea_box: item.subarea_box,
  });

  return {
    items,
    reloadItems: loadItems,
    handleItemUpdated,
    handleItemDeleted,
    normalizeItem,
  };
}