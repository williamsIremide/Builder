import { DefaultFields } from "../utilTypes";
import { StoreBranchItem } from "./item";
import { Branch } from "./store";
// Assuming you have a Variant model for the variants

export interface BaseCategory extends DefaultFields {
  name: string; // CharField with max_length 100, unique
}

export interface VariantCategory extends BaseCategory {
  name: string; // CharField with max_length 100, non-nullable
  unit?: string | null; // Optional unit field for variant (e.g., kg, pcs, etc.)
}

// ExpenseCategory no longer has created_by, as it's not in the Django model
export interface ExpenseCategory extends BaseCategory {
  display_cover?: string | null; // Optional image field for cover
}

// InventoryCategory with MPTT-specific fields (lft, rght, tree_id)
export interface InventoryCategory extends BaseCategory {
  level: number; // Integer field indicating the level of the category
  parent?: InventoryCategory | null; // Nullable foreign key to self (parent category)
  display_cover?: string | null; // Optional image field for cover
  lft: number; // Left value in MPTT tree
  rght: number; // Right value in MPTT tree
  tree_id: number; // Tree identifier for MPTT
}

// Collection, which groups variants into a custom collection
export interface Collection extends BaseCategory {
  name: string; // max length 100
  items: StoreBranchItem[]; // Many-to-many relationship with StoreBranchItem
  branch: Branch; // ForeignKey to RetailStore
  display_cover?: string | null; // Optional image field for collection cover
}
