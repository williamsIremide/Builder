import { DefaultFields, Iso8601DateTimeFormat, UserType } from "../utilTypes";
import { Location } from "./location";

export interface User extends AbstractUser {
  middle_name?: string | null; // CharField with max_length 150, optional and nullable
  phone_number?: string | null; // CharField with max_length 15, optional and nullable
  location?: Location | null; // ForeignKey to Location, optional and nullable
  profile_image?: string | null; // URL to the image, optional and nullable
  referred_by?: User | null; // ForeignKey to self, optional and nullable
  dob?: Iso8601DateTimeFormat;
  referral_code?: string; // CharField
  total_referral_points?: number; // IntegerField, optional
  user_type: UserType; // CharField with choices
  service_name?: string | null; // CharField, optional and nullable
  service_metadata?: Record<string, unknown>; // JSONField, optional
  service_type?: ServiceType | null; // CharField with choices, optional and nullable

  referral_status?: "pending" | "succesful";

  // Custom related names for groups and permissions to avoid clashes
  groups?: Group[]; // ManyToManyField to Group, optional
  user_permissions?: Permission[]; // ManyToManyField to Permission, optional
}

export interface AbstractUser extends DefaultFields {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string; // Wouldn't be available on client-side
  last_login?: Iso8601DateTimeFormat;
  date_joined?: Iso8601DateTimeFormat;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean; // BooleanField
}

export interface Group {
  id: string | number; // Primary key
  name: string; // Group name
}

export interface Permission {
  id: string | number; // Primary key
  name: string; // Permission name
  codename: string; // Permission codename
  content_type: string; // Content type for the permission
}
