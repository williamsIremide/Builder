import { Branch } from "../models/store";
import { User } from "../models/user";

export interface PaginatedResponse<T> {
  count: number; // Total number of items
  next: string | null; // URL for the next page, or null if there are no more pages
  previous: string | null; // URL for the previous page, or null if there is no previous page
  results: T[]; // Array of items for the current page
}

export interface ServerResponse<T> {
  data: T | null;
  message: string;
  error: ServerError | string | null;
  status: "success" | "error";
}

export interface TokenErrorDetail {
  token_class: string;
  token_type: string;
  message: string;
}

export interface ErrorDetail {
  string: string; // The error message, e.g., "The fields store, tag must make a unique set."
  code: string; // The error code, e.g., "unique", "required"
}

export interface ServerError {
  // Specific known fields
  detail?: string | TokenErrorDetail | TokenErrorDetail[]; //  // Added for top-level detail field.
  messages?: TokenErrorDetail[]; // For token-related errors.
  code?: string;

  // Fallback for additional field-specific errors
  non_field_errors?: ErrorDetail[]; // General errors not tied to specific fields.
  [key: string]: (string | ErrorDetail)[] | undefined | unknown; // Field-specific errors.
}

export interface BaseImage {
  src: string; // The image URL
  alt: string; // The alt text (often the image file name)
}

export type CreatedAtFormat =
  `${number}-${number}-${number}T${number}:${number}:${number}Z`;
export type UpdatedAtFormat =
  `${number}-${number}-${number}T${number}:${number}:${number}${
    | ""
    | `.${number}${number}${number}`}`;
export type EventTimeFormat =
  `${number}-${number}-${number}T${number}:${number}:${number}${
    | "Z"
    | `+${number}:${number}`
    | `-${number}:${number}`}`;

export type Iso8601DateTimeFormat =
  | CreatedAtFormat
  | UpdatedAtFormat
  | EventTimeFormat; //  ISO 8601 -  Python's default serialization of datetime object

export type YearFormat = `${number}${number}${number}${number}`; // 4-digit year
export type MonthFormat = `${number}${number}`; // 2-digit month (01-12)
export type DayFormat = `${number}${number}`; // 2-digit day (01-31)

export type IsoDateFormat = `${YearFormat}-${MonthFormat}-${DayFormat}`;
export type Iso8601TimeFormat =
  | `${number}${number}:${number}${number}:${number}${number}` // HH:mm:ss
  | `${number}${number}:${number}${number}:${number}${number}.${number}`; // HH:mm:ss.sss

export type ItemStatus = "Archived" | "Active";
export type OrderType = "sale" | "purchase";
export type EntityType = "customer" | "supplier";
export type DeductionType = "discount" | "tax";
export type CardType = "loyalty" | "gift";
export type URLParamType = EntityType | OrderType | DeductionType | CardType;
export type URLResourceType =
  | "carts"
  | "expense"
  | "user"
  | "agent"
  | "apiKeys"
  | "retailStore"
  | "storefront"
  | "storefrontPage"
  | "branch"
  | "item"
  | "collection"
  | "order"
  | "entity"
  | "variant"
  | "inventory"
  | "variantCategory"
  | "inventoryCategory"
  | "expenseCategory"
  | "deduction"
  | "cards"
  | "expenseSettlements";

export type ActionType =
  | "list"
  | "create"
  | "retrieve"
  | "update"
  | "delete"
  | "bulkCreate"
  | "bulkDelete"
  | "bulkDownload";

export type FormatType = "html" | "pdf" | "image";

export enum AgentType {
  Employee = "EMPLOYEE",
  Service = "SERVICE",
}

export enum UserType {
  NonService = "NON_SERVICE", // Non-service user
  Service = "SERVICE", // Service user
}

export enum ServiceType {
  Payment = "PAYMENT", // Payment-related service
  Logistics = "LOGISTICS", // Logistics-related service
  Subscription = "SUBSCRIPTION", // Subscription service
}

export enum SalesChannels {
  PHYSICAL = "PHYSICAL",
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  TWITTER = "TWITTER",
  JUMIA = "JUMIA",
  PAYSTACK = "PAYSTACK",
  WEBSITE = "WEBSITE",
  STOREFRONT = "STOREFRONT",
  OTHERS = "OTHERS",
}

export enum Periodicity {
  ONE_OFF = "ONE_OFF",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  BIANNUALLY = "BIANNUALLY",
  ANNUALLY = "ANNUALLY",
}

export enum DaysOfWeek {
  MONDAY = "MON",
  TUESDAY = "TUE",
  WEDNESDAY = "WED",
  THURSDAY = "THU",
  FRIDAY = "FRI",
  SATURDAY = "SAT",
  SUNDAY = "SUN",
}

export enum APIKeyStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
  BLACKLISTED = "BLACKLISTED",
  BANNED = "BANNED",
}

// UUID format as a TypeScript template literal
export type UUIDType = `${string}-${string}-${string}-${string}-${string}`;

