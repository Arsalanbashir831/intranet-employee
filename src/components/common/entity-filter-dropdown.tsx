"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableFilterDropdown } from "./searchable-filter-dropdown";
import type { FilterItem } from "@/types/searchable-filter-dropdown";

export type EntityFilterConfig<T> = {
  icon: LucideIcon;
  useQuery: (
    searchTermOrParams?: string | Record<string, string | number | boolean>,
    pagination?: { page?: number; pageSize?: number }
  ) => {
    data?: { results?: T[] } | { [key: string]: { results?: T[] } };
    isLoading: boolean;
    isError: boolean;
  };
  getResults: (data: ReturnType<EntityFilterConfig<T>["useQuery"]>["data"]) => T[];
  getItemId: (item: T) => string | number;
  getItemName: (item: T) => string;
  searchPlaceholder: string;
  allLabel: string;
  loadingLabel: string;
  errorLabel: string;
  emptyLabel: string;
  emptySearchLabel: string;
  pageSize?: number;
  useParamsForSearch?: boolean; // If true, pass params object instead of searchTerm
};

export type EntityFilterDropdownProps<T = unknown> = {
  selectedValue?: string;
  onValueChange: (value: string) => void;
  className?: string;
  config: EntityFilterConfig<T>;
};

export function EntityFilterDropdown<T = unknown>({
  selectedValue,
  onValueChange,
  className,
  config,
}: EntityFilterDropdownProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch entities with search
  const queryParams = config.useParamsForSearch
    ? (debouncedSearch ? { search: debouncedSearch } : undefined)
    : debouncedSearch;
  const { data, isLoading, isError } = config.useQuery(queryParams, {
    page: 1,
    pageSize: config.pageSize || 1000,
  });

  const items: FilterItem[] = React.useMemo(() => {
    const results = config.getResults(data);
    return results.map((item) => ({
      id: String(config.getItemId(item)),
      name: config.getItemName(item),
    }));
  }, [data, config]);

  return (
    <SearchableFilterDropdown
      selectedValue={selectedValue || "__all__"}
      onValueChange={onValueChange}
      className={className}
      icon={config.icon}
      items={items}
      isLoading={isLoading}
      isError={isError}
      searchPlaceholder={config.searchPlaceholder}
      allLabel={config.allLabel}
      loadingLabel={config.loadingLabel}
      errorLabel={config.errorLabel}
      emptyLabel={config.emptyLabel}
      emptySearchLabel={config.emptySearchLabel}
      getItemId={(item) => item.id.toString()}
      getItemName={(item) => item.name}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}

