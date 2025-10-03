"use client";

import TaskChecklistDeatils from "@/components/common/task-checklist-details";
import { ROUTES } from "@/constants/routes";
import { PageHeader } from "@/components/common/page-header";

export default function TaskChecklist() {
	return (
		<div>
			<PageHeader
				title="Task Checklist"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Task Checklist", href: ROUTES.DASHBOARD.TASK_CHECKLIST },
				]}
			/>
			<TaskChecklistDeatils heading="Task Checklist" />
		</div>
	);
}
