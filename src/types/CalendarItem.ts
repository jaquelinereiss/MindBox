export interface CalendarItem {
  id: number;
  item_title: string;
  item_description: string
  priority_number: number;
  item_completed: boolean;
  realization_date: string | null;
  BOX: {
    id: number;
    box_title: string;
  };
}
