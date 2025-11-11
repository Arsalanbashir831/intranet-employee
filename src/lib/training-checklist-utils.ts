/**
 * Training Checklist utility functions
 */

import type { AttachmentStatus } from "@/types/new-hire";

export type StatusConfig = {
  label: string;
  className: string;
};

/**
 * Get status configuration for attachment status badges
 */
export function getStatusConfig(status: AttachmentStatus): StatusConfig {
  const statusConfig = {
    to_do: {
      label: "To Do",
      className: "text-[#FF7979] bg-[#FF7979]/10",
    },
    in_progress: {
      label: "In Progress",
      className: "text-[#FFA048] bg-[#FFA048]/10",
    },
    done: {
      label: "Done",
      className: "text-[#78D700] bg-[#78D700]/10",
    },
  };

  return statusConfig[status];
}

