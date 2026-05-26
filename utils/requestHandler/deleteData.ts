import { ServerResponse } from "~/constants/types/utilTypes";
import { NextRouter } from "next/router";
import { toast } from "sonner";
import { request } from "./baseRequest";

export async function deleteOrRestoreSingleInstance(
  endpoint: string,
  setError: (error: string | null) => void,
  router: NextRouter,
  action: "delete" | "restore" = "delete",
): Promise<boolean> {
  const method = action === "delete" ? "DELETE" : "POST";

  // Perform the appropriate request based on action (DELETE or POST)
  const result = await request<ServerResponse<null>>(
    endpoint,
    { method },
    setError,
    router,
    "JWT",
  );

  if (result) {
    // Display a toast based on the action
    if (action === "delete") {
      toast.success("Deletion successful");
    } else if (action === "restore") {
      toast.success("Restoration successful");
    }
    return true;
  }

  return false;
}

export async function bulkDeleteInstances(
  endpoint: string,
  ids: string[], // The list of IDs to delete
  setError: (error: string | null) => void,
  router: NextRouter,
): Promise<boolean> {
  const result = await request<ServerResponse<null>>(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify({ ids }),
    },
    setError,
    router,
  );

  if (result) {
    toast.success("Deletion successful");
    return true;
  }
  return false;
}
