import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ChecklistDialog from "./checklist-dropdown";

interface ChecklistProps {
  title: string;
  viewMoreLink?: string;
  tasks: string[];
}

export default function Checklist({ title, viewMoreLink, tasks }: ChecklistProps) {
  const hasTasks = tasks && tasks.length > 0;

  // Dynamic empty state messages based on title
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

  return (
    <Card
      className="bg-white m-5 border-gray-200 shadow-sm"
      style={{
        width: "390px",
        height: "281px",
        padding: "10px", // Uniform 10px padding on all sides
      }}
    >
      <CardHeader className=" !grid-cols-[1fr_auto] !px-0 !pb-0">
        <div className="flex justify-between items-center">
          <h1 className="text-[24px] font-semibold text-gray-800">{title}</h1>
          {hasTasks && viewMoreLink && (
            <Link
              href={viewMoreLink}
              className="text-[#E5004E] underline text-sm font-medium hover:text-[#E5004E]/90"
            >
              View More
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent
        className="bg-white p-0 relative"
        style={{ width: "370px", height: "195px" }} // Reduced height to allow bottom space
      >
        {hasTasks ? (
          <div className="w-full h-full overflow-y-auto pr-1 flex flex-col">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#E5004E] text-white mb-1 rounded-md pl-2"
                style={{ minHeight: "43px" }}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mr-1">
                    <img
                      src="/icons/small-document.svg"
                      alt="Document"
                      className="w-4 h-4"
                    />
                  </div>
                  <span
                    className="text-[11px] font-medium text-white truncate"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {task.split(" ").slice(0, 5).join(" ")}...
                  </span>
                </div>
<ChecklistDialog  />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col rounded-2xl items-center justify-center text-center h-full">
            <Image
              src="/icons/tasks.svg"
              alt="No tasks"
              width={240}
              height={240}
              className="mb-6"
            />
            <p className="text-xl text-center font-semibold text-gray-800">
              {emptyMessage.heading}
            </p>
            <p
              className="text-md text-gray-500"
              dangerouslySetInnerHTML={{ __html: emptyMessage.description }}
            />
          </div>
        )}
        {/* Fixed bottom spacer outside scrollable area */}
        <div style={{ height: "10px" }} /> {/* Adds 10px bottom space */}
      </CardContent>
    </Card>
  );
}
