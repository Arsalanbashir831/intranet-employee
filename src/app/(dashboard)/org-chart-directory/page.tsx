"use client";

import { PageHeader } from "@/components/common/page-header";
import TeamsCard from "@/components/teams/teams-card";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TableSearch } from "@/components/common/card-table/table-search";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/contexts/auth-context";
import {
	useAllEmployees,
	useDepartmentEmployees,
	useBranchDeptEmployees,
} from "@/hooks/queries/use-employees";

import { FilterDrawer } from "@/components/common/card-table/filter-drawer";
import {
	DepartmentFilter,
	BranchDepartmentFilter,
} from "@/components/common/card-table/filter-components";
import { Button } from "@/components/ui/button";

/* ---------------- Types & Data ---------------- */
interface TeamMember {
	id: string;
	name: string;
	designation: string;
	image: string;
	email: string;
	phone: string;
	branch: string;
	department: string;
	education: string;
	bio: string;
}

const columnHelper = createColumnHelper<TeamMember>();
const columns = [
	columnHelper.accessor("id", {
		header: () => <span>ID</span>,
		cell: (i) => i.getValue(),
	}),
	columnHelper.accessor("name", {
		header: () => <span>Name</span>,
		cell: (i) => i.getValue(),
	}),
	columnHelper.accessor("designation", {
		header: () => <span>Designation</span>,
		cell: (i) => i.getValue(),
	}),
];

export default function OrgChartDirectoryPage() {
	const { user } = useAuth();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 400);
	const [page, setPage] = useState(1);
	const pageSize = 8;

	// Filter drawer state
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState<{
		department?: string;
		branch_department?: string;
	}>({});

	// Determine which hook to use based on filters
	let data, isLoading, isError;
	const hasDepartment = filters.department && filters.department !== "__all__";
	const hasBranchDept =
		filters.branch_department && filters.branch_department !== "__all__";

	if (hasDepartment) {
		({ data, isLoading, isError } = useDepartmentEmployees(
			filters.department!,
			{ page, page_size: pageSize, search: debouncedQuery }
		));
	} else if (hasBranchDept) {
		({ data, isLoading, isError } = useBranchDeptEmployees(
			filters.branch_department!,
			{ page, page_size: pageSize, search: debouncedQuery }
		));
	} else {
		({ data, isLoading, isError } = useAllEmployees({
			page,
			page_size: pageSize,
			search: debouncedQuery,
		}));
	}

	// Transform API data to match component structure
	const teamData: TeamMember[] =
		data?.employees?.results?.map((employee) => ({
			id: employee.id.toString(),
			name: employee.emp_name,
			designation: employee.role,
			image: employee.profile_picture || "/images/avatar.jpg",
			email: employee.email,
			phone: employee.phone,
			branch: employee.branch_department.branch.branch_name,
			department: employee.branch_department.department.dept_name,
			bio: employee?.bio || "",
			education: employee?.education || "",
		})) || [];

	const pageCount = data?.employees
		? Math.max(1, Math.ceil(data.employees.count / pageSize))
		: 1;
	const pageItems = teamData;

	const table = useReactTable({
		data: teamData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		pageCount,
		manualPagination: true,
		state: { pagination: { pageIndex: page - 1, pageSize } },
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				const next = updater({ pageIndex: page - 1, pageSize });
				setPage(next.pageIndex + 1);
			} else {
				setPage(updater.pageIndex + 1);
			}
		},
	});

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Loading team members...</div>
			</div>
		);
	}

	// Show error state
	if (isError) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Error loading team members</div>
			</div>
		);
	}

	// Instead of full-page empty state, show message in cards grid

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Org Chart/Directory"
				crumbs={[
					{ label: "Pages", href: "#" },
					{
						label: "Org Chart/Directory",
						href: ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY,
					},
				]}
			/>

			{/* Page rails and breathing room (matches figma spacing at all widths) */}
			<main className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-6 lg:p-4">
					<h1 className="text-2xl font-semibold text-[#1F2937]">
						Org Chart/Directory
					</h1>

					{/* Controls row */}
					<div className="mt-4 flex flex-col gap-2 md:gap-0 md:flex-row md:items-center">
						<div className="flex-1 max-w-sm">
							<TableSearch
								placeholder="Search by Name"
								value={query}
								onChange={(value) => {
									setQuery(value);
									setPage(1); // Reset to first page when searching
								}}
							/>
						</div>
						<div className="flex flex-wrap gap-3 items-center">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setIsFilterOpen(true)}>
								Filters
							</Button>
						</div>
					</div>

					{/* Filter Drawer */}
					<FilterDrawer
						open={isFilterOpen}
						onOpenChange={setIsFilterOpen}
						onReset={() => {
							setFilters({});
							setPage(1);
						}}
						showFilterButton={false}
						title="Filter Employees"
						description="Filter employees by department or branch department">
						<div className="space-y-6 py-4">
							<DepartmentFilter
								value={filters.department || "__all__"}
								onValueChange={(value: string) => {
									setFilters((prev) => ({ ...prev, department: value }));
									setPage(1);
								}}
							/>
							<BranchDepartmentFilter
								value={filters.branch_department || "__all__"}
								onValueChange={(value: string) => {
									setFilters((prev) => ({ ...prev, branch_department: value }));
									setPage(1);
								}}
							/>
						</div>
					</FilterDrawer>

					{/* Cards grid or empty state */}
					<div className="mt-6 min-w-0">
						{teamData.length === 0 ? (
							<div className="w-full flex items-center justify-center py-16 text-gray-500 text-lg">
								No employee data available
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 content-start">
								{pageItems.map((m) => (
									<div key={m.id} className="w-full">
										<Link
											href={`${ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}/${m.id}`}
											className="block">
											<TeamsCard
												image={m.image}
												name={m.name}
												designation={m.designation}
												description={
													m.bio || m.education || "No description available"
												}
												className="w-full mx-auto xl:max-w-[320px] xl:h-[370px]"
												topClassName="relative w-full aspect-[4/3] sm:aspect-[16/10] xl:aspect-auto xl:h-[230px]"
												imgClassName="object-cover"
											/>
										</Link>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Pagination aligned to the right */}
					<div className="mt-6 flex items-center justify-end">
						<CardTablePagination table={table} />
					</div>
				</section>
			</main>
		</div>
	);
}
