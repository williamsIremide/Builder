import { Location } from "~/constants/types/models/location";

// Utility function to format a Location object into a human-readable string
export function formatLocation(location: Location | undefined | null): string {
  if (!location) return "";

  const { country, state_or_province, city, street: street } = location;
  // Start with the basic parts: country and state
  let locationString = `${state_or_province}, ${country}`;

  // Add city if available
  if (city) {
    locationString = `${city}, ${locationString}`;
  }

  // Optionally add street if available (considered less essential, so place at the end)
  if (street) {
    locationString = `${street}, ${locationString}`;
  }

  // // Optionally add postal code
  // if (postal_code) {
  //   locationString = `${locationString}, ${postal_code}`;
  // }

  // // If coordinates are available, append them at the end (optional)
  // if (latitude && longitude) {
  //   locationString = `${locationString} (Lat: ${latitude}, Long: ${longitude})`;
  // }

  return locationString;
}

/**
 * Parses an address string into a Location object.
 * @param address The full address string (e.g., "123 Beverage St, Drinksville, BEV123, Nigeria").
 * @returns A Location object containing street, state, and country.
 */
export function parseAddressToLocation(address: string): Partial<Location> {
  // Split address into components (assuming address format is 'street, city, state, country')
  const addressParts = address.split(",").map((part) => part.trim());

  // Initialize the location object with default values
  const location: Partial<Location> = {
    country: "Nigeria", // Default country
    state_or_province: "Lagos", // Default state
    city: addressParts[1] || null, // If available, set city
    street: addressParts[0] || null, // If available, set street
    postal_code: addressParts[2] || null, // If postal code exists, set it
    latitude: null, // Placeholder for latitude
    longitude: null, // Placeholder for longitude
  };

  // If a country is specified at the end of the address, set it
  if (addressParts.length > 3) {
    location.country = addressParts[addressParts.length - 1];
  }

  return location;
}

/**
 * Calculates the distance between two geographical points (lat/lng) in kilometers.
 * @param lat1 Latitude of the first point.
 * @param lng1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lng2 Longitude of the second point.
 * @returns Distance in kilometers.
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

export const geocodeAddress = async (
  address: string,
): Promise<{ lat: number; lng: number } | null> => {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");

    url.searchParams.set("q", address);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "RetailBox/1.0 (contact@retailbox.co)",
      },
    });

    const data = await res.json();

    if (!data?.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocode failed:", err);
    return null;
  }
};
