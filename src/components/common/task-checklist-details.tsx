"use client";

import { useState, useEffect, useRef } from "react";
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
import { useAttachmentStatus } from "@/hooks/queries/use-new-hire";
import { useAuth } from "@/contexts/auth-context";
import { AttachmentStatusDetail } from "@/services/new-hire";
import { updateAttachmentStatus } from "@/services/new-hire";
import { toast } from "sonner";

interface Task extends KanbanItemProps {
	description: string;
	date: string;
	progress?: number;
	attachmentId: number;
	status: "to_do" | "in_progress" | "done";
	detail: string; // Add the full detail from attachment_details
	files: {
		id: number;
		file: string;
		uploaded_at: string;
	}[]; // Add the files array
}

interface TaskChecklistDetailsProps {
	heading?: string;
	type?: "task" | "training";
}

export default function TaskChecklistDetails({
	heading = "Task Checklist",
	type = "task",
}: TaskChecklistDetailsProps) {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	// Fetch attachment status data
	const { data, isLoading, isError } = useAttachmentStatus(
		user?.employeeId || 0,
		{ type }
	);

	// Local state for Kanban tasks
	const [kanbanTasks, setKanbanTasks] = useState<Task[]>([]);

	// Keep a ref to the previous kanbanTasks for comparison in onDataChange
	const prevKanbanTasksRef = useRef<Task[]>([]);

	// Update kanbanTasks when API data changes
	useEffect(() => {
		if (data?.results) {
			const newTasks = data.results.map((item: AttachmentStatusDetail) => {
				const columnValue =
					item.status === "to_do"
						? "todo"
						: item.status === "in_progress"
						? "inprogress"
						: "done";
				return {
					id: item.id.toString(),
					name: item.attachment_details.title,
					description: item.attachment_details.detail,
					detail: item.attachment_details.detail,
					column: columnValue,
					date: new Date(item.created_at)
						.toLocaleDateString("en-GB", {
							day: "2-digit",
							month: "short",
							year: "numeric",
						})
						.replace(" ", " "),
					attachmentId: item.attachment,
					status: item.status,
					files: item.attachment_details.files,
				};
			});

			setKanbanTasks(newTasks);
			// Only initialize the ref if it's empty (first load)
			// Deep clone to prevent mutation issues
			if (prevKanbanTasksRef.current.length === 0) {
				prevKanbanTasksRef.current = JSON.parse(JSON.stringify(newTasks));
			}
		}
	}, [data]);

	const tasks = kanbanTasks;

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

	// Show loading state
	if (isLoading) {
		return (
			<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 min-h-screen bg-gray-100">
				<div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-4 py-5 sm:py-6 min-h-[100svh] flex flex-col">
					<div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-5 flex-1 min-h-0 flex flex-col">
						<h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
							{heading}
						</h1>
						<div className="flex justify-center items-center h-full">
							<div className="animate-pulse text-gray-500">
								Loading tasks...
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show error state
	if (isError) {
		return (
			<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 min-h-screen bg-gray-100">
				<div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-4 py-5 sm:py-6 min-h-[100svh] flex flex-col">
					<div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-5 flex-1 min-h-0 flex flex-col">
						<h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
							{heading}
						</h1>
						<div className="flex justify-center items-center h-full">
							<div className="text-red-500">
								Failed to load tasks. Please try again later.
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
							data={kanbanTasks}
							onDataChange={(d) => {
								const prevTasks = prevKanbanTasksRef.current;
								const updatedTasks = d as Task[];
								const previousTaskMap = new Map(
									prevTasks.map((task) => [task.id, task])
								);
								const currentTaskMap = new Map(
									updatedTasks.map((task) => [task.id, task])
								);
								for (const [id, currentTask] of currentTaskMap) {
									const previousTask = previousTaskMap.get(id);

									if (previousTask) {
										if (previousTask.column !== currentTask.column) {
											let newStatus: "to_do" | "in_progress" | "done" = "to_do";
											if (currentTask.column === "inprogress") {
												newStatus = "in_progress";
											} else if (currentTask.column === "done") {
												newStatus = "done";
											}
											const taskId = parseInt(id);
											updateAttachmentStatus(taskId, { status: newStatus })
												.then(() => {
													// Only update the ref after successful API call
													// Deep clone to prevent mutation issues
													prevKanbanTasksRef.current = JSON.parse(
														JSON.stringify(updatedTasks)
													);
												})
												.catch(() => {
													toast.error("Failed to update status");
												});
										}
									}
								}

								// Update local state for UI
								setKanbanTasks(updatedTasks);
							}}
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
													onPointerUp={(e) => {
														e.stopPropagation();
														handleCardClick(task as Task);
													}}
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
						description={selectedTask.detail}
						date={selectedTask.date}
						files={selectedTask.files}
					/>
				)}
			</Sheet>
		</div>
	);
}
