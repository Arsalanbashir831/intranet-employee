/**
 * Card Table component types
 */

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  Row,
  Column,
  Table,
} from "@tanstack/react-table";
import { PaginationState } from "@/lib/pagination-utils";

// Card Table Types
export type CardTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  toolbar?: React.ReactNode;
  footer?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode;
  rowClassName?: string;
  sorting?: SortingState;
  onSortingChange?: (state: SortingState) => void;
  headerClassName?: string;
  onRowClick?: (row: Row<TData>) => void;
  noResultsContent?: React.ReactNode;
  wrapRow?: (rowElement: React.ReactNode, row: Row<TData>) => React.ReactNode;
};

// Card Table Toolbar Types
export type CardTableToolbarProps = {
  title: string;
  placeholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onFilterClick?: () => void;
  hasSort?: boolean;
  hasFilter?: boolean;
  className?: string;
  sortOptions?: { label: string; value: string }[];
  activeSort?: string;
  accessControl?: React.ReactNode; // optional control like AccessLevelDropdown
};

// Card Table Pagination Types
export interface CardTablePaginationProps<TData> {
  table?: Table<TData>;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  alwaysShow?: boolean; // Show pagination even for single page
}

// Card Table Column Header Types
export type CardTableColumnHeaderProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
};

// Filter Drawer Types
export interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: (filters: Record<string, unknown>) => void;
  onReset?: () => void;
  showFilterButton?: boolean;
  showResetButton?: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
  applyText?: string;
  resetText?: string;
}

export interface FilterTriggerProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Filter Component Types
export interface DepartmentFilterProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export interface BranchDepartmentFilterProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export interface SearchFilterProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

// Sorting Dropdown Types
export type SortingDropdownProps = {
  sortOptions: { label: string; value: string }[];
  activeSort: string;
  onSortChange: (value: string) => void;
};

// Table Search Types
export type TableSearchProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

// Pin Row Button Types
export type RowWithId = { id: string };

export type PinRowButtonProps<TData extends RowWithId> = {
  row: Row<TData>;
  pinnedIds: Set<string>;
  togglePin: (id: string) => void;
};

// Access Level Dropdown Types
export type AccessItem = { label: string; value: string };
