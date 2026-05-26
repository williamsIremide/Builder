import {
  BillingCycle,
  DefaultFields,
  Iso8601DateTimeFormat,
  PaymentStatus,
  SubscriptionStatus,
} from "../utilTypes";
import { User } from "./user";

// Interface for SubscriptionPlan
export interface SubscriptionPlan extends DefaultFields {
  name: string; // CharField for the name of the subscription plan
  price: number; // for the price
  billing_cycle: BillingCycle; // CharField for the billing cycle (mapped to BillingCycle choices)
  features: string; // TextField for the features of the subscription plan
}

// Interface for UserSubscription
export interface UserSubscription extends DefaultFields {
  user: User; // ForeignKey reference to User
  subscription_plan: SubscriptionPlan; // ForeignKey reference to SubscriptionPlan
  start_date: Iso8601DateTimeFormat; // DateTimeField for the start date
  end_date: Iso8601DateTimeFormat; // DateTimeField for the end date
  status: SubscriptionStatus; // CharField for the status (mapped to SubscriptionStatus choices)
}

// Interface for Payment
export interface Payment extends DefaultFields {
  user_subscription: UserSubscription; // ForeignKey reference to UserSubscription
  amount: number; // for the payment amount
  payment_date: Iso8601DateTimeFormat; // DateTimeField for the payment date
  payment_method: string; // CharField for the payment method (e.g., "Stripe", "Paystack")
  payment_status: PaymentStatus; // CharField for the payment status (mapped to PaymentStatus choices)
}
