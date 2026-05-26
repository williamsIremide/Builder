export type PaginationDetails = {
  totalPages: number;
  pageSize: number;
  currentPage: number;
  canNextPage: boolean;
  canPrevPage: boolean;
};

export const getPaginationDetails = (
  pageSize: number,
  pageNumber: number,
  totalItemCount: number,
): PaginationDetails => {
  const totalPages = Math.ceil(totalItemCount / pageSize); // Calculate total number of pages
  const canNextPage = pageNumber < totalPages; // Can we go to the next page?
  const canPrevPage = pageNumber > 1; // Can we go to the previous page?

  return {
    totalPages,
    pageSize,
    currentPage: pageNumber,
    canNextPage,
    canPrevPage,
  };
};

export function getVisiblePages(totalPages: number, currentPage: number) {
  const maxVisiblePages = 5;
  const visiblePages = [];
  let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let end = Math.min(start + maxVisiblePages - 1, totalPages);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(end - maxVisiblePages + 1, 1);
  }

  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
}
