// components/knowledge-base/knowledge-base-table.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CardTable } from "@/components/card-table/card-table";
import { CardTableColumnHeader } from "@/components/card-table/card-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CardTableToolbar } from "@/components/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/card-table/card-table-pagination";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ✅ row type
export type KnowledgeBaseRow = {
	id: string;
	folder: string;
	createdByName: string;
	createdByAvatar?: string;
	dateCreated: string; // YYYY-MM-DD
};

// demo rows when no data is passed
const defaultRows: KnowledgeBaseRow[] = [
	{
		id: "1",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
	{
		id: "2",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
	{
		id: "3",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
	{
		id: "4",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
];

type Props = {
	data?: KnowledgeBaseRow[];
	title?: string;
	viewMoreHref?: string; // e.g. ROUTES.DASHBOARD.KNOWLEDGE_BASE
	limit?: number; // e.g. 4 for dashboard widget
	showToolbar?: boolean; // default true; set false for compact widget
	baseHref?: string; // prefix for row links; default "/knowledge-base"
	className?: string;
};

export function KnowledgeBaseTable({
	data,
	title = "Knowledge Base",
	viewMoreHref,
	limit,
	showToolbar = true,
	baseHref = "/knowledge-base",
	className,
}: Props) {
	const isControlled = data !== undefined;
	const [sortedBy, setSortedBy] = React.useState<string>("folder");
	const [internalData, setInternalData] = React.useState<KnowledgeBaseRow[]>(
		isControlled ? data! : defaultRows
	);

	React.useEffect(() => {
		if (isControlled) {
			setInternalData(data!);
			return;
		}
		const copy = [...defaultRows];
		copy.sort((a, b) => {
			const key = sortedBy as keyof KnowledgeBaseRow;
			const av = (a[key] ?? "") as string;
			const bv = (b[key] ?? "") as string;
			return String(av).localeCompare(String(bv));
		});
		setInternalData(copy);
	}, [sortedBy, data, isControlled]);

	// slice if a limit is provided (dashboard widget)
	const tableData = limit ? internalData.slice(0, limit) : internalData;

	const columns: ColumnDef<KnowledgeBaseRow>[] = [
		{
			accessorKey: "folder",
			header: ({ column }) => (
				<CardTableColumnHeader column={column} title="Folder" />
			),
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<FolderIcon className="size-5 text-[#667085]" />
					<Link
						href={`${baseHref}/${encodeURIComponent(row.original.folder)}`}
						className="text-sm text-[#1F2937] leading-none hover:underline hover:text-[#D64575]">
						{row.original.folder}
					</Link>
				</div>
			),
		},
		{
			accessorKey: "createdByName",
			header: ({ column }) => (
				<CardTableColumnHeader column={column} title="Created By" />
			),
			cell: ({ row }) => {
				const name = row.original.createdByName;
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage
								src={row.original.createdByAvatar || "/images/logo-circle.png"}
								alt={name}
							/>
							<AvatarFallback className="text-[10px] leading-none">
								{name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm text-[#1F2937] leading-none">{name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "dateCreated",
			header: ({ column }) => (
				<CardTableColumnHeader column={column} title="Date Created" />
			),
			cell: ({ getValue }) => (
				<span className="text-sm text-[#667085] leading-none">
					{String(getValue())}
				</span>
			),
		},
		{
			id: "actions",
			header: () => (
				<span className="text-sm font-medium text-[#727272]">Action</span>
			),
			cell: ({ row }) => (
				<Link
					href={`${baseHref}/${encodeURIComponent(row.original.folder)}`}
					className="text-[#D64575] text-sm font-medium underline leading-none">
					See Details
				</Link>
			),
		},
	];

	return (
		<Card
			className={cn(
				"border-[#FFF6F6] p-6 shadow-none",
				className // 👈 merge external styles
			)}>
			{showToolbar ? (
				<CardTableToolbar
					title={title}
					onSearchChange={() => {}}
					sortOptions={[
						{ label: "Folder", value: "folder" },
						{ label: "Created By", value: "createdByName" },
						{ label: "Date Created", value: "dateCreated" },
					]}
					activeSort={sortedBy}
					onSortChange={(v) => setSortedBy(v)}
					onFilterClick={() => {}}
					className="flex sm:flex-col sm:items-start"
					// you can optionally pass a rightSlot prop here if your toolbar supports it
				/>
			) : (
				// Compact header for dashboard widget
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold">{title}</h3>
					{viewMoreHref && (
						<Link
							href={viewMoreHref}
							className="text-sm font-medium text-[#D64575] underline">
							View More
						</Link>
					)}
				</div>
			)}

			<CardTable<KnowledgeBaseRow, unknown>
				columns={columns}
				data={tableData}
				headerClassName="grid-cols-[1.4fr_1fr_1fr_0.8fr]"
				rowClassName={() =>
					"hover:bg-[#FAFAFB] grid-cols-[1.4fr_1fr_1fr_0.8fr]"
				}
				footer={(table) =>
					// hide pagination when limited/compact
					limit ? null : <CardTablePagination table={table} />
				}
			/>
		</Card>
	);
}

export default KnowledgeBaseTable;
