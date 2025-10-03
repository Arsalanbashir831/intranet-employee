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
			<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				{/* Page level spacing */}
				<KnowledgeBaseTable />
			</div>
		</div>
	);
}
