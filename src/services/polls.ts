import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

// Define types based on the API response
export type PollVoter = {
  id: number;
  name: string;
  email: string;
  profile_picture: string | null;
  voted_at: string;
  branch_department: {
    id: number;
    branch: {
      id: number;
      name: string;
      location: string;
    };
    department: {
      id: number;
      name: string;
    };
  };
};

export type PollOption = {
  id: number;
  option_text: string;
  vote_count: number;
  voters?: PollVoter[];
};

export type Poll = {
  id: number;
  title: string;
  subtitle: string;
  question: string;
  poll_type: "public" | "private";
  total_votes: number;
  created_at: string;
  expires_at: string;
  created_by: number | null;
  is_active: boolean;
  inherits_parent_permissions: boolean;
  permitted_branches: number[];
  permitted_departments: number[];
  permitted_branch_departments: number[];
  permitted_employees: number[];
  options: PollOption[];
  has_voted: boolean;
  user_vote: number | null;
  created_by_details: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
  } | null;
  effective_permissions: {
    branches: number[];
    departments: number[];
    branch_departments: number[];
    employees: number[];
  };
  permitted_branches_details: Array<{
    id: number;
    branch_name: string;
    location: string | null;
  }>;
  permitted_departments_details: Array<{
    id: number;
    dept_name: string;
  }>;
  permitted_branch_departments_details: Array<{
    id: number;
    branch: {
      id: number;
      branch_name: string;
      location: string;
    };
    department: {
      id: number;
      dept_name: string;
    };
  }>;
  permitted_employees_details: Array<{
    id: number;
    emp_name: string;
    email: string;
    phone: string;
    role: string;
    profile_picture: string | null;
  }>;
  is_expired: boolean;
  can_vote: boolean;
  show_results: boolean;
};

export type PollListResponse = {
  polls: {
    count: number;
    page: number;
    page_size: number;
    results: Poll[];
  };
};

export type PollResultsResponse = Poll;

export type PollVoteResponse = {
  message: string;
};

export type PollVoteError = {
  error: string;
};

// Poll CRUD operations
export async function listPolls(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const url = API_ROUTES.KNOWLEDGE_BASE.POLLS.LIST;
  const queryParams: Record<string, string> = {};
  
  // Add pagination parameters
  if (pagination) {
    const paginationParams = {
      page: (pagination.page || 1).toString(),
      page_size: (pagination.pageSize || 10).toString(),
    };
    Object.assign(queryParams, paginationParams);
  }
  
  // Add other parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams[key] = String(value);
    });
  }
  
  const query = Object.keys(queryParams).length > 0 
    ? `?${new URLSearchParams(queryParams)}` 
    : "";
    
  const res = await apiCaller<PollListResponse>(`${url}${query}`, "GET");
  return res.data;
}

export async function getPollResults(id: number | string) {
  const res = await apiCaller<PollResultsResponse>(
    API_ROUTES.KNOWLEDGE_BASE.POLLS.RESULTS(id), 
    "GET"
  );
  return res.data;
}

export async function votePoll(id: number | string, optionId: number) {
  const res = await apiCaller<PollVoteResponse>(
    API_ROUTES.KNOWLEDGE_BASE.POLLS.VOTE(id),
    "POST",
    { option_id: optionId }
  );
  return res.data;
}
