/**
 * Searchable Filter Dropdown component types
 */

import { LucideIcon } from "lucide-react";

// Reusable FilterItem type - used across multiple filter dropdowns
export type FilterItem = {
  id: number | string;
  name: string;
};

export type SearchableFilterDropdownProps<T extends FilterItem> = {
  selectedValue: string; // "__all__" or item ID as string
  onValueChange: (value: string) => void;
  className?: string;
  icon: LucideIcon;
  items: T[];
  isLoading: boolean;
  isError: boolean;
  searchPlaceholder: string;
  allLabel: string;
  loadingLabel: string;
  errorLabel: string;
  emptyLabel: string;
  emptySearchLabel: string;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};
