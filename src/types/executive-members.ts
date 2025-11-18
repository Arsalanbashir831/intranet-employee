/**
 * Executive members service types
 */

export type Executive = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  role: string;
  bio?: string;
  branch: string;
  hire_date: string;
  department: string;
  profile_picture?: string | null;
  created_at: string;
  updated_at: string;
};

export type ExecutiveListResponse = {
  count: number;
  page: number;
  page_size: number;
  results: Executive[];
};

export type ExecutiveDetailResponse = Executive;

export type ExecutiveCreateRequest = {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  role: string;
  profile_picture?: File | string | null;
};

export type ExecutiveUpdateRequest = {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  role?: string;
  profile_picture?: File | string | null;
};

// Executive table row type (for executives page table display)
export type ExecutiveTableRow = {
  id: string;
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};