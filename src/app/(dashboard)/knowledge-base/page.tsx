"use client";

import { KnowledgeBaseTable } from "@/components/knowledge-base/knowledge-base-table";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";

export default function KnowledgeBase() {
	return (
		<div>
			<PageHeader
				title="Knowledge Base"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
				]}
			/>
			<div className="p-4 sm:p-8 lg:p-6">
				{/* Page level spacing */}
				<KnowledgeBaseTable />
			</div>
		</div>
	);
}
