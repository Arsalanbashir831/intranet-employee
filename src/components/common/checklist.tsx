import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ChecklistDrawer from "./checklist-drawer";

interface ChecklistProps {
  title: string;
  viewMoreLink?: string;
  tasks: string[];
}

export default function Checklist({
  title,
  viewMoreLink,
  tasks,
}: ChecklistProps) {
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
      className="bg-white m-5 border-gray-200 shadow-sm gap-4"
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
                    <Image
                      src="/icons/small-document.svg"
                      width={16}
                      height={16}
                      alt="Document"
                      className="object-contain"
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
                <ChecklistDrawer
                  title="Design new UI presentation"
                  subtitle="Dribbble marketing"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. co laboris nisi ut aliquip ex ea commodo consequat."
                  date="25 Aug 2022"
                />

                {/* <span className="flex  items-center text-[10px] font-medium text-white hover:underline cursor-pointer">
                  See Details
                  <ArrowRight className="w-3 h-3 ml-1" />
                </span> */}
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
              className="mb-6 border-red-600"
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
