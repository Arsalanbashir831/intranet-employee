/**
 * New hire and training checklist service types
 */

export type AttachmentStatus = "to_do" | "in_progress" | "done";

export type AttachmentStatusDetail = {
  id: number;
  employee: number;
  attachment: number;
  employee_details: {
    id: number;
    emp_name: string;
    email: string;
    phone: string;
    role: string;
    bio: string | null;
    profile_picture: string | null;
    branch_department: number;
  };
  attachment_details: {
    id: number;
    checklist: number;
    title: string;
    detail: string;
    type: "task" | "training";
    created_at: string;
    files: {
      id: number;
      attachment: number;
      file: string;
      uploaded_at: string;
    }[];
  };
  status: AttachmentStatus;
  status_display: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedAttachmentStatusList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttachmentStatusDetail[];
};

export type AttachmentStatusUpdateRequest = {
  status: AttachmentStatus;
};

export type AttachmentStatusUpdateResponse = AttachmentStatusDetail;

export type ExecutiveTrainingChecklistAssignedTo = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  branches: Array<{
    id: number;
    name: string;
  }>;
  departments: Array<{
    id: number;
    name: string;
  }>;
};

export type ExecutiveTrainingChecklist = {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  assigned_to: ExecutiveTrainingChecklistAssignedTo[];
  assigned_by: ExecutiveTrainingChecklistAssignedTo | null;
  checklist_id: number;
  created_at: string;
};

export type ExecutiveTrainingChecklistListResponse = {
  training_checklists: {
    count: number;
    page: number;
    page_size: number;
    results: ExecutiveTrainingChecklist[];
  };
};

export type ExecutiveTrainingChecklistAttachment = {
  id: number;
  file: string;
  uploaded_at: string;
};

export type ExecutiveTrainingChecklistEmployee = {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  avatar: string | null;
  status: AttachmentStatus;
  status_display: string;
  updated_at: string;
};

export type ExecutiveTrainingChecklistDetail = {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  attachment: ExecutiveTrainingChecklistAttachment[];
  employees: ExecutiveTrainingChecklistEmployee[];
};

/**
 * Checklist component types
 */

// Import ChecklistFile from checklist.ts to avoid duplication
import type { ChecklistFile } from "@/types/checklist";

// Task type for training checklist details
export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  date: string;
  attachmentId: number;
  status: AttachmentStatus;
  detail: string;
  files: ChecklistFile[];
}

// Assigned employee for executive training checklist
export interface AssignedEmployee {
  id: string;
  name: string;
  profileImage?: string;
  branch?: string;
  department?: string;
  status: AttachmentStatus;
}

// Executive task type
export interface ExecutiveTask {
  id: string;
  title: string;
  description: string;
  branch?: string;
  department?: string;
  assignTo: AssignedEmployee[];
  assignBy: string;
}
