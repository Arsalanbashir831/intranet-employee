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
import { useExecutives } from "@/hooks/queries/use-executive-members";

/* ---------------- Types & Data ---------------- */
interface ExecutiveMember {
	id: string;
	name: string;
	role: string;
	image: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	education: string;
}

const columnHelper = createColumnHelper<ExecutiveMember>();
const columns = [
	columnHelper.accessor("id", {
		header: () => <span>ID</span>,
		cell: (i) => i.getValue(),
	}),
	columnHelper.accessor("name", {
		header: () => <span>Name</span>,
		cell: (i) => i.getValue(),
	}),
	columnHelper.accessor("role", {
		header: () => <span>Role</span>,
		cell: (i) => i.getValue(),
	}),
];

export default function Executives() {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 400);
	const [page, setPage] = useState(1);
	const pageSize = 8;

	const { data, isLoading, isError } = useExecutives({
		page,
		page_size: pageSize,
		search: debouncedQuery,
	});

	const executiveData: ExecutiveMember[] =
		data?.results?.map((executive) => ({
			id: executive.id.toString(),
			name: executive.name,
			role: executive.role,
			image: executive.profile_picture || "/images/avatar.jpg",
			email: executive.email,
			phone: executive.phone,
			address: executive.address,
			city: executive.city,
			education: executive.education,
		})) || [];

	const pageCount = data ? Math.max(1, Math.ceil(data.count / pageSize)) : 1;
	const pageItems = executiveData;

	const table = useReactTable({
		data: executiveData,
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

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Loading executive members...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Error loading executive members</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Executives"
				crumbs={[
					{ label: "Pages", href: "#" },
					{ label: "Executives", href: "/executives" },
				]}
			/>

			<main className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-6 lg:p-4">
					<h1 className="text-2xl font-semibold text-[#1F2937]">
						Executive Members
					</h1>

					<div className="mt-4 flex flex-col gap-0 md:flex-row md:items-center">
						<div className="flex-1 max-w-sm">
							<TableSearch
								placeholder="Search by Name"
								value={query}
								onChange={(value) => {
									setQuery(value);
									setPage(1);
								}}
							/>
						</div>
					</div>

					<div className="mt-6 grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 content-start">
						{pageItems.map((m) => (
							<div key={m.id} className="w-full">
								<Link href={`/executives/${m.id}`} className="block">
									<TeamsCard
										image={m.image}
										name={m.name}
										designation={m.role}
										description={m.education}
										className="w-full mx-auto xl:max-w-[320px] xl:h-[370px]"
										topClassName="relative w-full aspect-[4/3] sm:aspect-[16/10] xl:aspect-auto xl:h-[230px]"
										imgClassName="object-cover"
									/>
								</Link>
							</div>
						))}
					</div>

					<div className="mt-6 flex items-center justify-end">
						<CardTablePagination table={table} />
					</div>
				</section>
			</main>
		</div>
	);
}
