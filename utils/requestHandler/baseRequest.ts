import { NextRouter } from "next/router";
import { requestTimeout } from "../timeUtils";
import { ServerResponse } from "~/constants/types/utilTypes";
import { getFromStorage } from "../storage/storageHandler";
import { handleCommonErrors } from "../errorHandler";

export async function request<T>(
  endpoint: string,
  options: RequestInit,
  setError: (error: string | null) => void,
  router: NextRouter,
  authorization_type: "API_KEY" | "JWT" | null = "API_KEY",
  timeout: number = requestTimeout,
): Promise<T | null> {
  const token = getFromStorage("loginResponse")?.access ?? "";
  if (authorization_type === "JWT" && !token) {
    router.push("/login");
    return null;
  }
  const headers: HeadersInit = {
    ...(authorization_type === "JWT"
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...options.headers,
  } as Record<string, string>;
  // If it's multipart (FormData), don't set the Content-Type, as the browser will handle it
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"; // For JSON requests
  }
  const controller = new AbortController(); // Create an AbortController
  const timeoutId = setTimeout(() => controller.abort(), timeout); // Set timeout for aborting the request
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal, // Attach the signal to the fetch request
    });
    clearTimeout(timeoutId); // Clear the timeout if the request succeeds
    if (!response.ok) {
      handleCommonErrors(
        response,
        () => router.push("/login"), // NOTE: Fix this!!
        setError,
      );
      return null;
    }
    const data: ServerResponse<T> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Request error:", error.message);
      setError(error.message);
    } else if (error && typeof error === "object" && "name" in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).name === "AbortError") {
        console.error("Request timed out");
        setError("Request timed out.");
      } else {
        setError("An unknown error occurred.");
      }
    } else {
      setError("An unknown error occurred.");
    }
    return null;
  }
}
