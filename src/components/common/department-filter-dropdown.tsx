"use client";

import { Briefcase } from "lucide-react";
import { useDepartments } from "@/hooks/queries/use-departments";
import { EntityFilterDropdown } from "./entity-filter-dropdown";
import type { DepartmentFilterDropdownProps } from "@/types/department-filter-dropdown";
import type { Department } from "@/types/departments";

export function DepartmentFilterDropdown({
  selectedDepartment,
  onDepartmentChange,
  className,
}: DepartmentFilterDropdownProps) {
  return (
    <EntityFilterDropdown<Department>
      selectedValue={selectedDepartment}
      onValueChange={onDepartmentChange}
      className={className}
      config={{
        icon: Briefcase,
        useQuery: (params, pagination) => {
          const result = useDepartments(
            params as Record<string, string | number | boolean> | undefined,
            pagination
          );
          return {
            data: result.data,
            isLoading: result.isLoading,
            isError: result.isError,
          };
        },
        getResults: (data) => {
          if (data && "departments" in data) {
            return data.departments?.results || [];
          }
          return [];
        },
        getItemId: (dept) => dept.id,
        getItemName: (dept) => dept.dept_name,
        searchPlaceholder: "Search departments...",
        allLabel: "All Departments",
        loadingLabel: "Loading departments...",
        errorLabel: "Failed to load departments",
        emptyLabel: "No departments available.",
        emptySearchLabel: "No departments found.",
        pageSize: 1000,
        useParamsForSearch: true,
      }}
    />
  );
}
