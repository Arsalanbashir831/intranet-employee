"use client";

import { Building2 } from "lucide-react";
import { useBranches } from "@/hooks/queries/use-branches";
import { EntityFilterDropdown } from "./entity-filter-dropdown";
import type { BranchFilterDropdownProps } from "@/types/branch-filter-dropdown";
import type { Branch } from "@/types/branches";

export function BranchFilterDropdown({
  selectedBranch,
  onBranchChange,
  className,
}: BranchFilterDropdownProps) {
  return (
    <EntityFilterDropdown<Branch>
      selectedValue={selectedBranch}
      onValueChange={onBranchChange}
      className={className}
      config={{
        icon: Building2,
        useQuery: (searchTerm, pagination) => {
          const result = useBranches(searchTerm as string, pagination);
          return {
            data: result.data,
            isLoading: result.isLoading,
            isError: result.isError,
          };
        },
        getResults: (data) => {
          if (data && "branches" in data) {
            return data.branches?.results || [];
          }
          return [];
        },
        getItemId: (branch) => branch.id,
        getItemName: (branch) => branch.branch_name,
        searchPlaceholder: "Search branches...",
        allLabel: "All Branches",
        loadingLabel: "Loading branches...",
        errorLabel: "Failed to load branches",
        emptyLabel: "No branches available.",
        emptySearchLabel: "No branches found.",
        pageSize: 1000,
      }}
    />
  );
}
