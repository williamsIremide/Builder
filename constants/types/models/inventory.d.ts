import { DefaultFields } from "../utilTypes";
import { InventoryCategory } from "./category";

export interface Inventory extends DefaultFields {
  name: string; // CharField with max_length 100
  brand?: string | null; // CharField, optional and nullable
  categories: InventoryCategory[]; // ManyToManyField to InventoryCategory (required but can be empty)
}
