"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type BadgeItem =
	| string
	| number
	| { front: string | number; back?: string | number };

interface PolicyCardProps {
	image?: string;
	title: string;
	description: string;
	link?: string;
	width?: number | string;
	height?: number | string;
	badgeLines?: BadgeItem[];
}

export default function FeatureCard({
	image,
	title,
	description,
	link = "#",
	width = 370,
	height = 392,
	badgeLines,
}: PolicyCardProps) {
	const topHeight = Math.floor((247 / 450) * Number(height)); // keep proportional split
	const bottomHeight = Number(height) - topHeight;

	const renderBadgeItem = (item: BadgeItem) => {
		if (typeof item === "string" || typeof item === "number") {
			return item;
		}
		return (
			<>
				{item.front}
				{item.back && <small className="ml-1">{item.back}</small>}
			</>
		);
	};

	return (
		<Card
			className="overflow-hidden relative"
			style={{
				width,
				height,
				display: "grid",
				gridTemplateRows: `${topHeight}px ${bottomHeight}px`,
			}}>
			{/* Badge */}
			{badgeLines && badgeLines.length === 3 && (
				<div
					className="absolute top-2 left-2 bg-white/60 backdrop-blur-sm rounded-sm shadow-md flex flex-col items-center justify-center px-2"
					style={{ width: 60, height: 80 }}>
					<span className="text-xl font-bold leading-tight">
						{renderBadgeItem(badgeLines[0])}
					</span>
					<span className="text-md font-bold leading-tight">
						{renderBadgeItem(badgeLines[1])}
					</span>
					<span className="text-md font-bold leading-tight">
						{renderBadgeItem(badgeLines[2])}
					</span>
				</div>
			)}

			{/* Top */}
			{image ? (
				<Image
					src={image}
					alt={title}
					width={Number(width)}
					height={topHeight}
					className="object-cover w-full h-full"
				/>
			) : (
				<div
					className="flex items-center justify-center flex-shrink-0 bg-pink-50"
					style={{ height: topHeight }}>
					<Image
						src="/icons/document.svg"
						alt="Default Icon"
						width={120}
						height={120}
						className="object-contain"
					/>
				</div>
			)}

			{/* Bottom */}
			<div
				className="flex flex-col px-5 flex-shrink-0"
				style={{ height: bottomHeight }}>
				<div className="space-y-3 overflow-hidden">
					<h1 className="text-2xl font-semibold line-clamp-2">{title}</h1>
					<p className="text-md text-gray-600 leading-snug line-clamp-3">
						{description}
					</p>
				</div>

				{link && (
					<Link
						href={link}
						className="pt-5 text-sm font-medium text-pink-600 underline hover:text-pink-300">
						Read More
					</Link>
				)}
			</div>
		</Card>
	);
}
