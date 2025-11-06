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
import { useExecutiveTrainingChecklists } from "@/hooks/queries/use-new-hire";
import type { ExecutiveTrainingChecklist } from "@/services/new-hire";

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

  // Fetch executive training checklists from API
  const { data, isLoading, isError } = useExecutiveTrainingChecklists();

  // Transform API data to ExecutiveTask format
  const tasks = useMemo(() => {
    if (!data?.training_checklists || !Array.isArray(data.training_checklists)) {
      return [];
    }
    return data.training_checklists.map((item: ExecutiveTrainingChecklist): ExecutiveTask => ({
      id: item.id.toString(),
      title: item.title || "Untitled",
      description: item.description || "",
      assignTo: (item.assigned_to || []).map((employee) => ({
        id: employee.id.toString(),
        name: employee.name || "Unknown",
        profileImage: employee.avatar || undefined,
        branch: "", // Not provided in API
        department: "", // Not provided in API
        status: "to_do" as const, // Default status, not provided in list API
      })),
      assignBy: item.assigned_by || "N/A",
    }));
  }, [data]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

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
  }, [tasks, searchQuery, sorting]);

  // Paginate tasks
  const paginatedTasks = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedTasks.slice(start, end);
  }, [filteredAndSortedTasks, pagination]);

  const handleRowClick = (task: ExecutiveTask) => {
    router.push(`/training-checklist/${task.id}`);
  };

  // Show loading state
  if (isLoading) {
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
      cell: ({ row }) => {
        // Strip HTML tags for display in table
        const description = row.original.description || "";
        const plainText = description.replace(/<[^>]*>/g, "").trim();
        return (
          <span className="text-sm text-gray-700 line-clamp-2" title={plainText}>
            {plainText || "No description"}
          </span>
        );
      },
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
          title="Training Checklist"
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
