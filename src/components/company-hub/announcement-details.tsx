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
		<div className="container mx-auto px-4 py-6 max-w-[1374px] lg:px-2">
			{/* Card with White Background */}
			<div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-5">
				{/* Section Header */}
				<h1
					className="
            font-bold text-gray-800 pb-3
            text-xl sm:text-2xl md:text-3xl lg:text-4xl
            min-[1920px]:text-5xl min-[2560px]:text-6xl
          ">
					Announcement
				</h1>

				{/* Hero Image */}
				<div
					className="
            w-full relative overflow-hidden rounded-md mb-6
            h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]
            min-[1920px]:h-[600px] min-[2560px]:h-[700px] min-[3840px]:h-[800px]
          ">
					<Image
						src={announcement.image}
						alt={announcement.title}
						fill
						className="object-cover"
					/>
				</div>

				{/* Meta Row */}
				<div className="border-t border-b">
					<div className="flex items-center py-3 gap-3">
						{/* Logo */}
						<div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
							<Image
								src="/images/logo-circle.png"
								alt="Company Logo"
								width={48}
								height={48}
								className="rounded-full"
							/>
						</div>

						<div>
							<h2
								className="
                  font-extrabold
                  text-sm sm:text-base md:text-lg lg:text-xl
                  min-[1920px]:text-2xl
                ">
								CARTWRIGHT KING
							</h2>
							<div
								className="
                  flex items-center gap-1
                  text-xs sm:text-sm md:text-base text-gray-500
                ">
								<Image
									src="/icons/date-calendar.svg"
									width={20}
									height={20}
									alt="Date"
								/>
								<span>{announcement.date}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Badge */}
				<div className="border-b py-3">
					<Badge
						className="
              bg-neutral font-light text-gray-600
              text-xs sm:text-sm md:text-base lg:text-lg
            ">
						{announcement.tag}
					</Badge>
				</div>

				{/* Title */}
				<div className="border-b py-6 mb-6">
					<h1
						className="
              font-bold text-gray-900
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              min-[1920px]:text-6xl min-[2560px]:text-7xl
            ">
						{announcement.title}
					</h1>
				</div>

				{/* Content */}
				<div
					className="
            text-gray-700 leading-relaxed space-y-5
            text-sm sm:text-base md:text-lg lg:text-xl
            min-[1920px]:text-2xl min-[2560px]:text-[26px]
          ">
					{announcement.content
						.split("\n\n")
						.filter((p) => p.trim())
						.map((paragraph, i) => (
							<p key={i}>{paragraph.trim()}</p>
						))}
				</div>
			</div>
		</div>
	);
}