// export type NestedKeyOf<T> = {
//   [K in keyof T & string]: T[K] extends object
//     ? K | `${K}_${NestedKeyOf<T[K]>}` // Concatenate for nested keys
//     : K; // Include current key
// }[keyof T & string]; // Ensure keys are string-compatible

export type NestedKeyOf<T> =
  T extends Array<infer U> // Handle arrays
    ? `${string & keyof T}[]` | NestedKeyOf<U> // Handle array elements as nested
    : T extends object // Handle objects
      ? {
          [K in keyof T & string]: `${K}` | `${K}__${NestedKeyOf<T[K]>}`; // Concatenate nested keys
        }[keyof T & string]
      : never; // For non-object and non-array types, return nothing

export type RangeFilter<T> = {
  [key: string]: T | string | number | IsoDateFormat | DecimalField | undefined;
};

export type RatingOption = "up" | "down";

export interface DefaultFields {
  // pk?: string | number | UUIDType;
  id: string | number | UUIDType;
  created_at: Iso8601DateTimeFormat; // DateTimeField, auto_now_add
  updated_at: Iso8601DateTimeFormat; // DateTimeField, auto_now

  description?: string | null; // Optional TextField for description
  notes?: string | null; // Optional TextField for notes
  is_active?: boolean; // BooleanField indicating if the expense is active
}

export type Message = {
  id: string | number;
  sender?: User;
  recipient?: User | null;
  anonymous_device_token?: string;
  message_body: string;
  transmission_type?: "branch_to_user" | "user_to_branch";
  branch?: RefToInstance<Branch> | null;
  timestamp: Iso8601DateTimeFormat;
};

export interface QueryParams {
  branch_id?: string | number; // Branch ID (optional, number)
  store_id?: string | number; // Store ID (optional, number)

  q?: string; // Search query (optional, string)
  name?: string; // Name search query (optional, string)
  start_date?: IsoDateFormat; // Start date in 'YYYY-MM-DD' format (optional)
  end_date?: IsoDateFormat; // End date in 'YYYY-MM-DD' format (optional)
  // filter?: "branch_specific" | "store_specific" | "general"; // Filter (optional, enum or null)
  order_type?: OrderType; // Order type (either sale or purchase, optional)
  entity_type?: EntityType; // Entity type (customer or supplier, optional)
  status?: ItemStatus; // Status of the item (either active, archived, or null)
  page?: number; // Pagination page number (optional, number)
  page_size?: number; // Page size (optional, number)

  price__gte?: DecimalField; // Price greater than or equal to
  price__lte?: DecimalField; // Price less than or equal to

  order_by?: string;
  is_active?: `${boolean}`;

  ids?: string | number;

  // Handle Nested Fields like related models like 'author__profile__address'
  [key: string]:
    | string
    | number
    | IsoDateFormat
    | DecimalField
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | RangeFilter<any>
    | undefined
    | boolean;

  // [key in NestedKeyOf<any>]: string | number | IsoDateFormat | DecimalField | undefined;
  // [key: string]: any;
}

export type LoginResponse = {
  user: User;
  access?: string; // JWT access token, optional
  refresh?: string; // JWT refresh token, optional
};

export enum DeliveryType {
  DOOR = "DOOR",
  PICKUP = "PICKUP",
}

export type DecimalField = string;

export type FloatField = number;

// Accepts both ID and actual instance types
export type RefToInstance<T> = string | number | T | Partial<T>;

export type Gender = "Male" | "Female";

export enum BillingCycle {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
}

export enum ResourceType {
  CUSTOMERS = "Customers",
  SUPPLIERS = "Suppliers",
  SALES = "Sale",
  PURCHASE = "Purchase",
  STORE_VARIANTS = "StoreVariants",
  INVENTORY_CATEGORY = "InventoryCategory",
  COLLECTION = "Collection",
  EXPENSE = "Expense",
  STORE_BRANCH_EMPLOYEE = "StoreBranchEmployee",
  BRANCH = "Branch",
  STORE_BRANCH_ITEM = "StoreBranchItem",
  STORE_BRANCH_TAX = "StoreBranchTax",
  STORE_BRANCH_DISCOUNT = "StoreBranchDiscount",
  STORE_VARIANT = "StoreVariant",
}

export enum PermissionType {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  UPDATE = "update",
  READ_WRITE = "read_write",
  READ_UPDATE = "read_update",
  READ_DELETE = "read_delete",
  WRITE_DELETE = "write_delete",
  READ_WRITE_UPDATE = "read_write_update",
  READ_WRITE_DELETE = "read_write_delete",
  READ_UPDATE_DELETE = "read_update_delete",
  WRITE_UPDATE_DELETE = "write_update_delete",
  READ_WRITE_UPDATE_DELETE = "read_write_update_delete",
}

export enum Scope {
  STORE_WIDE = "store_wide",
  BRANCH_WIDE = "branch_wide",
}

export enum ValueType {
  FLAT = "FLAT",
  PERCENTAGE = "PERCENTAGE",
}

type FormType =
  | "entityForm"
  | "orderForm"
  | "branchForm"
  | "storeForm"
  | "employeeForm"
  | "productForm"
  | "discountForm"
  | "giftcardForm"
  | "apikeyForm"
  | "profileForm"
  | "taxForm"
  | "expenseForm";

