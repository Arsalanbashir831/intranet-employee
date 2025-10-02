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
import { TableSearch } from "@/components/common/card-table/table-search";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { useMemo, useState } from "react";

/* ---------------- Types & Data ---------------- */
interface TeamMember {
	id: string;
	name: string;
	designation: string;
	image: string;
}

const teamData: TeamMember[] = [
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
	{
		id: "6",
		name: "Lindsey Dokidis",
		designation: "Software Engineer",
		image: "/images/team-member-6.png",
	},
	{
		id: "7",
		name: "Hanna Dias",
		designation: "Software Engineer",
		image: "/images/team-member-7.png",
	},
	{
		id: "8",
		name: "Ryan Gouse",
		designation: "Software Engineer",
		image: "/images/team-member-8.png",
	},
];

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
	const [query] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 8;

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return q
			? teamData.filter((m) => m.name.toLowerCase().includes(q))
			: teamData;
	}, [query]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

	const table = useReactTable({
		data: filtered,
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

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Teams"
				crumbs={[
					{ label: "Pages" },
					{ label: "Teams", href: ROUTES.DASHBOARD.TEAMS },
				]}
			/>

			{/* Page rails and breathing room (matches figma spacing at all widths) */}
			<main className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-1 min-[1440px]:px-12 min-[1920px]:px-16 min-[2560px]:px-24 py-6 sm:py-8 lg:py-10 min-[1440px]:py-12 min-[1920px]:py-14 min-[2560px]:py-16 max-w-[1180px] sm:max-w-[1240px] md:max-w-[1320px] lg:max-w-[1360px] min-[1440px]:max-w-[1400px] min-[1920px]:max-w-[1680px] min-[2560px]:max-w-[1920px]">
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-6 lg:p-4">
					<h1 className="text-[22px] sm:text-2xl md:text-3xl font-semibold text-[#1F2937]">
						My Team
					</h1>

					{/* Controls row */}
					<div className="mt-4 flex flex-col gap-0 md:flex-row md:items-center">
						<div className="flex-1 max-w-sm">
							<TableSearch placeholder="Search by Name" />
						</div>

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
										description="There are many variations of passages of Lorem Ipsum available."
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
