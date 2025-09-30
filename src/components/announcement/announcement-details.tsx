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
		<div className="container mx-auto px-4 py-4 max-w-7xl">
			{/* Page Header */}

			{/* Card with White Background and Rounded Corners */}
			<div className="bg-white p-5 shadow-sm">
				<h1 className="text-2xl font-bold text-gray-800 pb-2">Announcement</h1>
				{/* Hero Image */}
				<div className="w-full h-[300px] relative overflow-hidden mb-8">
					<Image
						src={announcement.image}
						alt={announcement.title}
						fill
						className="object-cover"
					/>
				</div>

				{/* Meta Row: Logo + Name + Date with Badge Below */}
				<div className="border-t border-b">
					<div className="flex items-center py-2">
						{/* Logo Circle */}
						<div className="w-8 h-8 flex items-center justify-center">
							<Image
								src="/images/logo-circle.png"
								alt="Company Logo"
								width={32}
								height={32}
								className="rounded-full"
							/>
						</div>

						<div className="ml-2">
							<h2 className="font-extrabold">CARTWRIGHT KING</h2>
							<div className="flex items-center gap-1 text-sm text-gray-500">
								<Image
									src="/icons/date-calendar.svg"
									width={24}
									height={24}
									alt="Date"
								/>
								<span>{announcement.date}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Badge Below Logo Circle */}
				<div className="border-b py-2">
					<Badge className="bg-neutral font-extralight text-md text-gray-500">
						{announcement.tag}
					</Badge>
				</div>

				{/* Title */}
				<div className="border-b py-5 mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						{announcement.title}
					</h1>
				</div>

				{/* Content */}
				<div className="text-gray-700 leading-relaxed space-y-6">
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
		</div>
	);
}
