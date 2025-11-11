/**
 * Employees service types
 */

export type Employee = {
  id: number;
  emp_name: string;
  branch_department_ids: number[];
  hire_date: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  role: string;
  education: string;
  bio: string | null;
  profile_picture: string | null;
  isAdmin: boolean;
  branch_departments: {
    id: number;
    branch: {
      id: number;
      branch_name: string;
    };
    department: {
      id: number;
      dept_name: string;
    };
    manager: {
      id: number;
      employee: {
        id: number;
        emp_name: string;
        profile_picture: string | null;
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
    } | null;
  }[];
};

export type EmployeeListResponse = {
  employees: {
    count: number;
    page: number;
    page_size: number;
    results: Employee[];
  };
};

export type EmployeeDetailResponse = {
  employee: Employee;
};

export type UpdateEmployeeRequest = {
  bio?: string | null;
  education?: string;
};

export type UpdateEmployeeResponse = {
  employee: Employee;
};

/**
 * Profile and employee form types
 */

// Org chart form initial values
export type OrgChartInitialValues = {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  departmentIds?: string[];
  branch?: string;
  profileImageUrl?: string;
  qualificationAndEducation?: string;
  emp_role?: string;
};

// Employee profile card props (for teams/details component)
export interface EmployeeProfileCard {
  id: string;
  name: string;
  role: string;
  address: string;
  city: string;
  branch: string;
  status: string;
  bio: string;
  profileImage: string;
  education: string;
  email: string;
  phone: string;
  hireDate: string;
  department: string;
  manager?: {
    name: string;
    role: string;
    profileImage: string;
  };
}

export interface EmployeeProfileCardProps {
  employee?: EmployeeProfileCard;
}

// Employee table row type (for people-directory table display)
export type EmployeeTableRow = {
  id: string;
  name: string;
  designation: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  branch: string;
  department: string;
  education: string;
  bio: string;
};