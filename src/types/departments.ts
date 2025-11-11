/**
 * Departments service types
 */

import type { Branch } from "./branches";

export type Department = {
  id: number;
  dept_name: string;
  employee_count: number;
  branch_departments: BranchDepartment[];
};

export type DepartmentListResponse = {
  departments: {
    count: number;
    page: number;
    page_size: number;
    results: Department[];
  };
};

export type DepartmentDetailResponse = Department;

export type DepartmentCreateRequest = {
  dept_name: string;
  description?: string;
} & Record<
  string,
  string | number | boolean | File | Blob | string[] | null | undefined
>;

export type DepartmentCreateResponse = {
  department: Department;
};

export type DepartmentUpdateRequest = Partial<DepartmentCreateRequest>;

export type DepartmentUpdateResponse = Department;

export type DepartmentEmployee = {
  id: number;
  emp_name: string;
  branch_department_id: number;
  hire_date: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  role: string;
  education: string;
  bio: string;
  profile_picture: string | null;
  branch_department: {
    id: number;
    branch: Branch;
    department: {
      id: number;
      dept_name: string;
    };
    manager: null | {
      id: number;
      full_name: string;
      profile_picture?: string;
    };
  };
};

export type DepartmentEmployeesResponse = {
  employees: {
    count: number;
    page: number;
    page_size: number;
    results: DepartmentEmployee[];
  };
};

export type BranchDepartmentEmployee = {
  id: number;
  emp_name: string;
  branch_department_id: number;
  hire_date: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  role: string;
  education: string;
  bio: string;
  profile_picture: string | null;
  branch_department: {
    id: number;
    branch: Branch;
    department: {
      id: number;
      dept_name: string;
    };
    manager: null | {
      id: number;
      full_name: string;
      profile_picture?: string;
    };
  };
};

export type BranchDepartmentEmployeesResponse = {
  employees: {
    count: number;
    page: number;
    page_size: number;
    results: BranchDepartmentEmployee[];
  };
};

export type BranchDepartment = {
  id: number;
  branch: Branch;
  employee_count: number;
  manager: null | {
    id: number;
    employee: {
      id: number;
      emp_name: string;
      profile_picture?: string | null;
      email: string;
      role: string;
    };
    branch_department: {
      id: number;
      branch: {
        id: number;
        branch_name: string;
      };
      department: {
        id: number;
        dept_name: string;
      };
    };
  };
};
