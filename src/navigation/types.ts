import { Box } from "../types/Box";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Add: undefined;
  Dashboard: undefined;
  Boxes: undefined;
  BoxDetailScreen: { box: Box };
  Settings: undefined;
  Calendar: undefined;
};
