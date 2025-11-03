import { Box } from "../types";

export type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Boxes: undefined;
  BoxDetailScreen: { box: Box };
  Settings: undefined;
};

export interface Item {
  id: number;
  item_title: string;
  item_description?: string;
  priority_number?: number;
  realization_date?: string;
  subarea_box?: number;
  box_related?: number;
  item_completed?: boolean;
  completed_date?: string;
}