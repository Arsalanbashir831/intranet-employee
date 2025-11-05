"use client";

import React, { useState, useMemo } from "react";
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

export interface AssignedEmployee {
  id: string;
  name: string;
  profileImage?: string;
  branch: string;
  department: string;
  status: "to_do" | "in_progress" | "done";
}

export interface ExecutiveTask {
  id: string;
  title: string;
  description: string;
  assignTo: AssignedEmployee[];
  assignBy: string;
}

// Component to display avatars with +X count
function AssignToAvatars({ employees }: { employees: AssignedEmployee[] }) {
  const visibleEmployees = employees.slice(0, 3);
  const remainingCount = employees.length - 3;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visibleEmployees.map((employee, index) => (
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
        ))}
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Mock data with multiple employees per task
  const mockData: ExecutiveTask[] = [
    {
      id: "1",
      title: "Complete Annual Report",
      description: "Prepare and review the annual financial report for Q4 2024",
      assignTo: [
        {
          id: "1",
          name: "John Smith",
          profileImage: "/logos/profile-circle.svg",
          branch: "IT",
          department: "Finance",
          status: "in_progress",
        },
        {
          id: "2",
          name: "Emily Davis",
          profileImage: "/logos/profile-circle.svg",
          branch: "IT",
          department: "Finance",
          status: "to_do",
        },
        {
          id: "3",
          name: "Robert Wilson",
          profileImage: "/logos/profile-circle.svg",
          branch: "IT",
          department: "Finance",
          status: "done",
        },
        {
          id: "4",
          name: "David Lee",
          profileImage: "/logos/profile-circle.svg",
          branch: "IT",
          department: "Finance",
          status: "to_do",
        },
      ],
      assignBy: "Sarah Johnson",
    },
    {
      id: "2",
      title: "Update Company Policies",
      description: "Review and update employee handbook and company policies",
      assignTo: [
        {
          id: "5",
          name: "Lisa Anderson",
          profileImage: "/logos/profile-circle.svg",
          branch: "HR",
          department: "Human Resources",
          status: "in_progress",
        },
        {
          id: "6",
          name: "James Taylor",
          profileImage: "/logos/profile-circle.svg",
          branch: "HR",
          department: "Human Resources",
          status: "to_do",
        },
      ],
      assignBy: "Michael Brown",
    },
    {
      id: "3",
      title: "Client Presentation",
      description: "Prepare presentation for upcoming client meeting",
      assignTo: [
        {
          id: "7",
          name: "Maria Garcia",
          profileImage: "/logos/profile-circle.svg",
          branch: "Sales",
          department: "Sales & Marketing",
          status: "done",
        },
        {
          id: "8",
          name: "Thomas Martinez",
          profileImage: "/logos/profile-circle.svg",
          branch: "Sales",
          department: "Sales & Marketing",
          status: "in_progress",
        },
        {
          id: "9",
          name: "Jennifer White",
          profileImage: "/logos/profile-circle.svg",
          branch: "Sales",
          department: "Sales & Marketing",
          status: "to_do",
        },
        {
          id: "10",
          name: "Christopher Brown",
          profileImage: "/logos/profile-circle.svg",
          branch: "Sales",
          department: "Sales & Marketing",
          status: "done",
        },
        {
          id: "11",
          name: "Amanda Green",
          profileImage: "/logos/profile-circle.svg",
          branch: "Sales",
          department: "Sales & Marketing",
          status: "in_progress",
        },
      ],
      assignBy: "Sarah Johnson",
    },
    {
      id: "4",
      title: "System Maintenance",
      description: "Perform scheduled maintenance on company servers",
      assignTo: [
        {
          id: "12",
          name: "Daniel Kim",
          profileImage: "/logos/profile-circle.svg",
          branch: "IT",
          department: "IT Support",
          status: "to_do",
        },
      ],
      assignBy: "Michael Brown",
    },
    {
      id: "5",
      title: "Training Program",
      description: "Organize training session for new employees",
      assignTo: [
        {
          id: "13",
          name: "Sarah Johnson",
          profileImage: "/logos/profile-circle.svg",
          branch: "HR",
          department: "Human Resources",
          status: "in_progress",
        },
        {
          id: "14",
          name: "Michael Brown",
          profileImage: "/logos/profile-circle.svg",
          branch: "HR",
          department: "Human Resources",
          status: "done",
        },
      ],
      assignBy: "Sarah Johnson",
    },
  ];

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = mockData;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.assignBy.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      filtered = [...filtered].sort((a, b) => {
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

    return filtered;
  }, [searchQuery, sorting]);

  // Paginate tasks
  const paginatedTasks = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedTasks.slice(start, end);
  }, [filteredAndSortedTasks, pagination]);

  const handleRowClick = (task: ExecutiveTask) => {
    router.push(`/training-checklist/${task.id}`);
  };

  const columns: ColumnDef<ExecutiveTask>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700 line-clamp-2">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "assignTo",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Assign To" />
      ),
      cell: ({ row }) => <AssignToAvatars employees={row.original.assignTo} />,
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
        <CardTableToolbar
          title="Executive Tasks"
          placeholder="Search"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasFilter={false}
          sortOptions={[
            { label: "Title", value: "title" },
            { label: "Assign By", value: "assignBy" },
          ]}
          activeSort={sorting[0]?.id || "title"}
          onSortChange={(value) => {
            const currentSort = sorting[0];
            const newDesc =
              currentSort?.id === value ? !currentSort?.desc : false;
            setSorting([{ id: value, desc: newDesc }]);
          }}
          className="flex sm:flex-col sm:items-start"
        />

        <div className="overflow-x-auto max-w-full pr-2 pb-2">
          {paginatedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No tasks match your search" : "No tasks found"}
            </div>
          ) : (
            <div className="w-max min-w-full">
              <CardTable
                columns={columns}
                data={paginatedTasks}
                headerClassName="grid-cols-[1.5fr_2fr_1fr_1fr_100px]"
                rowClassName="hover:bg-[#FAFAFB] grid-cols-[1.5fr_2fr_1fr_1fr_100px] cursor-pointer"
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
                  if (filteredAndSortedTasks.length === 0) {
                    return null;
                  }

                  return (
                    <CardTablePagination
                      table={table}
                      pageIndex={pagination.pageIndex}
                      pageSize={pagination.pageSize}
                      totalCount={filteredAndSortedTasks.length}
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
      </Card>
    </div>
  );
}
