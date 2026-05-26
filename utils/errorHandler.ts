import { toast } from "sonner";
import { storageHandler } from "./storage/storageHandler";
import { ServerError, ServerResponse } from "~/constants/types/utilTypes";

// This function will handle common API errors, such as token expiration and unique constraint violations
export async function handleCommonErrors(
  response: Response,
  redirect: () => void,
  setError: (error: string | null) => void,
) {
  let data: ServerResponse<unknown>;

  // Attempt to parse the JSON response
  try {
    data = await response.json();
  } catch (jsonError) {
    // Handle the case where parsing fails
    throw new Error(
      `Failed to parse response: ${response.status} ${response.statusText}`,
    );
  }

  // Check for token expiration or invalid token error
  if (
    data.status === "error" &&
    data.error &&
    data.message.includes("token is invalid or has expired")
  ) {
    handleSessionExpiration(redirect);
  }

  // Handle other possible API related errors
  if (data.status === "error") {
    setError(getErrorMessage(data.error));
    toast.error(data.message || "An error occurred");
    throw new Error(data.message || "An error occurred");
  }
}

// Helper function to extract a meaningful error message
export function getErrorMessage(error: string | ServerError | null): string {
  console.log("Error received:", error);

  // Handle plain string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle object-based errors
  if (error && typeof error === "object") {
    // Check for `detail` field (commonly used in Django REST Framework)
    if (error.detail) {
      if (typeof error.detail === "string") {
        return error.detail;
      } else if (Array.isArray(error.detail)) {
        // Handle an array of token errors
        return error.detail
          .map((err) => err.message || "Unknown token error")
          .join(", ");
      } else if (
        typeof error.detail === "object" &&
        "message" in error.detail
      ) {
        // Handle a single token error object
        return error.detail.message;
      }
    }

    // Handle `messages` field for token errors
    if (error.messages && Array.isArray(error.messages)) {
      return error.messages.map((msg) => msg.message).join(", ");
    }

    // Handle non-field errors
    if (error.non_field_errors && error.non_field_errors.length > 0) {
      return error.non_field_errors
        .map((err) => (typeof err === "string" ? err : err.string))
        .join(", ");
    }

    // Handle field-specific errors
    const fieldErrors = Object.entries(error).find(
      ([key, value]) => key !== "non_field_errors" && value,
    );
    if (fieldErrors) {
      const [field, errors] = fieldErrors;
      const errorMessages: string[] = Array.isArray(errors)
        ? errors.map((err: string | { string?: string }) =>
            typeof err === "string" ? err : (err.string ?? "Unknown error"),
          )
        : [];
      return `${field}: ${errorMessages.join(", ")}`;
    }
  }

  // Fallback message
  return "An unknown error occurred. Please try again.";
}

export function handleSessionExpiration(redirect: () => void) {
  // Clear all relevant stored data
  // storageHandler.clearAll();

  // Store the intended route to redirect after login
  const intendedRoute = window.location.pathname;
  storageHandler.set("redirectAfterLogin", intendedRoute);

  // Display session expired error
  toast.error("Your session has expired. Please log in again.");

  // Redirect to login page
  redirect();
}
