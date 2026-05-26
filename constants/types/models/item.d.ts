import {
  BaseImage,
  MoneyMinorOrPercentScaledField,
  DefaultFields,
  Iso8601DateTimeFormat,
} from "../utilTypes";
import { Branch } from "./store";
import { Variant } from "./variant";

// Interface for StoreBranchItem
export interface StoreBranchItem extends DefaultFields {
  variant: Variant; // ForeignKey reference to Variant
  branch: Branch; // ForeignKey reference to Branch
  quantity: number; // IntegerField for quantity
  sku: string; // CharField for SKU (unique identifier)
  barcode?: string | null; // Optional CharField for barcode
  reorder_level: number; // IntegerField for reorder level
  cost_price?: MoneyMinorOrPercentScaledField; // Optional for cost price
  selling_price: MoneyMinorOrPercentScaledField; // for selling price
  original_price: MoneyMinorOrPercentScaledField; // for original price
  discount_percentage: MoneyMinorOrPercentScaledField; // for discount percentage
  expiration_date?: Iso8601DateTimeFormat | null; // Optional DateField for expiration date

  images?: StoreBranchItemImage[]; // Array of URLs to the images, nullable and optional
}

// Interface for StoreBranchItemImage
export interface StoreBranchItemImage extends BaseImage {
  item?: StoreBranchItem; // ForeignKey reference to StoreBranchItem
}
