/**
 * Training Checklist component types
 */

// Import and re-export types from new-hire.ts for convenience
import type { ChecklistTask } from "@/types/new-hire";

export type { AssignedEmployee, ExecutiveTask } from "@/types/new-hire";

// Alias ChecklistTask as TrainingChecklistTask for clarity
export type TrainingChecklistTask = ChecklistTask;

// Training Checklist Details component props
export type TrainingChecklistDetailsProps = {
  heading?: string;
  type?: "task" | "training";
};
