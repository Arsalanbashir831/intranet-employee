/**
 * Polls service types
 */

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
  options_details: PollOption[];
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
  permitted_departments_details: Array<{ id: number; dept_name: string }>;
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

/**
 * Poll component types (UI-specific)
 */

// Poll option for card display (different from API PollOption)
export interface PollCardOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

// Poll for card display (UI representation)
export interface PollCard {
  id: string;
  title: string;
  description: string;
  question: string;
  options: PollCardOption[];
  totalVotes: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  userVoted?: boolean;
  userVoteOptionId?: string;
  badgeLines: [string, string, string];
}

// Poll card component props
export interface PollCardProps {
  poll: PollCard;
  className?: string;
}
