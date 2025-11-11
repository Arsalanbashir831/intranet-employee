"use client";

import * as React from "react";
import { Building2 } from "lucide-react";
import { useBranches } from "@/hooks/queries/use-branches";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableFilterDropdown, type FilterItem } from "./searchable-filter-dropdown";

interface BranchFilterDropdownProps {
	selectedBranch: string; // "__all__" or branch ID as string
	onBranchChange: (branchId: string) => void;
	className?: string;
}

export function BranchFilterDropdown({
	selectedBranch,
	onBranchChange,
	className,
}: BranchFilterDropdownProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const debouncedSearch = useDebounce(searchQuery, 400);

	// Fetch branches with search
	const { data, isLoading, isError } = useBranches(debouncedSearch, {
		page: 1,
		pageSize: 1000,
	});

	const branches: FilterItem[] = React.useMemo(
		() =>
			(data?.branches?.results || []).map((branch) => ({
				id: branch.id,
				name: branch.branch_name,
			})),
		[data]
	);

	return (
		<SearchableFilterDropdown
			selectedValue={selectedBranch}
			onValueChange={onBranchChange}
			className={className}
			icon={Building2}
			items={branches}
			isLoading={isLoading}
			isError={isError}
			searchPlaceholder="Search branches..."
			allLabel="All Branches"
			loadingLabel="Loading branches..."
			errorLabel="Failed to load branches"
			emptyLabel="No branches available."
			emptySearchLabel="No branches found."
			getItemId={(item) => item.id.toString()}
			getItemName={(item) => item.name}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
		/>
	);
}
