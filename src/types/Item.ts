export interface Item {
  id: number;
  item_title: string;
  item_description: string;
  priority_number: number;
  realization_date: string;
  item_completed: boolean;
  box_related: number;
  subarea_box: number;
  completed_date?: string;
}
