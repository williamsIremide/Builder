/* eslint-disable */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { QueryParams } from "~/constants/types/utilTypes";
import {
  fetchPaginatedData,
  fetchSingleInstance,
} from "~/utils/requestHandler/fetchData";
import {
  bulkDeleteInstances,
  deleteOrRestoreSingleInstance,
} from "~/utils/requestHandler/deleteData";
import { DEFAULT_PAGE_SIZE } from "~/constants/routes";
import { debounce } from "lodash";

import {
  debounceTime,
  resolveId,
  getFromStorage,
  PaginationDetails,
  getPaginationDetails,
} from "~/utils";

interface UsePaginatedDataProps<T> {
  fetchUrl: string; // API endpoint for fetching data
  deleteUrl: string; // API endpoint for deleting a single instance
  bulkDeleteUrl: string; // API endpoint for bulk deletion
  restoreUrl?: string;
  queryParams?: QueryParams; // Additional query parameters for data fetch
  titleForToasts?: string;
  initialPageSize?: number; // Starting page size (optional)
  dependencies?: any[];
  shouldFetchOnMount?: boolean; // Flag to control fetching on mount
  shouldSetStoreId?: boolean;
  shouldSetBranchId?: boolean;
  authorization_type?: "API_KEY" | "JWT" | null;
  isMockMode?: boolean;
}

export interface UsePaginatedDataResult<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  paginationDetails: PaginationDetails;
  totalItemsCount: number;
  pageSize: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleLoadMore: () => void;
  restoreSingle: (id: string) => Promise<void>;
  deleteSingle: (id: string) => Promise<void>;
  deleteMultiple: (ids: string[]) => Promise<void>;
  reloadData: () => Promise<void>;
  setQuery: (queryParams: QueryParams, merge?: boolean) => void;
}

interface UseSingleInstanceDataProps<T> {
  fetchUrl: string; // API endpoint for fetching data
  titleForToasts?: string;
}

export interface UseSingleInstanceDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reloadData: () => void;
}

