import { UUID } from "crypto";
import {
  DefaultFields,
  Iso8601DateTimeFormat,
  MoneyMinorOrPercentScaledField,
  RefToInstance,
} from "../utilTypes";
import { Customer } from "./entity";
import { Branch, RetailStore } from "./store";

export interface BaseCard extends DefaultFields {
  card_number: UUID; // UUIDField, storing UUID as a string
  expiry_date?: Iso8601DateTimeFormat | null; // Optional DateTimeField for expiry date
  customer?: Customer | null; // The customer linked to the card, optional
}

export interface LoyaltyCard extends BaseCard {
  branch: Branch; // ForeignKey to Branch (the branch that issued the loyalty card)
  points: number; // IntegerField for loyalty points
  points_value: MoneyMinorOrPercentScaledField; // for the value of each loyalty point (e.g., 1 point = $1)
  points_threshold?: number | null; // IntegerField for the threshold to redeem loyalty points, optional
}

export interface GiftCard extends BaseCard {
  issued_by_branch: RefToInstance; // ForeignKey to Branch (the branch that issued the gift card)
  // branch: Branch; // ForeignKey to Branch (the branch that issued the gift card)
  customer?: Customer | null; // ForeignKey to Customer, optional
  value: MoneyMinorOrPercentScaledField; // for the total value of the gift card when issued
  balance: MoneyMinorOrPercentScaledField; // for the remaining balance on the gift card
  expiry_date: Iso8601DateTimeFormat; // DateTimeField for the expiry date of the gift card

  store?: RetailStore;
}
