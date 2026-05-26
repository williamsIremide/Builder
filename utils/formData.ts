export const buildFormData = <T extends object>(
  data: T,
  isMultipart: boolean,
): FormData | null => {
  if (!isMultipart) {
    return null;
  }

  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof T];

    // Skip undefined or null values
    if (value === undefined || value === null) {
      return;
    }

    // If the field is a file (image) or array of files, append them
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // For arrays, handle each item
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item); // Append if item is a file
        } else if (typeof item === "string" && !item.startsWith("http")) {
          // Skip URLs but include other types if necessary
          formData.append(key, item);
        }
      });
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Prepares the request body based on its type.
 * If the data is FormData, it returns it as-is.
 * Otherwise, it stringifies the data for JSON requests.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export function prepareRequestBody(data: JsonValue | FormData): BodyInit {
  return data instanceof FormData ? data : JSON.stringify(data);
}
