"use client";

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
			className="
        bg-white border-gray-200 shadow-sm flex flex-col
        w-full max-w-[390px] max-h-[390px] p-3 gap-0 sm:p-4">
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
            ">
						View More
					</Link>
				)}
			</CardHeader>

			{/* Content */}
			<CardContent className="p-0 flex-1 overflow-hidden">
				{hasTasks ? (
					<div className="h-full overflow-y-auto pr-1 space-y-2">
						{tasks.map((task, index) => (
							<div
								key={index}
								className="
                  flex items-center justify-between
                  bg-[#E5004E] text-white
                  rounded-md px-2
                  min-h-[40px] sm:min-h-[43px]
                ">
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
                    ">
										{task.split(" ").slice(0, 5).join(" ")}...
									</span>
								</div>

								{/* Right: drawer trigger */}
								<ChecklistDrawer
									title="Design new UI presentation"
									subtitle="Dribbble marketing"
									description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
									date="25 Aug 2022"
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
