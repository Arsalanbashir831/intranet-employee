"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type {
  ExecutiveTask,
  AssignedEmployee,
} from "@/components/common/executive-table";

// Mock data - in real app, this would come from API
const mockTasks: ExecutiveTask[] = [
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

function getStatusConfig(status: AssignedEmployee["status"]) {
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
  const trainingId = params.id as string;

  const training = mockTasks.find((t) => t.id === trainingId);

  if (!training) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Training Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The training you're looking for doesn't exist.
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
            <p className="text-sm text-gray-600 mb-4">{training.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <span className="font-medium">Assigned By:</span>{" "}
                {training.assignBy}
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Assigned Employees */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Assigned Employees ({training.assignTo.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {training.assignTo.map((employee) => {
                const statusConfig = getStatusConfig(employee.status);
                return (
                  <div
                    key={employee.id}
                    className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar className="size-16">
                      <AvatarImage
                        src={
                          employee.profileImage || "/logos/profile-circle.svg"
                        }
                        alt={employee.name}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center text-center w-full">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {employee.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {employee.branch}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          {employee.department}
                        </span>
                      </div>
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
