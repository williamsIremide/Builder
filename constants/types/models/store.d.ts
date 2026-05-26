import {
  BaseImage,
  MoneyMinorOrPercentScaledField,
  DefaultFields,
  Iso8601TimeFormat,
  RetailStoreType,
} from "../utilTypes";
import { Location } from "./location";
import { User } from "./user";

export interface RetailStore extends DefaultFields {
  name: string; // CharField with max_length 255
  created_by?: User | null; // OneToOneField to User, nullable and optional
  store_type: RetailStoreType; // CharField with choices for store types
  logo?: string | null; // ImageField, optional, nullable (use string for image path)
  is_storefront_live: boolean;
  storefront_url?: string;
}

export interface Branch extends DefaultFields {
  store: RetailStore; // ForeignKey to RetailStore
  name: string; // CharField with max_length 100
  tag?: string | null; // CharField with max_length 150, optional, nullable
  location?: Location | null; // ForeignKey to Location, nullable and optional
  currency_code: string; // 3-character ISO 4217 currency code (e.g., 'USD')
  currency_symbol?: string | null; // Currency symbol (e.g., '$', '₦')
  is_active: boolean; // BooleanField, default to True
  is_under_maintenance: boolean; // BooleanField, default to False
  is_headquarter: boolean; // BooleanField, default to False
  contact_email?: string | null; // EmailField, optional, nullable
  contact_phone_number_1?: string | null; // CharField with max_length 15, optional, nullable
  contact_phone_number_2?: string | null; // CharField with max_length 15, optional, nullable

  images?: BranchImage[]; // Array of URLs to the images, nullable and optional

  operating_hours?: BranchOperatingHours; // Operating hours, optional

  value_per_loyalty_point: MoneyMinorOrPercentScaledField; //, non-negative, default to 1.00
  loyalty_points_threshold?: number | null; // IntegerField, non-negative, nullable, optional
}

export interface BranchOperatingHours {
  branch?: Branch; // Reference to Branch
  monday_open_time: Iso8601TimeFormat; // Opening time for Monday
  monday_close_time: Iso8601TimeFormat; // Closing time for Monday
  tuesday_open_time: Iso8601TimeFormat; // Opening time for Tuesday
  tuesday_close_time: Iso8601TimeFormat; // Closing time for Tuesday
  wednesday_open_time: Iso8601TimeFormat; // Opening time for Wednesday
  wednesday_close_time: Iso8601TimeFormat; // Closing time for Wednesday
  thursday_open_time: Iso8601TimeFormat; // Opening time for Thursday
  thursday_close_time: Iso8601TimeFormat; // Closing time for Thursday
  friday_open_time: Iso8601TimeFormat; // Opening time for Friday
  friday_close_time: Iso8601TimeFormat; // Closing time for Friday
  saturday_open_time: Iso8601TimeFormat; // Opening time for Saturday
  saturday_close_time: Iso8601TimeFormat; // Closing time for Saturday
  sunday_open_time: Iso8601TimeFormat; // Opening time for Sunday
  sunday_close_time: Iso8601TimeFormat; // Closing time for Sunday
}

export interface BranchImage extends BaseImage {
  branch?: Branch; // ForeignKey to Branch
}
