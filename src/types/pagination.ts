// Pagination types (moved from lib/pagination-utils.ts)
export interface PaginationInfo {
  count: number;
  page: number;
  page_size: number;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
