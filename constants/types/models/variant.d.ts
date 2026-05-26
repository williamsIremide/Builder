import { MoneyMinorOrPercentScaledField, DefaultFields } from "../utilTypes";
import { VariantCategory } from "./category";
import { Inventory } from "./inventory";

// Variant interface
export interface Variant extends DefaultFields {
  name: string; // CharField with max_length 50
  categories: VariantCategory[]; // ManyToManyField to VariantCategory
  collections?: Collection[]; // ManyToManyField to Collection, optional
  inventory: Inventory; // ForeignKey to Inventory
  average_cost_price?: MoneyMinorOrPercentScaledField | null; //, nullable, optional
  average_selling_price?: MoneyMinorOrPercentScaledField | null; //, nullable, optional
  sku?: string | null; // CharField with max_length 50, unique, nullable, optional
  upc?: string | null; // CharField with max_length 12, unique, nullable, optional
  images?: string[]; // Array of URLs to the images, nullable and optional

  standard_pack_qty?: number;
  standard_pack_price?: MoneyMinorOrPercentScaledField;
}

// VariantImage interface
export interface VariantImage extends BaseImage {
  variant: Variant; // ForeignKey to Variant
}
