import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import TaskChecklistDetails from "@/components/common/task-checklist-details";
import ExecutiveTable from "@/components/common/executive-table";

export default function TrainingChecklist() {
	return (
		<div>
			<PageHeader
				title="Training Checklist"
				crumbs={[
					{ label: "Pages", href:'#' },
					{
						label: "Training Checklist",
						href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
					},
				]}
			/>
			<TaskChecklistDetails heading="Training Checklist" type="training" />
			<ExecutiveTable />
		</div>
	);
}