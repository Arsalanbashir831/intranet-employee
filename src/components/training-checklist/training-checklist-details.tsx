"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { CardTable } from "@/components/common/card-table/card-table";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTableColumnHeader } from "@/components/common/card-table/card-table-column-header";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { Dialog } from "@/components/ui/dialog";
import ChecklistDialogContent from "../common/checklist-dialog-content";
import {
  useAttachmentStatus,
  useUpdateAttachmentStatus,
} from "@/hooks/queries/use-new-hire";
import { useAuth } from "@/contexts/auth-context";
import { AttachmentStatusDetail } from "@/services/new-hire";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  attachmentId: number;
  status: "to_do" | "in_progress" | "done";
  detail: string;
  files: {
    id: number;
    file: string;
    uploaded_at: string;
  }[];
}

interface TaskChecklistDetailsProps {
  heading?: string;
  type?: "task" | "training";
}

// Status Select Component
function StatusSelect({ task }: { task: Task }) {
  const [localStatus, setLocalStatus] = useState<Task["status"]>(task.status);
  const updateMutation = useUpdateAttachmentStatus(task.attachmentId);

  // Update local status when task prop changes
  useEffect(() => {
    setLocalStatus(task.status);
  }, [task.status]);

  const getStatusConfig = (status: Task["status"]) => {
    const statusConfig = {
      to_do: {
        label: "To Do",
        className: "text-[#FF7979] bg-[#FF7979]/10",
      },
      in_progress: {
        label: "In Progress",
        className: "text-[#FFA048] bg-[#FFA048]/10",
      },
      done: {
        label: "Done",
        className: "text-[#78D700] bg-[#78D700]/10",
      },
    };
    return statusConfig[status];
  };

  const handleStatusChange = async (
    newStatus: "to_do" | "in_progress" | "done"
  ) => {
    setLocalStatus(newStatus);
    try {
      await updateMutation.mutateAsync({ status: newStatus });
      toast.success("Status updated successfully");
    } catch (error) {
      setLocalStatus(task.status); // Revert on error
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const currentConfig = getStatusConfig(localStatus);

  return (
    <Select
      value={localStatus}
      onValueChange={(value) =>
        handleStatusChange(value as "to_do" | "in_progress" | "done")
      }
      disabled={updateMutation.isPending}
    >
      <SelectTrigger
        className={cn(
          "h-auto w-fit border-none shadow-none p-0 text-xs font-medium px-3 py-1 rounded-md",
          currentConfig.className,
          "hover:opacity-80 focus:ring-0"
        )}
      >
        <SelectValue>
          <span className={currentConfig.className}>{currentConfig.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-none">
        <SelectItem value="to_do">
          <span className="text-[#FF7979]">To Do</span>
        </SelectItem>
        <SelectItem value="in_progress">
          <span className="text-[#FFA048]">In Progress</span>
        </SelectItem>
        <SelectItem value="done">
          <span className="text-[#78D700]">Done</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default function TrainingChecklistDetails({
  heading = "Task Checklist",
  type = "task",
}: TaskChecklistDetailsProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Fetch attachment status data
  const { data, isLoading, isError } = useAttachmentStatus(
    user?.employeeId || 0,
    { type }
  );

  // Transform API data to Task format
  const tasks = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map((item: AttachmentStatusDetail) => ({
      id: item.id.toString(),
      title: item.attachment_details.title,
      description: item.attachment_details.detail,
      date: new Date(item.created_at)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(" ", " "),
      attachmentId: item.id, // Use AttachmentStatus ID, not attachment foreign key
      status: item.status,
      detail: item.attachment_details.detail,
      files: item.attachment_details.files,
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
          task.description.toLowerCase().includes(query)
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
          case "deadline":
            aValue = new Date(a.date).getTime();
            bValue = new Date(b.date).getTime();
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
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

  const handleViewClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setOpen(true);
  };

  const truncateTitle = (text: string, maxWords: number = 4) => {
    const words = text.split(" ");
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "sr",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="SR" />
      ),
      cell: ({ row }) => {
        const pageIndex = pagination.pageIndex;
        const pageSize = pagination.pageSize;
        return (
          <span className="text-sm text-gray-700">
            {pageIndex * pageSize + row.index + 1}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span
          className="text-sm font-medium text-gray-900"
          title={row.original.title}
        >
          {truncateTitle(row.original.title, 4)}
        </span>
      ),
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Deadline" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.date}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <CardTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusSelect task={row.original} />,
    },
    {
      id: "view",
      header: () => (
        <span className="text-sm font-medium text-gray-700">View</span>
      ),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#E5004E] hover:text-[#E5004E]/80 hover:bg-[#E5004E]/10"
          onClick={(e) => handleViewClick(row.original, e)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
    },
  ];

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
          <h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {heading}
          </h1>
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-pulse text-gray-500">Loading tasks...</div>
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
          <h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {heading}
          </h1>
          <div className="flex justify-center items-center h-[200px]">
            <div className="text-red-500">
              Failed to load tasks. Please try again later.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
      <Card
        className={cn(
          "shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5",
          "w-full h-full"
        )}
      >
        <CardTableToolbar
          title={heading}
          placeholder="Search"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasFilter={false}
          sortOptions={[
            { label: "Title", value: "title" },
            { label: "Deadline", value: "deadline" },
            { label: "Status", value: "status" },
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
                headerClassName="grid-cols-[80px_2fr_1fr_1fr_1fr]"
                rowClassName="hover:bg-[#FAFAFB] grid-cols-[80px_2fr_1fr_1fr_1fr]"
                sorting={sorting}
                onSortingChange={setSorting}
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

      {/* Dialog for viewing task details */}
      <Dialog open={open} onOpenChange={setOpen}>
        {selectedTask && (
          <ChecklistDialogContent
            title={selectedTask.title}
            description={selectedTask.detail}
            date={selectedTask.date}
            files={selectedTask.files}
          />
        )}
      </Dialog>
    </div>
  );
}
