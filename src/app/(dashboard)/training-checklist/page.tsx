import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/hooks/constants/routes";
import TaskChecklistDeatils from "@/components/common/task-checklist-details";

export default function TrainingChecklist() {
	return (
		<div>
			<PageHeader
				title="Training Checklist"
				crumbs={[
					{ label: "Pages" },
					{
						label: "Task Checklist",
						href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
					},
				]}
			/>
			<TaskChecklistDeatils heading="Training Checklist" />
		</div>
	);
}
