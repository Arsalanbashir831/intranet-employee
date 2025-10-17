"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const quickAccessItems = [
	{
		id: 1,
		src: "/logos/profile-circle.svg",
		alt: "CK",
		href: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "#",
	},
	{
		id: 2,
		src: "/logos/outlook.svg",
		alt: "Outlook",
		href: process.env.NEXT_PUBLIC_OUTLOOK_URL || "#",
	},
	{
		id: 3,
		src: "/logos/teams.svg",
		alt: "Teams",
		href: process.env.NEXT_PUBLIC_TEAMS_URL || "#",
	},
	{
		id: 4,
		src: "/logos/cyclr.svg",
		alt: "Cyclr",
		href: process.env.NEXT_PUBLIC_CYCLR_URL || "#",
	},
	{
		id: 5,
		src: "/logos/linkedin.svg",
		alt: "LinkedIn",
		href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
	},
	{
		id: 6,
		src: "/logos/openai.svg",
		alt: "OpenAI",
		href: process.env.NEXT_PUBLIC_OPENAI_URL || "#",
	},
];

export default function QuickAccess() {
	return (
		<Card className="w-full max-w-none bg-[#F9FEFF] rounded-xl p-4 gap-0 sm:p-5 md:p-6 lg:p-7 min-[1920px]:p-8 min-[2560px]:p-10">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2
					className="
            font-semibold text-gray-900
            text-sm sm:text-base md:text-lg lg:text-xl
            min-[1920px]:text-2xl min-[2560px]:text-[28px]
          ">
					Quick Access
				</h2>
				{/* optional right-aligned action slot (kept for future) */}
				<div className="hidden sm:block"></div>
			</div>

			{/* Mobile: single-row horizontal scroll */}
			<div
				className="
          mt-3
          block md:hidden
          overflow-x-auto
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        ">
				<div
					className="
            inline-flex w-max
            gap-4 sm:gap-5
            snap-x snap-mandatory
            px-1
          ">
					{quickAccessItems.map((item) => (
						<button
							key={item.id}
							className="
                shrink-0 snap-start
                size-12 sm:size-12
                grid place-items-center
                transition active:scale-95
              "
							aria-label={item.alt}>
							<Image
								src={item.src}
								alt={item.alt}
								width={40}
								height={40}
								className="object-contain"
								sizes="(max-width: 768px) 48px"
								priority={false}
							/>
						</button>
					))}
				</div>
			</div>

			{/* Tablet & Desktop: wrapped row */}
			<div
				className="
          mt-3
          hidden md:flex
          flex-wrap items-center
          gap-5 md:gap-6 lg:gap-15 min-[1920px]:gap-9 min-[2560px]:gap-10
        ">
				{quickAccessItems.map((item) => (
					<Link key={item.id} href={item.href} target="_blank" passHref>
						<Button
							size="icon"
							className="
							bg-transparent hover:bg-transparent
              rounded-full 
              grid place-items-center
              transition hover:scale-95 !h-fit !w-fit !p-0
              size-12 md:size-14 lg:size-16 min-[1920px]:size-18 min-[2560px]:size-20"
							aria-label={item.alt}>
							<Image
								src={item.src}
								alt={item.alt}
								width={56}
								height={56}
								className="object-contain"
								sizes="(min-width:2560px) 80px, (min-width:1920px) 72px, (min-width:1024px) 64px, 56px"
								priority={false}
							/>
						</Button>
					</Link>
				))}
			</div>
		</Card>
	);
}
