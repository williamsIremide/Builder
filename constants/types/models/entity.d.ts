import { DefaultFields, Gender } from "../utilTypes";
import { Branch } from "./store";
import { Location } from "./location";

// Base interface for transactional entities (abstract)
export interface TransactionalEntity extends DefaultFields {
  name: string; // CharField for the name
  phone_number?: string | null; // Optional CharField for phone number
  email: string; // EmailField for email
  company_name?: string | null; // Optional CharField for company name
  additional_info?: string | null; // Optional TextField for additional info
  location?: Location;
  branch: Branch;
}

// Interface for an Entity Group
export interface EntityGroup extends DefaultFields {
  name: string; // CharField for group name
}

// Interface for a Supplier
export interface Supplier extends TransactionalEntity {
  groups?: EntityGroup[]; // Many-to-Many relationship with EntityGroup
}

// Interface for a Customer
export interface Customer extends TransactionalEntity {
  groups?: EntityGroup[]; // Many-to-Many relationship with EntityGroup
  gender?: Gender;
}
