/**
 * Branch Filter Dropdown component types
 */

export type BranchFilterDropdownProps = {
  selectedBranch: string; // "__all__" or branch ID as string
  onBranchChange: (branchId: string) => void;
  className?: string;
};
