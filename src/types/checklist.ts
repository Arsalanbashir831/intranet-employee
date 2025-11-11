/**
 * Checklist component types
 */

// Shared file type used across checklist components
export type ChecklistFile = {
  id: number;
  file: string;
  uploaded_at: string;
};

// Shared checklist task props (used by dialog, drawer, etc.)
export type ChecklistTaskProps = {
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  files?: ChecklistFile[];
};

// Checklist Dialog Types
export type ChecklistDialogProps = ChecklistTaskProps;

export type ChecklistTaskDialogProps = ChecklistTaskProps;

// Checklist Drawer Types
export type ChecklistDrawerProps = ChecklistTaskProps;

export type ChecklistTaskDrawerProps = ChecklistTaskProps;

// Checklist Component Types
export type ChecklistProps = {
  title: string;
  viewMoreLink?: string;
  type: "task" | "training";
};
