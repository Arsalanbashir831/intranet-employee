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
import { Sheet } from "@/components/ui/sheet";
import ChecklistDrawerContent from "../common/checklist-drawer-content";

interface Task extends KanbanItemProps {
	description: string;
	date: string;
	progress?: number;
}

interface TaskChecklistDetailsProps {
	heading?: string;
}

export default function TaskChecklistDetails({
	heading = "Task Checklist",
}: TaskChecklistDetailsProps) {
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
		setSelectedTask(task);
		setOpen(true);
	};

	return (
		<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 min-h-screen bg-gray-100">
			{/* page rails */}
			<div className="mx-auto w-full  px-4 sm:px-6 md:px-8 lg:px-4 py-5 sm:py-6 min-h-[100svh] flex flex-col">
				<div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-5 flex-1 min-h-0 flex flex-col">
					<h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
						{heading}
					</h1>

					{/* ✅ Responsive grid: 1 column on mobile, 3 on md+ */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 flex-1 min-h-0 overflow-hidden">
						<KanbanProvider<Task>
							columns={columns}
							data={tasks}
							onDataChange={(d) => setTasks(d as Task[])}
							className="contents">
							{(column) => (
								<KanbanBoard
									key={column.id}
									id={column.id}
									className={cn(
										"rounded-xl px-2 py-3 h-full flex flex-col",
										column.id === "todo" &&
											"border-2 border-dashed border-[#E5004E] bg-[#E5004E]/10",
										column.id === "inprogress" &&
											"border-2 border-dashed border-[#888DA7]/20 bg-white",
										column.id === "done" &&
											"border-2 border-dashed border-[#888DA7]/20 bg-white"
									)}>
									<KanbanHeader className="text-sm sm:text-base font-semibold text-[#1C1D22]/60 mb-3 sm:mb-4 border-none">
										{column.name}
									</KanbanHeader>

								<KanbanCards
									id={column.id}
									className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0 overflow-auto">
										{(task: KanbanItemProps) => (
											<div key={task.id}>
												<KanbanCard
													id={task.id}
													name={task.name}
													column={task.column}
													onPointerUp={() => handleCardClick(task as Task)}
													className="rounded-lg bg-white p-3 sm:p-4 cursor-pointer">
													{/* Card UI */}
													<div className="space-y-3">
														<div className="flex items-center gap-2">
															<div className="p-2 border bg-white rounded-md">
																<Image
																	src="/icons/clipboard-primary.svg"
																	alt="clipboard"
																	width={22}
																	height={22}
																/>
															</div>
															<div className="min-w-0">
																<h3 className="font-semibold text-[14px] sm:text-[15px] text-gray-900 truncate">
																	{(task as Task).name}
																</h3>
																<p className="text-xs text-gray-500 truncate">
																	{(task as Task).description}
																</p>
															</div>
														</div>

														<div className="flex items-center text-gray-400">
															<Image
																src="/icons/todo.svg"
																alt="todo"
																width={12}
																height={12}
															/>
															<span className="ml-1 text-xs font-medium">
																{task.column === "todo"
																	? "To do"
																	: task.column === "inprogress"
																	? "Progress"
																	: "Done"}
															</span>
														</div>

														{/* progress */}
														<div className="w-full bg-gray-200 rounded-full h-1.5">
															<div
																className={cn(
																	"h-1.5 rounded-full transition-[width]",
																	task.column === "todo" && "bg-transparent",
																	task.column === "inprogress" &&
																		"bg-[#FFA048]",
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

														<div
															className={cn(
																"w-[108px] h-[28px] flex items-center justify-center text-[11px] sm:text-xs font-medium rounded-full",
																task.column === "todo" &&
																	"text-[#FF7979]  bg-[#FF7979]/10",
																task.column === "inprogress" &&
																	"text-[#FFA048] bg-[#FFA048]/10",
																task.column === "done" &&
																	"text-[#888DA7] bg-[#888DA7]/10"
															)}>
															{(task as Task).date}
														</div>
													</div>
												</KanbanCard>
											</div>
										)}
									</KanbanCards>

									{column.id === "done" && (
										<div className="mt-3 sm:mt-4 flex-1 flex items-center justify-center">
											<div className="w-full h-[120px] sm:h-[150px] flex items-center justify-center border-2 border-dashed border-[#888DA7]/50 text-[#888DA7] text-xs sm:text-sm rounded-lg">
												Drag your task here...
											</div>
										</div>
									)}
								</KanbanBoard>
							)}
						</KanbanProvider>
					</div>
				</div>
			</div>

			{/* Drawer */}
			<Sheet open={open} onOpenChange={setOpen}>
				{selectedTask && (
					<ChecklistDrawerContent
						title={selectedTask.name}
						subtitle={selectedTask.description}
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
						date={selectedTask.date}
					/>
				)}
			</Sheet>
		</div>
	);
}
