"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  type KanbanItemProps,
} from "../ui/kibo-ui/kanban";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ChecklistDrawerContent from "../common/checklist-drawer-content";

interface Task extends KanbanItemProps {
  description: string;
  date: string;
  progress?: number;
}

export default function TaskChecklistDetails() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Design new ui presentation",
      description: "Dribbble marketing",
      column: "todo",
      date: "25 Aug 2022",
    },
    {
      id: "2",
      name: "Add more ui/ux mockups",
      description: "Pinterest promotion",
      column: "todo",
      date: "25 Aug 2022",
    },
    {
      id: "3",
      name: "Create Mobile Screens",
      description: "Pinterest promotion",
      column: "todo",
      date: "26 Aug 2022",
    },
    {
      id: "4",
      name: "Tweet and Promote",
      description: "Pinterest promotion",
      column: "todo",
      date: "26 Aug 2022",
    },
    {
      id: "5",
      name: "Design System Update",
      description: "Website",
      column: "inprogress",
      date: "12 Nov 2022",
    },
    {
      id: "6",
      name: "Create Branding Guideline",
      description: "Website",
      column: "inprogress",
      date: "12 Nov 2022",
    },
    {
      id: "7",
      name: "Create Wireframe",
      description: "Website",
      column: "inprogress",
      date: "12 Nov 2022",
    },
    {
      id: "8",
      name: "Create UI Kit",
      description: "Progress",
      column: "inprogress",
      date: "12 Nov 2022",
    },
    {
      id: "9",
      name: "Add Product to the Market",
      description: "Kickstarter campaign",
      column: "done",
      date: "6 Jan 2022",
      progress: 100,
    },
    {
      id: "10",
      name: "Launch Product Promotion",
      description: "Kickstarter campaign",
      column: "done",
      date: "6 Jan 2022",
      progress: 100,
    },
    {
      id: "11",
      name: "Make Twitter Banner",
      description: "Kickstarter campaign",
      column: "done",
      date: "6 Jan 2022",
      progress: 100,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns = [
    {
      id: "todo",
      name: `To do (${tasks.filter((t) => t.column === "todo").length})`,
    },
    {
      id: "inprogress",
      name: `In progress (${
        tasks.filter((t) => t.column === "inprogress").length
      })`,
    },
    {
      id: "done",
      name: `Done (${tasks.filter((t) => t.column === "done").length})`,
    },
  ];

  const handleCardClick = (task: Task) => {
    console.log("Card clicked:", task.name); // Debug log
    setSelectedTask(task);
    setOpen(true); // Explicitly open the sheet
    console.log("Open state set to:", true); // Debug log
  };

  return (
    <div className="flex items-center p-5 justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-8 w-fit">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-left">
          Task Checklist
        </h1>

        <KanbanProvider<Task>
          columns={columns}
          data={tasks}
          onDataChange={(newData) => setTasks(newData as Task[])}
          className="flex gap-6 justify-center"
        >
          {(column) => (
            <KanbanBoard
              key={column.id}
              id={column.id}
              className={cn(
                "flex flex-col px-1 py-3 rounded-lg min-h-[826px] w-[352px]",
                column.id === "todo" &&
                  "border-2 border-dashed border-[#E5004E] bg-[#E5004E]/10",
                column.id === "inprogress" &&
                  "border-2 border-dashed border-[#888DA7]/20 bg-white",
                column.id === "done" &&
                  "border-2 border-dashed border-[#888DA7]/20 bg-white"
              )}
            >
              <KanbanHeader className="text-base font-semibold text-[#1C1D22]/50 mb-4 text-left border-none">
                {column.name}
              </KanbanHeader>

              <KanbanCards id={column.id} className="flex flex-col gap-4">
                {(task: KanbanItemProps) => (
                  <div key={task.id}>
                    <KanbanCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      column={task.column}
                      onPointerUp={() => handleCardClick(task as Task)}
                    >
                      {/* Card UI */}
                      <div>
                        <div className="flex flex-row items-center gap-2">
                          <div className="p-2 bg-white border rounded-[7px]">
                            <Image
                              src="icons/clipboard-primary.svg"
                              alt="clipboard"
                              width={26}
                              height={26}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-[15px] text-gray-900">
                              {(task as Task).name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {(task as Task).description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center pt-5 text-gray-400">
                          <Image
                            src="/icons/todo.svg"
                            alt="todo"
                            width={12}
                            height={12}
                          />
                          <span className="ml-1 text-xs font-medium">
                            {task.column === "todo" ? "To do" : "Progress"}
                          </span>
                        </div>
                        <div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 my-3">
                            <div
                              className={cn(
                                "h-1.5 rounded-full",
                                task.column === "todo" && "bg-transparent",
                                task.column === "inprogress" && "bg-[#FFA048]",
                                task.column === "done" && "bg-[#78D700]"
                              )}
                              style={{
                                width:
                                  task.column === "done"
                                    ? "100%"
                                    : task.column === "inprogress"
                                    ? "60%"
                                    : "0%",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className={cn(
                            "w-[108px] h-[30px] flex items-center justify-center text-xs font-medium rounded-full",
                            task.column === "todo" &&
                              " text-[#FF7979] bg-[#FF7979]/10",
                            task.column === "inprogress" &&
                              "text-[#FFA048] bg-[#FF7979]/10",
                            task.column === "done" &&
                              "text-[#888DA7] bg-[#888DA7]/10"
                          )}
                        >
                          {(task as Task).date}
                        </div>
                      </div>
                    </KanbanCard>
                  </div>
                )}
              </KanbanCards>

              {column.id === "done" && (
                <div className="flex flex-1 items-center justify-center">
                  <div className="w-[320px] h-[178px] flex items-center justify-center border-2 border-dashed border-[#888DA7]/50 text-[#888DA7] text-sm rounded-lg">
                    Drag your task here...
                  </div>
                </div>
              )}
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        {/* Controlled sheet: show selectedTask data when open */}

        {selectedTask ? (
          <ChecklistDrawerContent
            title="Design new UI presentation"
            subtitle="Dribbble marketing"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. co laboris nisi ut aliquip ex ea commodo consequat."
            date="25 Aug 2022"
          />
        ) : (
          <div className="p-4 text-sm text-gray-500">No task selected</div>
        )}
      </Sheet>
    </div>
  );
}
