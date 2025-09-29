// components/announcement/announcement-details.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface AnnouncementDetailCardProps {
	announcement: {
		id: string;
		title: string;
		date: string;
		tag: string;
		image: string;
		content: string;
	};
}

export default function AnnouncementDetailCard({
	announcement,
}: AnnouncementDetailCardProps) {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Page Header */}
			<h1 className="text-xl font-semibold text-gray-800 mb-6">Announcement</h1>

			{/* Hero Image */}
			<div className="w-full h-[300px] relative rounded-lg overflow-hidden mb-6">
				<Image
					src={announcement.image}
					alt={announcement.title}
					fill
					className="object-cover"
				/>
			</div>

			{/* Meta Row: Logo + Name + Date +  */}
			<div className="flex items-center justify-between border-t border-b pb-4 mb-6">
				<div className="flex items-center gap-4">
					{/* Logo Circle */}
					<div className="flex items-center justify-center">
						<Image
							src="/images/logo-circle.png"
							alt="Company Logo"
							width={32}
							height={32}
							className="rounded-full"
						/>
					</div>

					<div>
						<h2 className="font-medium text-gray-800">CARTWRIGHT KING</h2>
						<div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
							<Image
								src="/icons/calendar.svg"
								width={16}
								height={16}
								alt="Date"
							/>
							<span>{announcement.date}</span>
						</div>
					</div>
				</div>
			</div>

			<div className="border-b pb-4">
				{/* Tag Badge (Right Aligned) */}
				<Badge variant="secondary" className="bg-gray-100 text-gray-700">
					{announcement.tag}
				</Badge>
			</div>

			{/* Title */}
			<div className="border-b pt-4">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
					{announcement.title}
				</h1>
			</div>

			{/* Content */}
			<div className="text-gray-700 leading-relaxed space-y-4">
				{announcement.content
					.split("\n\n")
					.filter((p) => p.trim())
					.map((paragraph, i) => (
						<p key={i} className="text-base">
							{paragraph.trim()}
						</p>
					))}
			</div>
		</div>
	);
}
