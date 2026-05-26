import {
  MoneyMinorOrPercentScaledField,
  DefaultFields,
  Iso8601DateTimeFormat,
  ValueType,
} from "../utilTypes";
import { Branch } from "./store";

export interface BaseDiscountOrTax extends DefaultFields {
  name: string; // Corresponds to name CharField in Django
  value_type: ValueType; // Enum for value type (percentage or flat)
  average_value?: MoneyMinorOrPercentScaledField | null; // Optional for average_value
  ideal_start_datetime?: Iso8601DateTimeFormat | null; // Optional DateTimeField for ideal_start_datetime
  ideal_end_datetime?: Iso8601DateTimeFormat | null; // Optional DateTimeField for ideal_end_datetime
}

export interface Tax extends BaseDiscountOrTax {}

export interface Discount extends BaseDiscountOrTax {}

export interface StoreBranchTax extends DefaultFields {
  tax: Tax; // ForeignKey to Tax model
  value: MoneyMinorOrPercentScaledField; // Required for percentage
  branch: Branch; // ForeignKey reference to Branch

  sales_applied?: number;
}

export interface StoreBranchDiscount extends DefaultFields {
  code?: string;
  discount: Discount; // ForeignKey to Discount model
  value: MoneyMinorOrPercentScaledField; // Optional for flat amount value
  branch: Branch; // ForeignKey reference to Branch
  start_datetime: Iso8601DateTimeFormat; // Required DateTimeField for start date
  end_datetime: Iso8601DateTimeFormat; // Required DateTimeField for end date

  sales_applied?: number;
}
