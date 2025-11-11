/**
 * Knowledge Base Table component types
 */

import type { KnowledgeBaseRow } from "@/types/knowledge-base";
import type { PaginationState } from "@/lib/pagination-utils";

export type KnowledgeBaseTableProps = {
	data?: KnowledgeBaseRow[];
	title?: string;
	viewMoreHref?: string;
	limit?: number;
	showToolbar?: boolean;
	className?: string;
	onRowClick?: (row: KnowledgeBaseRow) => void;
	pagination?: {
		pageIndex: number;
		pageSize: number;
		totalCount: number;
		onPaginationChange: (pagination: PaginationState) => void;
	};
	onSearch?: (searchTerm: string) => void;
	searchTerm?: string;
};

