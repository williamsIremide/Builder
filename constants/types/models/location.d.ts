import { DefaultFields, DecimalField } from "../utilTypes";

// Interface for Location
export interface Location extends DefaultFields {
  country: string; // CharField for the country, default to 'Nigeria'
  state_or_province: string; // CharField for the state, default to 'Lagos'
  full_address: string;
  city: string | null; // Optional CharField for the city
  street: string | null; // Optional CharField for the street
  postal_code: string | null; // Optional CharField for the postal code
  latitude: DecimalField | number | null; // Optional for latitude
  longitude: DecimalField | number | null; // Optional for longitude

  // Additional computed properties can be added here if necessary
}
