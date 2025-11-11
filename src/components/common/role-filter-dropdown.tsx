"use client";

import { Users } from "lucide-react";
import { useRoles } from "@/hooks/queries/use-roles";
import { EntityFilterDropdown } from "./entity-filter-dropdown";
import type { RoleFilterDropdownProps } from "@/types/role-filter-dropdown";
import type { Role } from "@/types/roles";

export function RoleFilterDropdown({
  selectedRole,
  onRoleChange,
  className,
}: RoleFilterDropdownProps) {
  return (
    <EntityFilterDropdown<Role>
      selectedValue={selectedRole}
      onValueChange={onRoleChange}
      className={className}
      config={{
        icon: Users,
        useQuery: (searchTerm, pagination) => {
          const result = useRoles(searchTerm as string, pagination);
          return {
            data: result.data,
            isLoading: result.isLoading,
            isError: result.isError,
          };
        },
        getResults: (data) => {
          if (data && "roles" in data) {
            return data.roles?.results || [];
          }
          return [];
        },
        getItemId: (role) => role.id,
        getItemName: (role) => role.name,
        searchPlaceholder: "Search roles...",
        allLabel: "All Roles",
        loadingLabel: "Loading roles...",
        errorLabel: "Failed to load roles",
        emptyLabel: "No roles available.",
        emptySearchLabel: "No roles found.",
        pageSize: 50,
      }}
    />
  );
}
