import {
  MoneyMinorOrPercentScaledField,
  DefaultFields,
  Iso8601DateTimeFormat,
  PaymentMethod,
  PaymentStatus,
  SalesChannels,
} from "../utilTypes";
import { Customer, Supplier } from "./entity";
import { Branch } from "./store";
import { StoreBranchItem } from "./item";
import { UUID } from "crypto"; // or uuid library
import { StoreBranchExpense } from "./expense";

// Base interface for items involved in transactions (Sale and Purchase)
export interface ItemBase extends DefaultFields {
  item: StoreBranchItem; // ForeignKey to StoreBranchItem
  quantity: number; // IntegerField for quantity
  price: MoneyMinorOrPercentScaledField; // for price (stored as a float or number in JS)
}

// Interface for a Transaction (abstract base)
export interface Transaction extends DefaultFields {
  transaction_id: UUID; // UUIDField for transaction ID
  branch: Branch; // ForeignKey to Branch
  total_price: MoneyMinorOrPercentScaledField; // for total price
  payment_method: PaymentMethod; // CharField for payment method (use enum or string type)
  status: PaymentStatus; // The status of the transaction (fulfilled, pending, cancelled, etc.)
  sale_channel: SalesChannels;
  employee?: StoreBranchEmployee | null; // The employee who initiated the transaction (optional)

  items: ItemBase[];
}

// Interface for a Sale
export interface Sale extends Transaction {
  customer?: Customer | null; // ForeignKey to Customer, optional and nullable
  sale_time: Iso8601DateTimeFormat; // DateTimeField for the time of sale

  amount_received: MoneyMinorOrPercentScaledField; // The amount received from the customer (optional)
  total_discount_value?: MoneyMinorOrPercentScaledField | null; // Total value of discounts applied (optional)
  applied_discounts?: StoreBranchDiscount[] | null; // List of applied discounts (optional)
  applied_taxes?: StoreBranchTax[] | null; // List of applied taxes (optional)
  total_tax_value?: MoneyMinorOrPercentScaledField | null; // Total value of taxes applied (optional)

  gift_cards_used?: {
    gift_card: GiftCard;
    amount_used: MoneyMinorOrPercentScaledField;
  }[]; // Array of gift cards used
}

// Interface for SaleItem
export interface SaleItem extends ItemBase {
  sale: Sale; // ForeignKey to Sale
}

// Interface for a Purchase
export interface Purchase extends Transaction {
  supplier?: Supplier | null; // ForeignKey to Supplier, optional and nullable
  amount_paid: MoneyMinorOrPercentScaledField; // The amount paid to the supplier (optional)
  purchase_time: Iso8601DateTimeFormat; // DateTimeField for the time of purchase
}

// Interface for PurchaseItem
export interface PurchaseItem extends ItemBase {
  purchase: Purchase; // ForeignKey to Purchase
}

// Interface for ExpenseSettlement
export interface ExpenseSettlement extends DefaultFields {
  expense: StoreBranchExpense; // ForeignKey to StoreBranchExpense
  actual_amount: MoneyMinorOrPercentScaledField; // The actual amount paid or settled for the expense
  settlement_date: Iso8601DateTimeFormat; // The date when the expense was settled
  payment_method: PaymentMethod; // The payment method used to settle the expense
  status: PaymentStatus; // The status of the settlement (paid, pending, etc.)
}
