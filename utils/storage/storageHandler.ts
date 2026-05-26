import { Storefront, Cart, Branch, RetailStore } from "~/constants/types";
import { LoginResponse, RatingOption } from "~/constants/types/utilTypes";

// Define a sentinel constant to distinguish between "not found" and "null" values
const NOT_FOUND_SENTINEL = Symbol("NOT_FOUND");

type StorageKey =
  | "loginResponse"
  | "stores"
  | "activeStore"
  | "redirectAfterLogin"
  | "branches"
  | "activeBranch"
  | "storefront"
  | "cart"
  | "storefrontTimestamp"
  | "variantRating"
  | "variantSaves";

interface StorageMapping {
  loginResponse: LoginResponse;
  activeBranch: Branch | null;
  branches: Branch[] | null;
  stores: RetailStore[] | null;
  activeStore: RetailStore | null;
  redirectAfterLogin: string | null;
  cartId: string | number | null;
  itemQuantityInCart: string | number | null;
  cart: Cart | null;
  storefront: Storefront | null;
  storefrontTimestamp: number | null;
  variantRating: Record<string, RatingOption>;
  variantSaves: Record<string, boolean>;
}

class LocalStorageHandler<K extends keyof StorageMapping> {
  /**
   * Store a value in localStorage.
   * Serializes objects before storing.
   *
   * @param key - The key under which the value should be stored.
   * @param value - The value to store (could be an object or string).
   */
  set(key: K, value: StorageMapping[K] | string): void {
    if (typeof window !== "undefined" && value !== undefined) {
      const serializedValue =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  }

  /**
   * Retrieve a value from localStorage with a sentinel value to distinguish "not found".
   *
   * @param key - The key under which the value is stored.
   * @param parseJson - Whether to parse the value as JSON. Default is true.
   * @returns The stored value or NOT_FOUND_SENTINEL if the key is not found.
   */
  get<T = StorageMapping[K]>(
    key: K,
    parseJson = true,
  ): T | typeof NOT_FOUND_SENTINEL {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);

      if (storedValue === null) return NOT_FOUND_SENTINEL; // Key not found in storage

      if (parseJson) {
        try {
          return JSON.parse(storedValue) as T; // Attempt to parse as JSON
        } catch (error) {
          console.error("Failed to parse value from localStorage:", error);
          return NOT_FOUND_SENTINEL; // Return sentinel if parsing fails
        }
      } else {
        return storedValue as T; // Return string if not parsing JSON
      }
    }
    return NOT_FOUND_SENTINEL; // Return sentinel if window is undefined
  }

  /**
   * Remove a value from localStorage by key.
   *
   * @param key - The key to remove from localStorage.
   */
  remove(key: K): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear specific keys from localStorage.
   */
  clearAll(): void {
    const keys: StorageKey[] = [
      "loginResponse",
      "stores",
      "activeStore",
      "branches",
      "activeBranch",
    ];
    if (typeof window !== "undefined") {
      keys.forEach((key) => {
        localStorage.removeItem(key);
      });
    }
  }
}

export const storageHandler = new LocalStorageHandler<StorageKey>();

/**
 * Retrieve a value from localStorage and handle the sentinel value.
 *
 * @param key - The key under which the value is stored.
 * @returns The value from localStorage, or null if not found (due to sentinel).
 */
export function getFromStorage<K extends StorageKey>(
  key: K,
): StorageMapping[K] | null {
  const result = storageHandler.get(key);

  // If the result is the sentinel value, return null
  if (result === NOT_FOUND_SENTINEL) {
    return null;
  }

  // Type refinement: we can cast result safely as the expected type because of how we structured `get`
  return result as StorageMapping[K];
}

/**
 * Remove a value from localStorage by key.
 *
 * @param key - The key under which the value is stored.
 */
export function removeFromStorage<K extends StorageKey>(key: K): void {
  storageHandler.remove(key);
}

/**
 * Utility function to safely retrieve a value from localStorage.
 * If the value is not found or is the sentinel value, it returns the fallback value.
 *
 * @param value - The value retrieved from localStorage.
 * @param fallback - The fallback value to return if the value is not found or is invalid.
 * @returns The stored value or the fallback value.
 */
export function resolveFromStorage<T>(
  value: T | typeof NOT_FOUND_SENTINEL,
  fallback: T,
): T {
  if (value === NOT_FOUND_SENTINEL || value === null) {
    return fallback;
  }
  return value;
}
