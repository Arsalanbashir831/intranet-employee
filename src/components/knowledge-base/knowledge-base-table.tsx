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
		viewMoreHref?: string;
		limit?: number;
		showToolbar?: boolean;
		baseHref?: string;
		className?: string; // merge external styles
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

		const tableData = limit ? internalData.slice(0, limit) : internalData;

		const columns: ColumnDef<KnowledgeBaseRow>[] = [
			{
				accessorKey: "folder",
				header: ({ column }) => (
					<CardTableColumnHeader column={column} title="Folder" />
				),
				cell: ({ row }) => (
					<div className="flex items-center gap-2 min-w-0">
						<FolderIcon className="size-4 sm:size-5 text-[#667085] shrink-0" />
						<Link
							href={`${baseHref}/${encodeURIComponent(row.original.folder)}`}
							className="text-sm sm:text-[15px] text-[#1F2937] leading-none hover:underline hover:text-[#D64575] truncate"
							title={row.original.folder}>
							{row.original.folder}
						</Link>
					</div>
				),
			},
			{
				accessorKey: "createdByName",
				header: ({ column }) => (
					<div className="hidden sm:block">
						<CardTableColumnHeader column={column} title="Created By" />
					</div>
				),
				cell: ({ row }) => {
					const name = row.original.createdByName;
					return (
						<div className="hidden sm:flex items-center gap-2">
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
					<div className="hidden md:block">
						<CardTableColumnHeader column={column} title="Date Created" />
					</div>
				),
				cell: ({ getValue }) => (
					<span className="hidden md:inline text-sm text-[#667085] leading-none">
						{String(getValue())}
					</span>
				),
			},
			{
				id: "actions",
				header: () => (
					<span className="hidden md:inline text-sm font-medium text-[#727272]">
						Action
					</span>
				),
				cell: ({ row }) => (
					<Link
						href={`${baseHref}/${encodeURIComponent(row.original.folder)}`}
						className="hidden md:inline text-[#D64575] text-sm font-medium underline leading-none">
						See Details
					</Link>
				),
			},
		];

		return (
			<Card
				className={cn(
					// Base card styling
					"shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-6",
					// Make sure the card can shrink / grow within the wrapper (we’ll cap from outside)
					"w-full h-full",
					className
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
					/>
				) : (
					<div className="mb-3 sm:mb-4 flex items-center justify-between">
						<h3 className="text-base sm:text-lg font-semibold">{title}</h3>
						{viewMoreHref && (
							<Link
								href={viewMoreHref}
								className="text-xs sm:text-sm font-medium text-[#D64575] underline">
								View More
							</Link>
						)}
					</div>
				)}

				{/* Scrollable table area when height is capped */}
				<div className="overflow-y-auto pr-2 pb-2">
					<CardTable<KnowledgeBaseRow, unknown>
						columns={columns}
						data={tableData}
						// Responsive grid template: 1 col on xs (Folder only),
						// add Created By at sm+, then Date/Action at md+
						headerClassName="
							grid-cols-[1fr]
							sm:grid-cols-[1.1fr_0.9fr]
							md:grid-cols-[1.2fr_1fr_0.9fr_0.7fr]
						"
						rowClassName={() => `
							hover:bg-[#FAFAFB]
							grid-cols-[1fr]
							sm:grid-cols-[1.1fr_0.9fr]
							md:grid-cols-[1.2fr_1fr_0.9fr_0.7fr]
						`}
						footer={(table) =>
							limit ? null : <CardTablePagination table={table} />
						}
					/>
				</div>
			</Card>
		);
	}

	export default KnowledgeBaseTable;
