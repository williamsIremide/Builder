import { RefToInstance } from "~/constants/types/utilTypes";

/**
 * Utility type to infer if a property is a serialized object.
 *
 * This type checks if a given type has an `id` property,
 * inferring its type if present.
 *
 * @template T - The object type being inspected.
 */
export type Serialized<T> = T extends { id: infer ID } ? ID : never;

/**
 * Utility type to determine if a specific property of an object
 * is serialized or not.
 *
 * This type checks if the property `K` of type `T` is an object
 * with an `id` field, returning an updated type and a boolean
 * indicating whether it is serialized.
 *
 * @template T - The object type containing the property.
 * @template K - The key of the property being checked.
 */
export type IsSerialized<T, K extends keyof T> = T[K] extends {
  id: string | number;
}
  ? { value: T[K]; isSerialized: true }
  : { value: Serialized<T[K]>; isSerialized: false };

/**
 * A type guard to check if a value is an ID (string | number) or a serialized object.
 *
 * @param value - The value to check.
 * @returns True if the value is either an object or an ID.
 */
export function isIdOrSerialized<T>(
  value: RefToInstance<T> | string | number,
): value is T | string | number {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    (typeof value === "object" && value !== null)
  );
}

/**
 * Extract the ID from a RefToInstance.
 *
 * If it's already an ID, return it directly.
 * If it's a serialized instance, assume it has an 'id' field and extract it.
 *
 * @param value - The value to extract the ID from.
 * @returns The ID as a string or number.
 */
export function getIdFromRef<T extends { id: string | number }>(
  value: RefToInstance<T>,
): string | number {
  return typeof value === "object" && value !== null
    ? (value.id as string | number)
    : value;
}

/**
 * Safely retrieve the ID from a RefToInstance, or a nested field ID.
 *
 * @param value - The RefToInstance to resolve (ID or serialized object).
 * @param nestedField - (Optional) Field to resolve the ID from within the serialized object.
 * @returns The resolved ID, or undefined if not available.
 */
export function resolveId<T extends { id: string | number }, K extends keyof T>(
  value: RefToInstance<T> | undefined | null,
  nestedField?: K,
): string | number | undefined {
  if (!value) return undefined;

  if (typeof value === "object" && value !== null) {
    if (nestedField) {
      const nestedValue = value[nestedField];
      return nestedValue &&
        typeof nestedValue === "object" &&
        "id" in nestedValue
        ? (nestedValue as { id: string | number }).id
        : undefined;
    }
    return value.id;
  }

  return value; // If it's already an ID
}

/**
 * Maps an array of objects and replaces a specified reference key
 * (e.g. "item", "user", etc.) with just its ID, while keeping all other fields intact.
 *
 * Handles both objects (with `.id`) and primitive values (string/number).
 */
export function replaceNestedObjectWithId<T, K extends keyof T>(
  items: T[],
  key: K,
): Array<Omit<T, K> & { [P in K]: string | number | undefined }> {
  return items.map((item) => {
    const value = item[key];

    let id: string | number | undefined;

    if (value && typeof value === "object" && "id" in value) {
      id = (value as { id: string | number }).id;
    } else if (typeof value === "string" || typeof value === "number") {
      id = value;
    }

    return {
      ...item,
      [key]: id,
    };
  });
}

/**
 * Utility to check if a specific property of an object is serialized or not.
 *
 * @param obj - The object containing the property to check.
 * @param key - The key of the property to check.
 * @returns An object containing the value of the property and a boolean indicating if it is serialized.
 */
export function resolveProperty<T, K extends keyof T>(
  obj: T,
  key: K,
): IsSerialized<T, K> {
  const value = obj[key];

  if (typeof value === "object" && value !== null && "id" in value) {
    // The value is serialized
    return {
      value: value as T[K],
      isSerialized: true,
    } as IsSerialized<T, K>;
  }

  // The value is not serialized; it's just the ID
  return {
    value: value as unknown as Serialized<T[K]>, // Explicitly cast to Serialized<T[K]>
    isSerialized: false,
  } as IsSerialized<T, K>;
}

/**
 * Utility type to deeply transform specific properties of a type into reference-friendly types.
 *
 * This type allows replacing keys (including nested keys like 'variant.categories' or 'items.item')
 * with `RefToInstance` values, allowing those fields to accept either an object or just an ID.
 *
 * Arrays are handled properly: if the path goes through an array, each item in the array is transformed.
 *
 * This is especially useful when sending data to a backend that expects foreign key IDs,
 * while your frontend works with full serialized objects (e.g. from a Django API).
 *
 * @template T - The original object/interface type.
 * @template K - The dot-notated key path(s) to be replaced with reference-friendly types.
 *
 * @example
 * interface Item {
 *   id: number;
 *   name: string;
 * }
 *
 * interface CartItem {
 *   id: number;
 *   item: Item;
 *   quantity: number;
 * }
 *
 * interface Cart {
 *   id: number;
 *   items: CartItem[];
 *   store: Store;
 * }
 *
 * type CartWithRefs = ReplaceWithRef<Cart, 'items.item' | 'store'>;
 *
 * // Result: Cart where:
 * // - store becomes RefToInstance<Store>
 * // - items becomes CartItem[] where each CartItem's item is RefToInstance<Item>
 */
export type ReplaceWithRef<T, K extends string> = ReplaceWithRefDeep<T, K>;

/**
 * Internal recursive type that handles dot-notated paths.
 *
 * Key improvements:
 * 1. Properly handles arrays when the path continues through them
 * 2. Uses union types to handle multiple key paths
 * 3. Maintains proper type structure for nested transformations
 */
type ReplaceWithRefDeep<
  T,
  K extends string,
> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? T[Key] extends (infer U)[]
      ? // If T[Key] is an array, transform each array element
        Omit<T, Key> & {
          [P in Key]: ReplaceWithRefDeep<U, Rest>[];
        }
      : // If T[Key] is not an array, recurse normally
        Omit<T, Key> & {
          [P in Key]: ReplaceWithRefDeep<T[Key], Rest>;
        }
    : T
  : // Base case: no more dots in the key path
    K extends keyof T
    ? T[K] extends (infer U)[]
      ? // If it's an array, make it an array of RefToInstance<U>
        Omit<T, K> & {
          [P in K]: RefToInstance<U>[];
        }
      : // If it's not an array, make it RefToInstance<T[K]>
        Omit<T, K> & {
          [P in K]: RefToInstance<T[K]>;
        }
    : T;

/**
 * Utility type for form submissions where any property (except 'id') in `T`
 * can be either its original type or its `id`.
 *
 * Useful for API payloads where related entities may be submitted as IDs
 * instead of full objects.
 *
 * Automatically handles arrays of reference objects too.
 *
 * The top-level `id` field is excluded since it's rarely submitted.
 *
 * @example
 * FlexibleSubmit<Cart> allows:
 * {
 *   user: User | string | number;
 *   store: RetailStore | string | number;
 *   items: (CartItem | string | number)[];
 *   // 'id' is excluded
 * }
 */
export type FlexibleSubmit<T> = {
  [K in keyof Omit<T, "id">]: T[K] extends { id: string | number }
    ? T[K] | string | number
    : T[K] extends Array<infer U>
      ? U extends { id: string | number }
        ? Array<U | string | number>
        : T[K]
      : T[K];
};
