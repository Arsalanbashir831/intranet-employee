"use client";

import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import TrainingChecklistDetails from "@/components/training-checklist/training-checklist-details";
import ExecutiveTable from "@/components/training-checklist/executive-traning-checklist";
import { useAuth } from "@/contexts/auth-context";

export default function TrainingChecklist() {
  const { user } = useAuth();

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
      {user?.isExecutive ? (
        <ExecutiveTable />
      ) : (
        <TrainingChecklistDetails heading="Training Checklist" type="training" />
      )}
    </div>
  );
}
