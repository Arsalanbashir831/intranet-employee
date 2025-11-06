"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useExecutiveTrainingChecklist } from "@/hooks/queries/use-new-hire";
import type { ExecutiveTrainingChecklistEmployee } from "@/services/new-hire";
import Image from "next/image";
import { format } from "date-fns";

function getStatusConfig(status: "to_do" | "in_progress" | "done") {
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
}

export default function TrainingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const trainingId = params.id as string;

  // Fetch executive training checklist if user is executive
  const { 
    data: executiveData, 
    isLoading: isExecutiveLoading, 
    isError: isExecutiveError 
  } = useExecutiveTrainingChecklist(
    user?.isExecutive ? trainingId : ""
  );

  // Show loading state
  if (user?.isExecutive && isExecutiveLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <PageHeader
          title="Training Details"
          crumbs={[
            { label: "Pages", href: "#" },
            {
              label: "Training Checklist",
              href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
            },
            { label: "Training Details", href: "#" },
          ]}
        />
        <div className="mx-auto w-full px-4 sm:px-1 md:px-2 py-6 sm:py-8 lg:py-10">
          <Card className="shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5">
            <div className="flex justify-center items-center h-[200px]">
              <div className="animate-pulse text-gray-500">Loading training details...</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state for executives
  if (user?.isExecutive && isExecutiveError) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <PageHeader
          title="Training Details"
          crumbs={[
            { label: "Pages", href: "#" },
            {
              label: "Training Checklist",
              href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
            },
            { label: "Training Details", href: "#" },
          ]}
        />
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Training Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The training you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
            <Button
              onClick={() => router.push(ROUTES.DASHBOARD.TRAINING_CHECKLIST)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For executives, use executive data
  if (user?.isExecutive && executiveData) {
    const training = executiveData;

    const handleFileDownload = (fileUrl: string) => {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const formatDeadline = (deadline: string | null) => {
      if (!deadline) return null;
      try {
        return format(new Date(deadline), "dd MMM yyyy");
      } catch {
        return deadline;
      }
    };

    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <PageHeader
          title="Training Details"
          crumbs={[
            { label: "Pages", href: "#" },
            {
              label: "Training Checklist",
              href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
            },
            { label: "Training Details", href: "#" },
          ]}
        />

        <div className="mx-auto w-full px-4 sm:px-1 md:px-2 py-6 sm:py-8 lg:py-10">
          <Card className="shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5">
            {/* Training Information */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {training.title}
              </h1>
              <div 
                className="text-sm text-gray-600 mb-4 prose prose-sm max-w-none [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1"
                dangerouslySetInnerHTML={{ __html: training.description }}
              />
            </div>

            {/* Deadline and Attachments Section */}
            <div className="mb-6 space-y-4">
              {/* Deadline */}
              {training.deadline && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-1">
                    <Image src="/icons/todo.svg" alt="deadline" width={14} height={14} className="sm:w-4 sm:h-4" />
                    Deadline
                  </span>
                  <Badge className="text-[10px] sm:text-xs font-medium text-[#FF7979] bg-[#FF7979]/10 px-2 sm:px-3 py-1 rounded-md">
                    {formatDeadline(training.deadline)}
                  </Badge>
                </div>
              )}

              {/* Attachments */}
              {training.attachment && training.attachment.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-1">
                    <Image src="/icons/todo.svg" alt="attachments" width={14} height={14} className="sm:w-4 sm:h-4" />
                    Attachments
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {training.attachment.map((file) => {
                      // Extract filename from URL
                      const filename = file.file.split("/").pop() || "File";
                      return (
                        <Button
                          key={file.id}
                          variant="outline"
                          className="h-12 sm:h-14 flex items-center rounded-xl justify-start gap-2 border-gray-200 p-2 sm:p-3"
                          onClick={() => handleFileDownload(file.file)}
                        >
                          <div className="bg-[#E5004E] p-1.5 sm:p-2 rounded-sm flex items-center justify-center flex-shrink-0">
                            <Image
                              src="/icons/clipboard.svg"
                              alt="clipboard"
                              width={18}
                              height={18}
                              className="sm:w-[22px] sm:h-[22px]"
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700 truncate flex-1 text-left">
                            {filename}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Assigned Employees */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Assigned Employees ({training.employees.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {training.employees.map((employee: ExecutiveTrainingChecklistEmployee) => {
                  const statusConfig = getStatusConfig(employee.status);
                  return (
                    <div
                      key={employee.employee_id}
                      className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Avatar className="size-16">
                        <AvatarImage
                          src={
                            employee.avatar || "/logos/profile-circle.svg"
                          }
                          alt={employee.employee_name}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {employee.employee_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center text-center w-full">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {employee.employee_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {employee.employee_email}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs font-medium px-3 py-1 rounded-md",
                          statusConfig.className
                        )}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // For regular employees, redirect or show appropriate message
  // Regular employees should use the existing attachment status flow
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Training Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          The training you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          onClick={() => router.push(ROUTES.DASHBOARD.TRAINING_CHECKLIST)}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
