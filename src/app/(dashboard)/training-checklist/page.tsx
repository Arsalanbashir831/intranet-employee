import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import TrainingChecklistDetails from "@/components/training-checklist/training-checklist-details";
import ExecutiveTable from "@/components/training-checklist/executive-traning-checklist";

export default function TrainingChecklist() {
  return (
    <div>
      <PageHeader
        title="Training Checklist"
        crumbs={[
          { label: "Pages", href: "#" },
          {
            label: "Training Checklist",
            href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
          },
        ]}
      />
      <TrainingChecklistDetails heading="Training Checklist" type="training" />
      <ExecutiveTable />
    </div>
  );
}
