"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ChecklistDialog from "./checklist-dialog";
import { useAttachmentStatus } from "@/hooks/queries/use-new-hire";
import { useAuth } from "@/contexts/auth-context";
import type { ChecklistProps } from "@/types/checklist";

export default function Checklist({
  title,
  viewMoreLink,
  type,
}: ChecklistProps) {
  const { user } = useAuth();

  // Fetch attachment status data
  const { data, isLoading, isError } = useAttachmentStatus(
    user?.employeeId || 0,
    { type }
  );

  // Transform API data to match component structure
  const tasks =
    data?.results?.map((item) => ({
      id: item.id,
      title: item.attachment_details.title,
      description: item.attachment_details.detail,
      date: new Date(item.created_at)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(" ", " "),
      files: item.attachment_details.files,
    })) || [];

  const hasTasks = tasks && tasks.length > 0;

  const getEmptyMessage = () => {
    if (title === "Training Checklist") {
      return {
        heading: "No Training Tasks",
        description:
          "There are no Training tasks assigned to you.<br/>Check back later.",
      };
    }
    return {
      heading: "No Tasks",
      description: "There are no tasks assigned to you.<br/> Check back later.",
    };
  };

  const emptyMessage = getEmptyMessage();

  // Show loading state
  if (isLoading) {
    return (
      <Card
        className="
        bg-white border-gray-200 shadow-sm flex flex-col
        w-full max-w-[390px] max-h-[390px] p-3 gap-0 sm:p-4"
      >
        <CardHeader className="!px-0 !pb-2 flex items-center justify-between">
          <h1 className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">
            {title}
          </h1>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Card
        className="
        bg-white border-gray-200 shadow-sm flex flex-col
        w-full max-w-[390px] max-h-[390px] p-3 gap-0 sm:p-4"
      >
        <CardHeader className="!px-0 !pb-2 flex items-center justify-between">
          <h1 className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">
            {title}
          </h1>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">Failed to load tasks</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="
        bg-white border-gray-200 shadow-sm flex flex-col
        w-full max-w-[390px] max-h-[390px] p-3 gap-0 sm:p-4"
    >
      {/* Header */}
      <CardHeader className="!px-0 !pb-2 flex items-center justify-between">
        <h1 className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">
          {title}
        </h1>
        {hasTasks && viewMoreLink && (
          <Link
            href={viewMoreLink}
            className="
              text-[#E5004E] underline font-medium
              text-xs sm:text-sm hover:text-[#E5004E]/90
            "
          >
            View More
          </Link>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        {hasTasks ? (
          <div className="h-full overflow-y-auto pr-1 space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="
                  flex items-center justify-between
                  bg-[#E5004E] text-white
                  rounded-md px-2
                  min-h-[40px] sm:min-h-[43px]
                "
              >
                {/* Left: icon + truncated text */}
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                    <Image
                      src="/icons/small-document.svg"
                      width={16}
                      height={16}
                      alt="Document"
                      className="object-contain"
                    />
                  </div>
                  <span
                    className="
                      text-[11px] sm:text-xs font-medium
                      truncate text-white
                    "
                  >
                    {task.title}
                  </span>
                </div>

                {/* Right: dialog trigger */}
                <ChecklistDialog
                  title={task.title}
                  description={task.description}
                  date={task.date}
                  files={task.files}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Image
              src="/icons/tasks.svg"
              alt="No tasks"
              width={120}
              height={120}
              className="mb-4 sm:mb-6"
            />
            <p className="text-sm sm:text-base font-semibold text-gray-800">
              {emptyMessage.heading}
            </p>
            <p
              className="text-xs sm:text-sm text-gray-500 mt-1"
              dangerouslySetInnerHTML={{ __html: emptyMessage.description }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
