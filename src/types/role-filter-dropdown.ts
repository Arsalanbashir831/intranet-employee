/**
 * Role Filter Dropdown component types
 */

export type RoleFilterDropdownProps = {
  selectedRole: string; // "__all__" or role ID as string
  onRoleChange: (roleId: string) => void;
  className?: string;
};