export function usePaginatedData<T>({
  fetchUrl,
  deleteUrl,
  bulkDeleteUrl,
  restoreUrl = "",
  queryParams = {},
  titleForToasts,
  initialPageSize = DEFAULT_PAGE_SIZE,
  dependencies = [],
  shouldFetchOnMount = true,
  shouldSetStoreId = true,
  shouldSetBranchId = true,
  authorization_type = "API_KEY",
  isMockMode = false,
}: UsePaginatedDataProps<T>): UsePaginatedDataResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [currentQueryParams, setCurrentQueryParams] =
    useState<QueryParams>(queryParams);

  const router = useRouter();

  const activeStoreId = resolveId(getFromStorage("activeStore"));
  const activeBranchStoreId = resolveId(
    getFromStorage("activeBranch"),
    "store",
  );

  // Data loading function for pagination
  const loadData = async (
    url: string | null,
    appendData = false,
    updatedParams = queryParams,
  ) => {
    if (isMockMode) {
      setLoading(false);
      setData([]);
      setError(null);
      setTotalItemsCount(0);
      return;
    }
    try {
      setLoading(true);
      const nextUrl = await fetchPaginatedData<T>(
        url || fetchUrl, // Use passed fetchUrl or default URL
        {
          ...updatedParams,
          page: currentPage,
          page_size: updatedParams?.page_size || pageSize,
          // branch_id: shouldSetBranchId
          //   ? updatedParams.branch_id || getFromStorage("activeBranch")?.id
          //   : undefined,

          // store_id: shouldSetStoreId
          //   ? updatedParams.store_id || activeStoreId || activeBranchStoreId
          //   : undefined,
        },
        setData,
        setError,
        setLoading,
        router,
        appendData,
        data ?? [],
        setTotalItemsCount,
        authorization_type,
      );
      if (nextUrl) setNextPageUrl(nextUrl);
      setPrevPageUrl(url || null);
    } finally {
      // setLoading(false);
      console.log("");
    }
  };

  const currentQueryParamsRef = useRef(currentQueryParams);

  useEffect(() => {
    currentQueryParamsRef.current = currentQueryParams;
  }, [currentQueryParams]);

  const debouncedSetQuery = useCallback(
    debounce((updatedParams: QueryParams, merge: boolean) => {
      setCurrentPage(1); // Reset to the first page on new query

      const newParams = merge
        ? { ...currentQueryParamsRef.current, ...updatedParams }
        : updatedParams;

      setCurrentQueryParams(newParams);

      loadData(null, false, newParams); // Trigger data loading with the new parameters
    }, debounceTime),
    [debounceTime],
  );

  // Set query (this function calls the debounced version)
  const setQuery = (queryParams: QueryParams, merge = false) => {
    debouncedSetQuery(queryParams, merge);
  };

  const deleteSingle = async (id: string) => {
    if (isMockMode) {
      toast.success(`[MOCK] Deleted ${titleForToasts}`);
      return;
    }

    if (!deleteUrl) {
      console.error("DELETE URL must be provided!");
      return;
    }
    try {
      const result = await deleteOrRestoreSingleInstance(
        decodeURIComponent(deleteUrl).replace(":id", id),
        setError,
        router,
        "delete",
      );
      if (result) {
        toast.success(`${titleForToasts} deleted succesfully`);
        loadData(null); // Reload data after deletion
      }
    } catch (err) {
      toast.error(`Error deleting ${titleForToasts}`);
    }
  };

  const restoreSingle = async (id: string) => {
    if (isMockMode) {
      toast.success(`[MOCK] Restored ${titleForToasts}`);
      return;
    }

    if (!restoreUrl) {
      console.error("Restore URL must be provided!");
      return;
    }
    try {
      // Make an API request to restore the soft-deleted item
      const result = await deleteOrRestoreSingleInstance(
        decodeURIComponent(restoreUrl).replace(":id", id), // Reusing the delete URL structure for the restore endpoint
        setError,
        router,
        "restore",
      );

      // If successful, show a success toast and reload the data
      if (result) {
        toast.success(`${titleForToasts} restored successfully.`);
        loadData(null); // Reload the data to reflect the restored item
      }
    } catch (err) {
      toast.error("An error occurred while restoring the item.");
    }
  };

  const deleteMultiple = async (ids: string[]) => {
    if (isMockMode) {
      toast.success(`[MOCK] Deleted ${titleForToasts}`);
      return;
    }

    if (!bulkDeleteUrl) {
      console.error("Bulk Delete URL must be provided!");
      return;
    }
    try {
      const success = await bulkDeleteInstances(
        bulkDeleteUrl,
        ids,
        setError,
        router,
      );
      if (success) {
        toast.success(`${titleForToasts}s deleted succesfully`);
        loadData(null); // Reload data after deletion
      }
    } catch (err) {
      toast.error(`Error deleting ${titleForToasts}s`);
    }
  };

  // Reload data
  const reloadData = () => loadData(null);

  // Load more data (for infinite scroll)
  const handleLoadMore = (newPageSize?: number) => {
    if (!nextPageUrl) return;

    if (newPageSize) {
      setPageSize(newPageSize);
    }

    setCurrentPage((prevPage) => prevPage + 1);

    const updatedParams = {
      ...currentQueryParams,
      page_size: newPageSize || pageSize,
    };

    loadData(nextPageUrl, true, updatedParams);
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      setCurrentPage(currentPage + 1);
      loadData(nextPageUrl);
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrl) {
      setCurrentPage(currentPage - 1);
      loadData(prevPageUrl);
    }
  };

  // Initialize data loading on mount
  useEffect(() => {
    if (shouldFetchOnMount) {
      loadData(null);
    } else {
      setLoading(false);
    }
  }, [
    currentPage,
    // activeBranch, // This is new here and might cause issues. OBSERVE!
    pageSize,
    ...dependencies,
    shouldFetchOnMount,
  ]);

  const paginationDetails = getPaginationDetails(
    pageSize,
    currentPage,
    totalItemsCount,
  );

  return {
    data,
    loading,
    error,
    currentPage,
    totalItemsCount,
    pageSize,
    paginationDetails,
    setCurrentPage,
    setPageSize,
    handleNextPage,
    handlePrevPage,
    handleLoadMore,
    restoreSingle,
    deleteSingle,
    deleteMultiple,
    reloadData,
    setQuery,
  };
}

export function useSingleInstanceData<T>({
  fetchUrl,
}: UseSingleInstanceDataProps<T>): UseSingleInstanceDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Reload data function
  const reloadData = () => {
    fetchSingleData(); // Trigger the fetching again
  };

  // Fetch single instance data
  const fetchSingleData = async () => {
    try {
      setLoading(true); // Start loading
      await fetchSingleInstance<T>(
        fetchUrl,
        setData,
        setError,
        setLoading,
        router,
      );
      if (!data) {
        // toast.error(toastErrorMessage); // If no data was fetched, show error toast
      }
    } catch (err) {
      // toast.error(toastErrorMessage); // Show error toast for any caught errors
    }
  };

  // Call fetchSingleData on mount
  useEffect(() => {
    fetchSingleData();
  }, [fetchUrl]); // Re-fetch when fetchUrl changes

  return {
    data,
    loading,
    error,
    reloadData,
  };
}
