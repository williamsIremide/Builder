import { NextRouter } from "next/router";
import { request } from "./baseRequest";
import { JsonValue, prepareRequestBody } from "../formData";

export async function createSingleInstance<T>(
  endpoint: string,
  data: T,
  setError: (error: string | null) => void,
  router: NextRouter,
): Promise<T | null> {
  return request<T>(
    endpoint,
    {
      method: "POST",
      body: prepareRequestBody(data as JsonValue),
    },
    setError,
    router,
    "JWT",
  );
}

export async function bulkCreateInstances<T>(
  endpoint: string,
  dataList: T[],
  setError: (error: string | null) => void,
  router: NextRouter,
  key: string,
): Promise<T[] | null> {
  return request<T[]>(
    endpoint,
    {
      method: "POST",
      body: prepareRequestBody({ [key]: dataList } as JsonValue), // Send the array under the key provided
    },
    setError,
    router,
  );
}
