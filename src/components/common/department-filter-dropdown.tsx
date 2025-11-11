"use client";

import * as React from "react";
import { Briefcase } from "lucide-react";
import { useDepartments } from "@/hooks/queries/use-departments";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableFilterDropdown, type FilterItem } from "./searchable-filter-dropdown";

interface DepartmentFilterDropdownProps {
	selectedDepartment: string; // "__all__" or department ID as string
	onDepartmentChange: (departmentId: string) => void;
	className?: string;
}

export function DepartmentFilterDropdown({
	selectedDepartment,
	onDepartmentChange,
	className,
}: DepartmentFilterDropdownProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const debouncedSearch = useDebounce(searchQuery, 400);

	// Fetch departments with search
	const { data, isLoading, isError } = useDepartments(
		debouncedSearch ? { search: debouncedSearch } : undefined,
		{ page: 1, pageSize: 1000 }
	);

	const departments: FilterItem[] = React.useMemo(
		() =>
			(data?.departments?.results || []).map((dept) => ({
				id: dept.id,
				name: dept.dept_name,
			})),
		[data]
	);

	return (
		<SearchableFilterDropdown
			selectedValue={selectedDepartment}
			onValueChange={onDepartmentChange}
			className={className}
			icon={Briefcase}
			items={departments}
			isLoading={isLoading}
			isError={isError}
			searchPlaceholder="Search departments..."
			allLabel="All Departments"
			loadingLabel="Loading departments..."
			errorLabel="Failed to load departments"
			emptyLabel="No departments available."
			emptySearchLabel="No departments found."
			getItemId={(item) => item.id.toString()}
			getItemName={(item) => item.name}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
		/>
	);
}
