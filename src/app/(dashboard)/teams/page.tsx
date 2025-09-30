"use client";

import { PageHeader } from "@/components/common/page-header";
import TeamsCard from "@/components/teams/teams-card";
import { ROUTES } from "@/hooks/constants/routes";
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
import { TableSearch } from "@/components/card-table/table-search";
import { CardTablePagination } from "@/components/card-table/card-table-pagination";
import { useMemo, useState } from "react";

const teamData = [
	{
		id: "1",
		name: "Jocelyn Schleifer",
		designation: "Manager",
		image: "/images/team-member-1.png",
	},
	{
		id: "2",
		name: "John Doe",
		designation: "Developer",
		image: "/images/team-member-2.png",
	},
	{
		id: "3",
		name: "Martin Donin",
		designation: "Lead",
		image: "/images/team-member-3.png",
	},
	{
		id: "4",
		name: "Jordyn Septimus",
		designation: "Software Engineer",
		image: "/images/team-member-4.png",
	},
	{
		id: "5",
		name: "Marilyn Levin",
		designation: "Software Engineer",
		image: "/images/team-member-5.png",
	},
	// add more if needed for pagination testing
];

const columnHelper = createColumnHelper<any>();

const columns = [
	columnHelper.accessor("id", {
		cell: (info) => info.getValue(),
		header: () => <span>ID</span>,
	}),
	columnHelper.accessor("name", {
		cell: (info) => info.getValue(),
		header: () => <span>Name</span>,
	}),
	columnHelper.accessor("designation", {
		cell: (info) => info.getValue(),
		header: () => <span>Designation</span>,
	}),
];

export default function Teams() {
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 8;

	// 🔎 Search filter
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return q
			? teamData.filter((a) => a.name.toLowerCase().includes(q))
			: teamData;
	}, [query]);

	// 📄 Pagination math
	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

	// ⚡ Table setup with manual pagination
	const table = useReactTable({
		data: filtered,
		columns,
		getCoreRowModel: getCoreRowModel(),
		pageCount,
		manualPagination: true,
		state: {
			pagination: {
				pageIndex: page - 1,
				pageSize,
			},
		},
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				const newState = updater({ pageIndex: page - 1, pageSize });
				setPage(newState.pageIndex + 1);
			} else {
				setPage(updater.pageIndex + 1);
			}
		},
	});

	return (
		<div>
			{/* Page Header */}
			<PageHeader
				title="Teams"
				crumbs={[
					{ label: "Pages" },
					{ label: "Teams", href: ROUTES.DASHBOARD.TEAMS },
				]}
			/>

			<div className="p-6">
				{/* Main Content Card */}
				<div className="bg-white rounded-2xl shadow-sm p-6">
					<h1 className="text-3xl font-bold mb-6">My Team</h1>

					{/* Search + Filters */}
					<div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
						{/* Search */}
						<div className="flex-1 max-w-sm">
							<TableSearch placeholder="Search by Name" />
						</div>

						{/* Filters */}
						<div className="flex flex-wrap gap-3">
							<Select>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Expertise" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="frontend">Frontend</SelectItem>
									<SelectItem value="backend">Backend</SelectItem>
									<SelectItem value="fullstack">Full Stack</SelectItem>
								</SelectContent>
							</Select>

							<Select>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="lahore">Lahore</SelectItem>
									<SelectItem value="karachi">Karachi</SelectItem>
									<SelectItem value="islamabad">Islamabad</SelectItem>
								</SelectContent>
							</Select>

							<Select>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="manager">Manager</SelectItem>
									<SelectItem value="developer">Developer</SelectItem>
									<SelectItem value="designer">Designer</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Cards Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{pageItems.map((member) => (
							<Link key={member.id} href={`/teams/${member.id}`}>
								<TeamsCard
									image={member.image}
									name={member.name}
									designation={member.designation}
									description="There are many variations of passages of Lorem Ipsum available."
								/>
							</Link>
						))}
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-end mt-6">
						<CardTablePagination table={table} />
					</div>
				</div>
			</div>
		</div>
	);
}
