"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import Link from "next/link";

type Props = {
	image: string;
	name: string;
	designation: string;
	role?: string;
	branch?: string;
	department?: string;
	href?: string;
	className?: string;
	topClassName?: string; // image wrapper
	imgClassName?: string; // <Image> fit
};

export default function TeamsCard({
	image,
	name,
	designation,
	role,
	branch,
	department,
	href,
	className,
	topClassName,
	imgClassName,
}: Props) {
	const card = (
		<Card
			className={[
				"overflow-hidden gap-0 !rounded-none bg-white",
				"flex flex-col w-full",
				className || "",
			].join(" ")}>
			{/* Top image band */}
			<div
				className={[
					"relative w-full bg-gray-100",
					topClassName || "aspect-[4/3] sm:aspect-[16/10] xl:h-[230px]",
				].join(" ")}>
				<Image
					src={image}
					alt={name}
					fill
					className={["object-cover", imgClassName || ""].join(" ")}
					sizes="(min-width:1280px) 310px, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
				/>
			</div>

			{/* Body */}
			<div className="p-4 flex-1 flex flex-col">
				<h3 className="text-[#E5004E] text-lg font-semibold">{name}</h3>
				<p className="text-[#49A2A6] text-sm">{designation}</p>

				{/* Show role, branch and department */}
				<div className="mt-2 space-y-1">
					{role && (
						<p className="text-[#5F6980] text-xs">
							<span className="font-medium">Role:</span> {role}
						</p>
					)}
					{branch && (
						<p className="text-[#5F6980] text-xs">
							<span className="font-medium">Branch:</span> {branch}
						</p>
					)}
					{department && (
						<p className="text-[#5F6980] text-xs">
							<span className="font-medium">Department:</span> {department}
						</p>
					)}
				</div>
			</div>
		</Card>
	);

	// Instead of `Wrapper` with `any`, just conditionally wrap
	return href ? <Link href={href}>{card}</Link> : card;
}