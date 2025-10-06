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
import { useAuth } from "@/contexts/auth-context";
import { useBranchDepartmentEmployees } from "@/hooks/queries/use-departments";

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

export default function Teams() {
	const { user } = useAuth();
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 8;
	
	// Fetch team members based on user's branch department with search query
	const { data, isLoading, isError } = useBranchDepartmentEmployees(
		user?.branchDepartmentId || 0,
		{ page, pageSize },
		query ? { search: query } : undefined // Pass search query as a parameter
	);
	
	// Transform API data to match component structure
	const teamData: TeamMember[] = data?.employees?.results?.map(employee => ({
		id: employee.id.toString(),
		name: employee.emp_name,
		designation: employee.role,
		image: employee.profile_picture || "/images/avatar.jpg",
		email: employee.email,
		phone: employee.phone,
		branch: employee.branch_department.branch.branch_name,
		department: employee.branch_department.department.dept_name,
		education: employee.education
	})) || [];

	const pageCount = data ? Math.max(1, Math.ceil(data.employees.count / pageSize)) : 1;
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
	
	// Show empty state
	if (!user?.branchDepartmentId) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>No team data available</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Teams"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Teams", href: ROUTES.DASHBOARD.TEAMS },
				]}
			/>

			{/* Page rails and breathing room (matches figma spacing at all widths) */}
			<main className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-6 lg:p-4">
					<h1 className="text-2xl font-semibold text-[#1F2937]">
						My Team
					</h1>

					{/* Controls row */}
					<div className="mt-4 flex flex-col gap-0 md:flex-row md:items-center">
						<div className="flex-1 max-w-sm">
							<TableSearch 
								placeholder="Search by Name" 
								onChange={(value) => {
									setQuery(value);
									setPage(1); // Reset to first page when searching
								}}
							/>
						</div>

						<div className="flex flex-wrap gap-3">
							<Select>
								<SelectTrigger className="w-40 border border-gray-300 rounded-md">
									<SelectValue placeholder="Expertise" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="frontend">Frontend</SelectItem>
									<SelectItem value="backend">Backend</SelectItem>
									<SelectItem value="fullstack">Full Stack</SelectItem>
								</SelectContent>
							</Select>

							<Select>
								<SelectTrigger className="w-40 border border-gray-300 rounded-md">
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="lahore">Lahore</SelectItem>
									<SelectItem value="karachi">Karachi</SelectItem>
									<SelectItem value="islamabad">Islamabad</SelectItem>
								</SelectContent>
							</Select>

							{/* <Select>
								<SelectTrigger className="w-40 border border-gray-300 rounded-md">
									<SelectValue placeholder="Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="manager">Manager</SelectItem>
									<SelectItem value="developer">Developer</SelectItem>
									<SelectItem value="designer">Designer</SelectItem>
								</SelectContent>
							</Select> */}
						</div>
					</div>

					{/* Cards grid: 1 / 2 / 3 / 4 columns. At xl, cards lock to 320×500 like Figma. */}
					{/* Cards grid */}
					<div className="mt-6 grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 content-start">
						{pageItems.map((m) => (
							<div key={m.id} className="w-full">
								<Link href={`/teams/${m.id}`} className="block">
									<TeamsCard
										image={m.image}
										name={m.name}
										designation={m.designation}
										description={m.education}
										className="w-full mx-auto xl:max-w-[320px] xl:h-[370px]"
										topClassName="relative w-full aspect-[4/3] sm:aspect-[16/10] xl:aspect-auto xl:h-[230px]"
										imgClassName="object-cover"
									/>
								</Link>
							</div>
						))}
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