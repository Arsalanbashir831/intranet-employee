"use client";

import TaskChecklistDeatils from "@/components/task/task-checklist-details";
import { ROUTES } from "@/hooks/constants/routes";
import { PageHeader } from "@/components/common/page-header";

export default function TaskChecklist() {
	return (
		<div>
			<PageHeader
				title="Task Checklist"
				crumbs={[
					{ label: "Pages" },
					{ label: "Task Checklist", href: ROUTES.DASHBOARD.TASK_CHECKLIST },
				]}
			/>
			<TaskChecklistDeatils heading="Task Checklist" />
		</div>
	);
}
