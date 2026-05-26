import { DefaultFields } from "~/constants/types/utilTypes";
import { StoreBranchItem } from "~/constants/types/models/item";
import { User } from "~/constants/types/models/user";
import { RetailStore } from "./store";

export interface Cart extends DefaultFields {
  user: User; // ForeignKey to User model
  store: RetailStore;
  items: CartItem[];
}

export interface CartItem {
  id: string | number; // Primary Key
  cart: Cart; // ForeignKey reference to Cart
  item: StoreBranchItem; // ForeignKey reference to StoreBranchItem
  quantity: number; // IntegerField for quantity
}
