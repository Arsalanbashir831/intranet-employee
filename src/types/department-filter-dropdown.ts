/**
 * Department Filter Dropdown component types
 */

export type DepartmentFilterDropdownProps = {
  selectedDepartment: string; // "__all__" or department ID as string
  onDepartmentChange: (departmentId: string) => void;
  className?: string;
};
