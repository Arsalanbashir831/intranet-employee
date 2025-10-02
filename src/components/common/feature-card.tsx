"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type BadgeItem =
	| string
	| number
	| { front: string | number; back?: string | number };

interface PolicyCardProps {
	image?: string;
	title: string;
	description: string;
	link?: string;
	width?: number | string; // optional: still supported
	height?: number | string; // optional: still supported
	badgeLines?: BadgeItem[];
	className?: string; // ✅ now used
	imgClassName?: string; // ✅ now used
}

export default function FeatureCard({
	image,
	title,
	description,
	link = "#",
	width = "100%",
	height, // if omitted, we’ll use responsive heights via classes
	badgeLines,
	className,
	imgClassName,
}: PolicyCardProps) {
	// Approximate original proportion: 247 / 450 ≈ 0.55
	const topRatio = 0.55;

	// If explicit height provided, keep your old grid split (but use fr so it scales)
	// Otherwise, use responsive height classes below.
	const useInlineGridRows = Boolean(height);

	const renderBadgeItem = (item: BadgeItem) => {
		if (typeof item === "string" || typeof item === "number") return item;
		return (
			<>
				{item.front}
				{item.back && <small className="ml-1">{item.back}</small>}
			</>
		);
	};

	return (
		<Card
			className={[
				"overflow-hidden relative grid",
				!height && "h-[392px] sm:h-[420px] md:h-[400px] gap-0 ",
				"grid-rows-[55%_45%]",
				className || "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{
				// Keep supporting explicit width/height if supplied
				width,
				...(height ? { height } : {}),
				...(useInlineGridRows
					? { gridTemplateRows: `${topRatio}fr ${1 - topRatio}fr` }
					: {}),
			}}>
			{/* Badge */}
			{badgeLines && badgeLines.length === 3 && (
				<div className="absolute top-2 left-2 bg-white/60 backdrop-blur-sm rounded-sm shadow-md flex flex-col items-center justify-center px-2 w-[60px] h-[80px] min-[1920px]:w-[68px] min-[1920px]:h-[90px] min-[2560px]:w-[76px] min-[2560px]:h-[100px]">
					<span className="text-xl min-[1920px]:text-2xl font-bold leading-tight">
						{renderBadgeItem(badgeLines[0])}
					</span>
					<span className="text-md min-[1920px]:text-lg font-bold leading-tight">
						{renderBadgeItem(badgeLines[1])}
					</span>
					<span className="text-md min-[1920px]:text-lg font-bold leading-tight">
						{renderBadgeItem(badgeLines[2])}
					</span>
				</div>
			)}

			{/* Top (Image area) */}
			<div className="relative w-full aspect-[4/3] sm:aspect-auto [430px]:h-[180px] lg:aspect-auto">
				{image ? (
					<Image
						src={image}
						alt={title}
						fill
						sizes="(min-width:2560px) 20vw, (min-width:1920px) 25vw, (min-width:1024px) 30vw, 100vw"
						className={["object-cover", imgClassName || ""]
							.filter(Boolean)
							.join(" ")}
						priority={false}
					/>
				) : (
					<div className="flex items-center justify-center w-full h-full bg-pink-50">
						<Image
							src="/icons/document.svg"
							alt="Default Icon"
							width={120}
							height={120}
							className={["object-contain", imgClassName || ""]
								.filter(Boolean)
								.join(" ")}
						/>
					</div>
				)}
			</div>

			{/* Bottom (Content) */}
			<div className="flex flex-col px-5 py-4 overflow-hidden">
				<div className="space-y-3 overflow-hidden">
					<h1
						className=" text-gray-900  font-semibold text-base sm:text-lg md:text-xl line-clamp-2 text-[clamp(1rem,1vw+0.75rem,2rem)] 
            ">
						{title}
					</h1>

					<p
						className="text-gray-600 text-md sm:text-sm md:text-md leading-snug line-clamp-3 text-[clamp(0.9rem,0.7vw+0.6rem,1.3rem)]
            ">
						{description}
					</p>
				</div>

				{link && (
					<Link
						href={link}
						className="mt-auto underline font-medium text-[#E5004E] hover:text-pink-300 text-[clamp(0.9rem,0.6vw+0.6rem,1rem)] min-[1920px]:text-[1.1rem]">
						Read More
					</Link>
				)}
			</div>
		</Card>
	);
}
