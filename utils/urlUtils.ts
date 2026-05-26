import { BACKEND_BASE_URL } from "~/constants/routes";
import { QueryParams } from "~/constants/types/utilTypes";

/**
 * Utility function to construct a URL with query parameters.
 * Works in both client and server environments.
 * @param baseUrl - The base API URL
 * @param queryParams - Object containing the query parameters
 * @returns {string} - The constructed URL with query parameters
 */
export function buildUrlWithQueryParams(
  baseUrl: string,
  queryParams: QueryParams = {},
): string {
  // Define the origin to use based on environment (server or client)
  const origin =
    typeof window !== "undefined" ? window.location.origin : BACKEND_BASE_URL;

  // Construct URL
  const url = new URL(baseUrl, origin);

  // Iterate through the queryParams object and append them to the URL
  Object.keys(queryParams).forEach((key) => {
    // @ts-ignore
    const value = queryParams[key];

    // Log the key-value pair (for debugging purposes)
    // console.log(`Appending query param: ${key}=${value}`);

    // Only append the param if it's not already in the URL
    if (value && !url.searchParams.has(key)) {
      url.searchParams.append(key, value.toString());
    }
  });

  // Return the relative URL path and search parameters
  return typeof window !== "undefined"
    ? url.toString()
    : origin + url.pathname + url.search;
}

/**
 * Excludes fields from an object if they meet specific criteria (e.g., being a URL).
 * Handles both strings and arrays of strings.
 *
 * @param data - The original data object.
 * @param fields - An array of fields to check and potentially exclude.
 * @returns A new object with the specified fields removed or filtered if they match the exclusion criteria.
 */
export function excludeFieldsIfUrl<T>(data: T, fields: (keyof T)[]): T {
  const filteredData = { ...data }; // Create a shallow copy of the data

  fields.forEach((field) => {
    const value = filteredData[field];

    // Check if the field is a string and starts with "http"
    if (typeof value === "string" && value.startsWith("http")) {
      delete filteredData[field];
    }

    // Check if the field is an array of strings and filter out URLs
    if (Array.isArray(value)) {
      filteredData[field] = value.filter(
        (item) => typeof item !== "string" || !item.startsWith("http"),
      ) as T[keyof T];
    }
  });

  return filteredData;
}

/**
 * Checks if a given URL or host is local (e.g., localhost, 127.0.0.1).
 * Accepts both full URLs and host:port style inputs.
 * @param input - The URL or host string to check.
 * @returns {boolean} - True if the input is local.
 */
export function isLocalUrl(input: string): boolean {
  let url: URL;

  try {
    // Add http:// prefix if missing to make it a valid absolute URL
    if (!/^https?:\/\//i.test(input)) {
      input = `http://${input}`;
    }

    url = new URL(input);
  } catch {
    return false;
  }

  const hostname = url.hostname;

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.startsWith("192.168.")
  );
}
