import localforage from "localforage";
import { Storefront, Cart, Branch, RetailStore } from "~/constants/types";
import { LoginResponse, Message } from "~/constants/types/utilTypes";

// Define a sentinel constant to distinguish between "not found" and "null" values
export const NOT_FOUND_SENTINEL = Symbol("NOT_FOUND");

export type StorageKey =
  | "loginResponse"
  | "stores"
  | "activeStore"
  | "redirectAfterLogin"
  | "branches"
  | "activeBranch"
  | "storefront"
  | "cart"
  | "storefrontTimestamp"
  | "firebaseDeviceToken"
  | `chatMessages-${string}`;

export interface StorageMapping {
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
  firebaseDeviceToken: string;
  [key: `chatMessages-${string}`]: Message[] | null;
}

class LocalForageHandler<K extends StorageKey> {
  /**
   * Store a value in localForage.
   * Serializes objects before storing.
   *
   * @param key - The key under which the value should be stored.
   * @param value - The value to store (could be an object or string).
   */
  async set(key: K, value: StorageMapping[K] | string): Promise<void> {
    if (value !== undefined) {
      const serializedValue =
        typeof value === "string" ? value : JSON.stringify(value);
      try {
        await localforage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Error setting item ${key} in localForage:`, error);
      }
    }
  }

  /**
   * Retrieve a value from localForage with a sentinel value to distinguish "not found".
   *
   * @param key - The key under which the value is stored.
   * @param parseJson - Whether to parse the value as JSON. Default is true.
   * @returns The stored value or NOT_FOUND_SENTINEL if the key is not found.
   */
  async get<T = StorageMapping[K]>(
    key: K,
    parseJson = true,
  ): Promise<T | typeof NOT_FOUND_SENTINEL> {
    try {
      const storedValue = await localforage.getItem<string>(key);

      if (storedValue === null || storedValue === undefined) {
        return NOT_FOUND_SENTINEL; // Key not found in storage
      }

      if (parseJson) {
        try {
          return JSON.parse(storedValue) as T; // Attempt to parse as JSON
        } catch (error) {
          // If JSON parsing fails, check if it's a raw string
          if (key === "firebaseDeviceToken") {
            return storedValue as unknown as T; // Return raw string as is
          }
          console.error("Failed to parse value from localForage:", error);
          return NOT_FOUND_SENTINEL; // Return sentinel if parsing fails
        }
      } else {
        return storedValue as unknown as T; // Return raw value if not parsing JSON
      }
    } catch (error) {
      console.error(`Error getting item ${key} from localForage:`, error);
      return NOT_FOUND_SENTINEL;
    }
  }

  /**
   * Remove a value from localForage by key.
   *
   * @param key - The key to remove.
   */
  async remove(key: K): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localForage:`, error);
    }
  }

  /**
   * Clear specific keys from localForage.
   */
  async clearAll(): Promise<void> {
    const keys: StorageKey[] = [
      "loginResponse",
      "stores",
      "activeStore",
      "branches",
      "activeBranch",
    ];
    try {
      await Promise.all(keys.map((key) => localforage.removeItem(key)));
    } catch (error) {
      console.error("Error clearing items from localForage:", error);
    }
  }
}

export const storageHandler = new LocalForageHandler<StorageKey>();

/**
 * Retrieve a value from localForage and handle the sentinel value.
 *
 * @param key - The key under which the value is stored.
 * @returns A Promise that resolves to the value from localForage, or null if not found.
 */
export async function getFromStorage<K extends StorageKey>(
  key: K,
): Promise<StorageMapping[K] | null> {
  const result = await storageHandler.get(key);

  // If the result is the sentinel value, return null
  if (result === NOT_FOUND_SENTINEL) {
    return null;
  }

  return result as StorageMapping[K];
}

/**
 * Remove a value from localForage by key.
 *
 * @param key - The key to remove.
 */
export async function removeFromStorage<K extends StorageKey>(
  key: K,
): Promise<void> {
  await storageHandler.remove(key);
}

/**
 * Utility function to safely retrieve a value from localForage.
 * If the value is not found or is the sentinel value, it returns the fallback value.
 *
 * @param value - The value retrieved from localForage.
 * @param fallback - The fallback value to return if the value is not found or is invalid.
 * @returns The stored value or the fallback value.
 */
export function resolveFromStorage<T>(
  value: T | typeof NOT_FOUND_SENTINEL | null,
  fallback: T,
): T {
  if (value === NOT_FOUND_SENTINEL || value === null) {
    return fallback;
  }
  return value;
}
