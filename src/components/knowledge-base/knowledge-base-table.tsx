"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { CardTable } from "@/components/common/card-table/card-table";
import { CardTableColumnHeader } from "@/components/common/card-table/card-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PaginationState } from "@/lib/pagination-utils";

/* ---------------- Types ---------------- */
export type KnowledgeBaseRow = {
	id: string;
	folder: string;
	createdByName: string;
	createdByAvatar?: string;
	dateCreated: string; // YYYY-MM-DD
	type?: "folder" | "file"; // Added type to distinguish between folders and files
	fileUrl?: string; // Added file URL for downloading files
};

type Props = {
	data?: KnowledgeBaseRow[];
	title?: string;
	viewMoreHref?: string;
	limit?: number;
	showToolbar?: boolean;
	className?: string;
	onRowClick?: (row: KnowledgeBaseRow) => void; // Added onRowClick handler
	pagination?: {
		pageIndex: number;
		pageSize: number;
		totalCount: number;
		onPaginationChange: (pagination: PaginationState) => void;
	};
	onSearch?: (searchTerm: string) => void; // Added search handler
	searchTerm?: string; // Added search term prop
};

/* --------------- Demo rows --------------- */
const defaultRows: KnowledgeBaseRow[] = [];

/* --------------- Component --------------- */
export function KnowledgeBaseTable({
	data,
	title = "Knowledge Base",
	viewMoreHref,
	limit,
	showToolbar = true,
	className,
	onRowClick,
	pagination,
	onSearch,
	searchTerm = "",
}: Props) {
	// Use the provided title prop directly
	const displayTitle = title;

	const isControlled = data !== undefined;
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "folder", desc: false },
	]);

	// Handler for dropdown sort change (always ascending)
	const handleSortChange = (v: string) => {
		setSorting([{ id: v, desc: false }]);
	};

	// Use TanStack Table's sorting model to sort data
	const sortedData = React.useMemo(() => {
		const arr = isControlled ? [...data!] : [...defaultRows];
		if (sorting.length === 0) return arr;
		const { id, desc } = sorting[0];
		const sortKey = id as keyof KnowledgeBaseRow;
		arr.sort((a, b) => {
			const av = (a[sortKey] ?? "") as string;
			const bv = (b[sortKey] ?? "") as string;
			const cmp = String(av).localeCompare(String(bv));
			return desc ? -cmp : cmp;
		});
		return arr;
	}, [data, isControlled, sorting]);

	const tableData = limit ? sortedData.slice(0, limit) : sortedData;

	const handleSearchChange = (value: string) => {
		if (onSearch) {
			onSearch(value);
		}
	};

	const columns: ColumnDef<KnowledgeBaseRow>[] = [
		{
			accessorKey: "folder",
			header: ({ column }) => (
				<CardTableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => {
				const isFolder = row.original.type === "folder";
				const Icon = isFolder ? FolderIcon : FileIcon;
				const iconColor = isFolder ? "text-[#667085]" : "text-[#E5004E]";

				// Handle row click if provided
				const handleClick = () => {
					if (onRowClick) {
						onRowClick(row.original);
					}
				};

				return (
					<div
						className="flex items-center gap-2 min-w-0 cursor-pointer"
						onClick={handleClick}>
						<Icon className={`size-4 sm:size-5 shrink-0 ${iconColor}`} />
						<span
							className="text-sm sm:text-[15px] text-[#1F2937] leading-none hover:underline hover:text-[#E5004E] truncate"
							title={row.original.folder}>
							{row.original.folder}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "createdByName",
			header: ({ column }) => (
				<div className="hidden sm:block">
					<CardTableColumnHeader column={column} title="Created By" />
				</div>
			),
			cell: ({ row }) => {
				const name = row.original.createdByName || "Cartwright King";
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
			cell: ({ getValue }) => {
				const raw = getValue() as string;
				let formatted = raw;
				if (raw) {
					const date = new Date(raw);
					if (!isNaN(date.getTime())) {
						// Format as YYYY-MM-DD
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, "0");
						const day = String(date.getDate()).padStart(2, "0");
						formatted = `${year}-${month}-${day}`;
					}
				}
				return (
					<span className="hidden md:inline text-sm text-[#667085] leading-none">
						{formatted}
					</span>
				);
			},
		},
		{
			id: "actions",
			header: () => (
				<span className="hidden md:inline text-sm font-medium text-[#727272]">
					Action
				</span>
			),
			cell: ({ row }) => {
				const isFolder = row.original.type === "folder";

				// Handle action click
				const handleActionClick = (e: React.MouseEvent) => {
					e.stopPropagation(); // Prevent row click event
					if (onRowClick) {
						onRowClick(row.original);
					}
				};

				return (
					<button
						onClick={handleActionClick}
						className="hidden md:inline text-[#D64575] text-sm font-medium underline leading-none bg-transparent border-0 cursor-pointer">
						{isFolder ? "Open" : "Download"}
					</button>
				);
			},
		},
	];

	return (
		<Card
			className={cn(
				"shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5",
				"w-full h-full",
				className
			)}>
			{showToolbar ? (
				<CardTableToolbar
					title={displayTitle}
					onSearchChange={handleSearchChange}
					searchValue={searchTerm}
					sortOptions={[
						{ label: "Name", value: "folder" },
						{ label: "Created By", value: "createdByName" },
						{ label: "Date Created", value: "dateCreated" },
					]}
					activeSort={sorting[0]?.id || "folder"}
					onSortChange={handleSortChange}
					hasFilter={false}
					className="flex sm:flex-col sm:items-start"
					placeholder="Search folders and files..."
				/>
			) : (
				<div className="mb-3 sm:mb-4 flex items-center justify-between">
					<h3 className="text-base sm:text-lg font-semibold">{displayTitle}</h3>
					{viewMoreHref && (
						<Link
							href={viewMoreHref}
							className="text-xs sm:text-sm font-medium text-[#E5004E] underline">
							View More
						</Link>
					)}
				</div>
			)}

			<div className="overflow-y-auto pr-2 pb-2">
				{tableData.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						{searchTerm ? "No items match your search" : "No items found"}
					</div>
				) : (
					<CardTable<KnowledgeBaseRow, unknown>
						columns={columns}
						data={tableData}
						headerClassName="
			grid-cols-[1fr]
			sm:grid-cols-[1.1fr_0.9fr]
			md:grid-cols-[1.2fr_1fr_0.9fr_0.7fr]
		  "
						rowClassName="hover:bg-[#FAFAFB] grid-cols-[1fr] sm:grid-cols-[1.1fr_0.9fr] md:grid-cols-[1.2fr_1fr_0.9fr_0.7fr] cursor-pointer"
						onRowClick={
							onRowClick ? (row) => onRowClick(row.original) : undefined
						}
						sorting={sorting}
						onSortingChange={setSorting}
						footer={(table) =>
							pagination ? (
								<CardTablePagination
									table={table}
									pageIndex={pagination.pageIndex}
									pageSize={pagination.pageSize}
									totalCount={pagination.totalCount}
									onPaginationChange={pagination.onPaginationChange}
								/>
							) : limit ? null : (
								<CardTablePagination table={table} />
							)
						}
					/>
				)}
			</div>
		</Card>
	);
}

export default KnowledgeBaseTable;
