import { NextRouter } from "next/router";
import { request } from "./baseRequest";
import { JsonValue, prepareRequestBody } from "../formData";

export async function updateSingleInstance<T extends JsonValue>(
  endpoint: string,
  data: T,
  setError: (error: string | null) => void,
  router: NextRouter,
  method: "PATCH" | "PUT" = "PATCH",
): Promise<T | null> {
  try {
    // Use the centralised request function for the PATCH request
    const updatedData = await request<T>(
      endpoint,
      {
        method: method,
        body: prepareRequestBody(data),
      },
      setError,
      router,
      "JWT",
    );

    if (updatedData) {
      return updatedData; // Return the updated resource data on success
    } else {
      setError("Failed to update the requested instance.");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating instance:", error.message);
      setError(error.message);
    } else {
      console.error("Unknown error updating instance:", error);
      setError("An unknown error occurred.");
    }
    return null;
  }
}

export async function bulkUpdateInstances<T>(
  endpoint: string,
  dataList: T[],
  setError: (error: string | null) => void,
  router: NextRouter,
  key: string,
  method: "PATCH" | "PUT" = "PATCH",
): Promise<T[] | null> {
  try {
    const updatedInstances = await request<T[]>(
      endpoint,
      {
        method: method,
        body: prepareRequestBody({ [key]: dataList } as JsonValue), // Send the array under the key
      },
      setError,
      router,
    );

    // If successful, return the updated instances
    if (updatedInstances) {
      return updatedInstances;
    } else {
      setError("Failed to update the requested instances.");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating instances:", error.message);
      setError(error.message);
    } else {
      console.error("Unknown error updating instances:", error);
      setError("An unknown error occurred.");
    }
    return null;
  }
}
