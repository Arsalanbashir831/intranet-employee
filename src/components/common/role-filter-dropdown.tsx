"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { useRoles } from "@/hooks/queries/use-roles";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableFilterDropdown } from "./searchable-filter-dropdown";
import type { FilterItem } from "@/types/searchable-filter-dropdown";
import type { RoleFilterDropdownProps } from "@/types/role-filter-dropdown";

export function RoleFilterDropdown({
  selectedRole,
  onRoleChange,
  className,
}: RoleFilterDropdownProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch roles with search
  const { data, isLoading, isError } = useRoles(debouncedSearch, {
    page: 1,
    pageSize: 50,
  });

  const roles: FilterItem[] = React.useMemo(
    () =>
      (data?.roles?.results || []).map((role) => ({
        id: role.id,
        name: role.name,
      })),
    [data]
  );

  return (
    <SearchableFilterDropdown
      selectedValue={selectedRole}
      onValueChange={onRoleChange}
      className={className}
      icon={Users}
      items={roles}
      isLoading={isLoading}
      isError={isError}
      searchPlaceholder="Search roles..."
      allLabel="All Roles"
      loadingLabel="Loading roles..."
      errorLabel="Failed to load roles"
      emptyLabel="No roles available."
      emptySearchLabel="No roles found."
      getItemId={(item) => item.id.toString()}
      getItemName={(item) => item.name}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
