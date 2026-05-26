import { NextRouter } from "next/router";
import { buildUrlWithQueryParams } from "../urlUtils";
import { PaginatedResponse, QueryParams } from "~/constants/types/utilTypes";
import { request } from "./baseRequest";

export async function fetchPaginatedData<T>(
  endpoint: string,
  queryParams: QueryParams = {},
  setItems: (items: T[] | null) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
  router: NextRouter,
  append: boolean = false,
  currentPageData?: T[],
  setTotalItemsCount?: (count: number) => void,
  authorization_type: "API_KEY" | "JWT" | null = "API_KEY",
): Promise<string | null> {
  const url = buildUrlWithQueryParams(endpoint, queryParams);
  setLoading(true);

  try {
    const data = await request<PaginatedResponse<T>>(
      url,
      { method: "GET" },
      setError,
      router,
      authorization_type,
    );

    if (data && data.results) {
      // Update the total items count if provided
      if (setTotalItemsCount) {
        setTotalItemsCount(data.count);
      }

      // Append or replace data based on `append` flag
      setItems(
        append && currentPageData
          ? [...currentPageData, ...data.results]
          : data.results,
      );

      setError(null); // Clear any previous errors

      // Return the next page URL, or null if there are no more pages
      return data.next || null;
    } else {
      setError("Failed to retrieve paginated data.");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching paginated data:", error.message);
      setError(error.message);
    } else {
      console.error("Unknown error fetching paginated data:", error);
      setError("An unknown error occurred.");
    }
    return null;
  } finally {
    setLoading(false); // Stop loading
  }
}

export async function fetchSingleInstance<T>(
  endpoint: string,
  setItem: (item: T | null) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
  router: NextRouter,
  authorization_type: "API_KEY" | "JWT" = "API_KEY",
): Promise<void> {
  setLoading(true);

  try {
    const data = await request<T>(
      endpoint,
      { method: "GET" },
      setError,
      router,
      authorization_type,
    );

    if (data) {
      setItem(data);
      setError(null); // Clear any existing errors
    } else {
      setError("Failed to retrieve the requested item.");
      setItem(null);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching paginated data:", error.message);
      setError(error.message);
    } else {
      console.error("Unknown error fetching paginated data:", error);
      setError("An unknown error occurred.");
    }
    setItem(null);
  } finally {
    setLoading(false); // End loading state
  }
}
