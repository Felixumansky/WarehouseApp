export interface Item {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  location?: string;
  imageUri?: string;
}
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  AddEditItem: {item?: Item};
};
