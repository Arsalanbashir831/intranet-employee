"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { CardTable } from "@/components/common/card-table/card-table";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTableColumnHeader } from "@/components/common/card-table/card-table-column-header";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { useExecutiveTrainingChecklists } from "@/hooks/queries/use-new-hire";
import type { ExecutiveTrainingChecklist } from "@/services/new-hire";
import { BranchFilterDropdown } from "@/components/common/branch-filter-dropdown";
import { DepartmentFilterDropdown } from "@/components/common/department-filter-dropdown";
import { useDebounce } from "@/hooks/use-debounce";

export interface AssignedEmployee {
  id: string;
  name: string;
  profileImage?: string;
  branch?: string;
  department?: string;
  status: "to_do" | "in_progress" | "done";
}

export interface ExecutiveTask {
  id: string;
  title: string;
  description: string;
  branch?: string;
  department?: string;
  assignTo: AssignedEmployee[];
  assignBy: string;
}

// Component to display avatars with +X count
function AssignToAvatars({ employees }: { employees: AssignedEmployee[] }) {
  // Safety check: ensure employees is an array
  if (!Array.isArray(employees) || employees.length === 0) {
    return <span className="text-sm text-gray-500">-</span>;
  }

  const visibleEmployees = employees.slice(0, 3);
  const remainingCount = employees.length - 3;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visibleEmployees.map((employee, index) => {
          // Safety check: ensure employee has required properties
          if (!employee || typeof employee.id === "undefined" || !employee.name) {
            return null;
          }
          return (
            <Avatar
              key={employee.id}
              className="size-8 border-2 border-white"
              style={{ zIndex: visibleEmployees.length - index }}
            >
              <AvatarImage
                src={employee.profileImage || "/logos/profile-circle.svg"}
                alt={employee.name}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </div>
      {remainingCount > 0 && (
        <span className="text-xs text-gray-600 font-medium ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

export default function ExecutiveTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [selectedBranch, setSelectedBranch] = useState<string>("__all__");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("__all__");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Build query parameters for training checklist API
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    
    // Add search filter (using debounced value)
    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }
    
    // Add branch filter if selected
    if (selectedBranch !== "__all__") {
      params.branch = selectedBranch;
    }
    
    // Add department filter if selected
    if (selectedDepartment !== "__all__") {
      params.department = selectedDepartment;
    }
    
    return Object.keys(params).length > 0 ? params : undefined;
  }, [debouncedSearchQuery, selectedBranch, selectedDepartment]);

  // Build pagination parameters (page is 1-indexed in API)
  const paginationParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  }), [pagination]);

  // Fetch executive training checklists from API with filters and pagination
  const { data, isLoading, isError, isFetching } = useExecutiveTrainingChecklists(queryParams, paginationParams);

  // Track if we've ever successfully loaded data (to prevent full card loading after first load)
  const hasEverLoadedRef = useRef(false);
  
  // Update ref when we successfully get data
  useEffect(() => {
    if (data?.training_checklists?.results && data.training_checklists.results.length > 0) {
      hasEverLoadedRef.current = true;
    }
  }, [data]);

  // Transform API data to ExecutiveTask format
  const tasks = useMemo(() => {
    if (!data?.training_checklists?.results || !Array.isArray(data.training_checklists.results)) {
      return [];
    }
    
    return data.training_checklists.results.map((item: ExecutiveTrainingChecklist): ExecutiveTask => {
      // Get branch and department from first assigned employee (for display in table)
      const firstAssigned = item.assigned_to?.[0];
      const branch = firstAssigned?.branches?.[0]?.name;
      const department = firstAssigned?.departments?.[0]?.name;
      
      return {
        id: item.id.toString(),
        title: item.title || "Untitled",
        description: item.description || "",
        branch: typeof branch === "string" ? branch : undefined,
        department: typeof department === "string" ? department : undefined,
        assignTo: (item.assigned_to || [])
          .filter((employee) => employee && employee.id && employee.name)
          .map((employee) => ({
            id: employee.id.toString(),
            name: employee.name || "Unknown",
            profileImage: employee.avatar || undefined,
            branch: employee.branches?.[0]?.name,
            department: employee.departments?.[0]?.name,
            status: "to_do" as const, // Default status, not provided in list API
          })),
        assignBy: item.assigned_by?.name || "Admin",
      };
    });
  }, [data]);

  // Sort tasks (API handles filtering and pagination, but we do client-side sorting)
  const sortedTasks = useMemo(() => {
    let sorted = tasks;

    // Apply sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      sorted = [...sorted].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (id) {
          case "title":
            aValue = a.title;
            bValue = b.title;
            break;
          case "assignBy":
            aValue = a.assignBy;
            bValue = b.assignBy;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          const cmp = aValue.localeCompare(bValue);
          return desc ? -cmp : cmp;
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return desc ? bValue - aValue : aValue - bValue;
        }
        return 0;
      });
    }

    return sorted;
  }, [tasks, sorting]);

  // Get total count from API response
  const totalCount = data?.training_checklists?.count || 0;

  const handleRowClick = (task: ExecutiveTask) => {
    router.push(`/training-checklist/${task.id}`);
  };

  // Show loading state only on true initial load (when we've never loaded data before)
  // When filters change, we'll show loading overlay on the table instead
  // Use ref to track if we've ever successfully loaded data
  const hasData = !!data?.training_checklists?.results;
  const isInitialLoading = isLoading && !hasEverLoadedRef.current;

  // Show initial loading state (only on first load when there's absolutely no data)
  if (isInitialLoading) {
    return (
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
        <Card
          className={cn(
            "shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5",
            "w-full h-full"
          )}
        >
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-pulse text-gray-500">Loading training checklists...</div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
        <Card
          className={cn(
            "shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5",
            "w-full h-full"
          )}
        >
          <div className="flex justify-center items-center h-[200px]">
            <div className="text-red-500">
              Failed to load training checklists. Please try again later.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Helper function to get first 3 words
  const getFirstThreeWords = (text: string): string => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
  };

  const columns: ColumnDef<ExecutiveTask>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const title = row.original.title || "";
        const truncatedTitle = getFirstThreeWords(title);
        return (
          <span className="text-sm font-medium text-gray-900" title={title}>
            {truncatedTitle || "Untitled"}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        // Strip HTML tags for display in table
        const description = row.original.description || "";
        const plainText = description.replace(/<[^>]*>/g, "").trim();
        const truncatedDescription = getFirstThreeWords(plainText);
        return (
          <span className="text-sm text-gray-700" title={plainText}>
            {truncatedDescription || "No description"}
          </span>
        );
      },
    },
    {
      accessorKey: "branch",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Branch" />
      ),
      cell: ({ row }) => {
        const branch = row.original.branch;
        return (
          <span className="text-sm text-gray-700">
            {typeof branch === "string" ? branch : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const department = row.original.department;
        return (
          <span className="text-sm text-gray-700">
            {typeof department === "string" ? department : "-"}
          </span>
        );
      },
    },
    {
      id: "assignTo",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Assign To" />
      ),
      cell: ({ row }) => {
        const employees = row.original.assignTo || [];
        return <AssignToAvatars employees={employees} />;
      },
      enableSorting: false,
    },
    {
      accessorKey: "assignBy",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Assign By" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.assignBy}</span>
      ),
    },
    {
      id: "action",
      header: () => (
        <span className="text-sm font-medium text-gray-700">Action</span>
      ),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#E5004E] hover:text-[#E5004E]/80 hover:bg-[#E5004E]/10"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row.original);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
      <Card
        className={cn(
          "shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5",
          "w-full h-full"
        )}
      >
        <div className="mb-4 space-y-3">
          <CardTableToolbar
            title="Training Checklist"
            placeholder="Search by title"
            searchValue={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
            }}
            hasFilter={false}
            hasSort={false}
            activeSort={sorting[0]?.id || "title"}
            onSortChange={(value) => {
              const currentSort = sorting[0];
              const newDesc =
                currentSort?.id === value ? !currentSort?.desc : false;
              setSorting([{ id: value, desc: newDesc }]);
            }}
            accessControl={
              <div className="flex gap-2">
              <BranchFilterDropdown
                selectedBranch={selectedBranch}
                onBranchChange={(branchId) => {
                  setSelectedBranch(branchId);
                  setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
                }}
              />
              <DepartmentFilterDropdown
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(departmentId) => {
                  setSelectedDepartment(departmentId);
                  setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
                }}
              />
            </div>
            }
            className="flex sm:flex-col sm:items-start"
          />
        </div>

        {/* Table container with loading overlay */}
        <div className="relative w-full">
          <div className="relative overflow-x-auto w-full">
            {/* Loading overlay when fetching - only covers table area */}
            {/* Show overlay if: fetching AND (we have data OR we have tasks from previous render) */}
            {isFetching && (hasData || sortedTasks.length > 0) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="animate-pulse text-gray-500 text-sm">Loading...</div>
              </div>
            )}
            
            {sortedTasks.length === 0 && !isFetching ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? "No tasks match your search" : "No tasks found"}
              </div>
            ) : (
              <div className="min-w-[1000px]">
                <CardTable
                  columns={columns}
                  data={sortedTasks}
                  headerClassName="grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_100px]"
                  rowClassName="hover:bg-[#FAFAFB] grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_100px] cursor-pointer"
                  sorting={sorting}
                  onSortingChange={setSorting}
                  onRowClick={(row) =>
                    handleRowClick(row.original as ExecutiveTask)
                  }
                  noResultsContent={
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery
                        ? "No tasks match your search"
                        : "No tasks found"}
                    </div>
                  }
                  footer={(table) => {
                    if (totalCount === 0) {
                      return null;
                    }

                    return (
                      <CardTablePagination
                        table={table}
                        pageIndex={pagination.pageIndex}
                        pageSize={pagination.pageSize}
                        totalCount={totalCount}
                        onPaginationChange={(newPagination) => {
                          setPagination(newPagination);
                        }}
                        alwaysShow={true}
                      />
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