export interface PopupMessageData<T> {
  type: "formSubmitted";
  formType: FormType;
  data: T;
  popupId: string | number; // Popup identifier
}

export interface PopupMessageEvent<T> extends MessageEvent {
  data: PopupMessageData<T>;
}

export enum VariantType {
  SIZE = "Size",
  COLOUR = "Colour",
  FLAVOUR = "Flavour",
  PACKAGING = "Packaging",
}

export enum RetailStoreType {
  GENERAL_RETAIL = "GENERAL_RETAIL",
  RESTAURANT = "RESTAURANT",
  FOOD_WHOLESALE = "FOOD_WHOLESALE",
  PHARMACY = "PHARMACY",
  SUPERMARKET = "SUPERMARKET",
  BAKERY = "BAKERY",
  FASHION = "FASHION",
  PET_STORE = "PET_STORE",
  BEAUTY_STORE = "BEAUTY_STORE",
  GIFT_SHOP = "GIFT_SHOP",
  HARDWARE_STORE = "HARDWARE_STORE",
  BOOKSTORE = "BOOKSTORE",
}

export interface CustomRole {
  type: "custom";
  description: string;
}

export enum StoreRole {
  SuperAdmin = "SUPER_ADMIN", // Same as owner
  Admin = "ADMIN", // Could be Manager, Supervisor, etc.
  Accountant = "ACCOUNTANT",
  SalesRep = "SALES_REP",
  Cashier = "CASHIER",
  StoreManager = "STORE_MANAGER", // Oversees daily operations
  SalesAssociate = "SALES_ASSOCIATE", // Engages with customers and assists in sales
  InventoryClerk = "INVENTORY_CLERK", // Manages stock levels
  CustomerServiceRep = "CUSTOMER_SERVICE_REP", // Assists customers
  MarketingSpecialist = "MARKETING_SPECIALIST", // Develops marketing strategies
  HRManager = "HUMAN_RESOURCES_MANAGER", // Manages employee relations
  OperationsManager = "OPERATIONS_MANAGER", // Manages logistics and supply chain
  StoreMaintenanceStaff = "STORE_MAINTENANCE_STAFF", // Handles cleaning and repairs
  TechSupportSpecialist = "TECHNICAL_SUPPORT_SPECIALIST", // Handles technical support
}

export type Role = StoreRole | CustomRole;

export const STATE_CHOICES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
] as const;

export type State = (typeof STATE_CHOICES)[number];

export const STATE_POSTAL_CODES = [
  "440001",
  "640001",
  "520001",
  "420001",
  "740001",
  "561001",
  "970001",
  "600001",
  "540001",
  "320001",
  "840001",
  "300001",
  "360001",
  "400001",
  "760001",
  "460001",
  "720001",
  "700001",
  "800001",
  "820001",
  "860001",
  "260001",
  "240001",
  "100001",
  "962001",
  "920001",
  "110001",
  "340001",
  "230001",
  "200001",
  "930001",
  "500001",
  "840001",
  "660001",
  "320001",
  "860001",
  "900001",
] as const;

export type PostalCode = (typeof STATE_POSTAL_CODES)[number];

export enum PaymentMethod {
  Bank = "BANK",
  Cash = "CASH",
  USSD = "USSD",
  POS = "POS",
  Card = "CARD",
  VendBox = "VENDBOX",
}

export enum TransactionStatus {
  Pending = "pending",
  Successful = "successful",
  Failed = "failed",
  Canceled = "canceled",
}

export enum ClothSize {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  XL = "XL",
}

export enum DrinkUnitSize {
  ml = "ml",
  cl = "cl",
  L = "L",
}

export enum SnackUnitSize {
  mg = "mg",
  g = "g",
  kg = "kg",
}

export enum VariantType {
  Size = "Size",
  Colour = "Colour",
  Flavour = "Flavour",
  Packaging = "Packaging",
}

export const UNIT_SIZE_CHOICES = [
  ...Object.values(DrinkUnitSize),
  ...Object.values(SnackUnitSize),
] as const;

export type UnitSize = (typeof UNIT_SIZE_CHOICES)[number];

export type CategoryChoice =
  | "food"
  | "beverage"
  | "fruit"
  | "tobacco"
  | "personal_care"
  | "electronics"
  | "medication"
  | "toys_games"
  | "water"
  | "other";

// import { type LucideIcon } from "lucide-react";
// import { IconType as ReactIconType } from "react-icons/lib";
// import { Icon as TablerIcon } from "@tabler/icons-react";

// export type IconType =
//   | ReactIconType
//   | TablerIcon
//   | LucideIcon
//   | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
export type IconType = React.ElementType;

export interface LinkProps {
  label: string;
  href: string;
  icon?: IconType;
  description?: string;
}

export type NavItem =
  | {
      label: string;
      href: string;
      type: "link" | "dropdown";
      items?: undefined;
    }
  | {
      label: string;
      type: "link" | "dropdown";
      items: {
        label: string;
        href: string;
        icon: IconType;
      }[];
      href?: undefined;
    };
