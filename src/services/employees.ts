import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

// Define types based on the API response
export type Employee = {
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
  bio: string | null;
  profile_picture: string | null;
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
  };
};

export type EmployeeDetailResponse = {
  employee: Employee;
};

export async function getEmployee(id: number | string) {
  const res = await apiCaller<EmployeeDetailResponse>(API_ROUTES.EMPLOYEES.DETAIL(id), "GET");
  return res.data;
}
