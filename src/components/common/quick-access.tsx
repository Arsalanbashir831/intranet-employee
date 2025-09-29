"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const quickAccessItems = [
	{ id: 1, src: "/logos/profile-circle.svg", alt: "CK" },
	{ id: 2, src: "/logos/outlook.svg", alt: "Outlook" },
	{ id: 3, src: "/logos/teams.svg", alt: "Teams" },
	{ id: 4, src: "/logos/cycle-circle.svg", alt: "Circle" },
	{ id: 5, src: "/logos/linkedin.svg", alt: "LinkedIn" },
	{ id: 6, src: "/logos/openai.svg", alt: "OpenAI" },
];

export default function QuickAccess() {
	return (
		<Card className="w-[950px] h-[150 px] gap-0 bg-[#F9FEFF] rounded-lg px-[19px] pt-[15px] pb-[10px]">
			{/* Header */}
			<h2 className="text-base font-semibold text-gray-900">Quick Access</h2>

			{/* Logo Row */}
			<div className="w-[899px] h-[91px] flex items-center gap-10">
				{quickAccessItems.map((item) => (
					<div
						key={item.id}
						className="h-12 w-12 rounded-full flex items-center justify-center">
						<Image
							src={item.src}
							alt={item.alt}
							width={48}
							height={48}
							className="object-contain"
						/>
					</div>
				))}
			</div>
		</Card>
	);
}
