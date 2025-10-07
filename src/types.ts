export interface Item {
  id: number;
  item_title: string;
  item_description: string;
  priority_number: number;
  box_related: number;
  subarea_box: number
  realization_date: string;
}

export interface Box {
  id: number;
  box_title: string;
  box_area: number;
  description?: string;
}