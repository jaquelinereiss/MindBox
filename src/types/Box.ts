export interface Box {
  id: number;
  box_title: string;
  box_area: number;
  box_description?: string;
  area_name?: string;
  deadline_date?: string | null; 
  items_count?: number;
}