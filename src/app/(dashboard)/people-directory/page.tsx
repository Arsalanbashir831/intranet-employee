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
import { TableSearch } from "@/components/common/card-table/table-search";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
	useAllEmployees,
} from "@/hooks/queries/use-employees";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Users } from "lucide-react";


/* ---------------- Types & Data ---------------- */
interface TeamMember {
	id: string;
	name: string;
	designation: string;
	role: string;
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
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 400);
	const [page, setPage] = useState(1);
	const pageSize = 8;

	// Role filter state
	const [selectedRole, setSelectedRole] = useState<string>("__all__");

	// Build query parameters
	const queryParams: Record<string, string | number | boolean> = {
		page,
		page_size: pageSize,
		search: debouncedQuery,
	};

	// Add role filter if selected
	if (selectedRole && selectedRole !== "__all__") {
		queryParams.role = selectedRole;
	}

	// Use the single employees query with filters
	const { data, isLoading, isError } = useAllEmployees(queryParams);

	// Transform API data to match component structure
	const teamData: TeamMember[] =
		data?.employees?.results?.map((employee) => ({
			id: employee.id.toString(),
			name: employee.emp_name,
			designation: employee.role,
			image: employee.profile_picture || "/logos/profile-circle.svg",
			email: employee.email,
			phone: employee.phone,
			role: employee.role,
			branch: employee.branch_departments?.[0]?.branch?.branch_name || "",
			department: employee.branch_departments?.[0]?.department?.dept_name || "",
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
				title="People Directory"
				crumbs={[
					{ label: "Pages", href: "#" },
					{
						label: "People Directory",
						href: ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY,
					},
				]}
			/>

			{/* Page rails and breathing room (matches figma spacing at all widths) */}
			<main className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-6 lg:p-4">
					<h1 className="text-2xl font-semibold text-[#1F2937]">
						My Team
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
							{/* Role Filter Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="gap-1 rounded-[4px]">
										<Users className="size-3.5 mr-1" /> Filter by Role
										<ChevronDown className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuRadioGroup
										value={selectedRole}
										onValueChange={(value) => {
											setSelectedRole(value);
											setPage(1); // Reset to first page when filtering
										}}>
										<DropdownMenuRadioItem
											value="__all__"
											className="py-2 text-[15px]">
											All Roles
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="1"
											className="py-2 text-[15px]">
											Junior Staff
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="2"
											className="py-2 text-[15px]">
											Mid Senior Staff
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="3"
											className="py-2 text-[15px]">
											Senior Staff
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="4"
											className="py-2 text-[15px]">
											Manager
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>


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
												role={m.role}
												branch={m.branch}
												department={m.department}
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
