"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import Link from "next/link";

type Props = {
	image: string;
	name: string;
	designation: string;
	description?: string;
	href?: string;
	className?: string;
	topClassName?: string; // image wrapper
	imgClassName?: string; // <Image> fit
};

export default function TeamsCard({
	image,
	name,
	designation,
	description = "There are many variations of passages of Lorem Ipsum available.",
	href,
	className,
	topClassName,
	imgClassName,
}: Props) {
	const Wrapper = href ? Link : React.Fragment;
	const wrapperProps = href ? { href } : {};

	return (
		<Wrapper {...(wrapperProps as any)}>
			<Card
				className={[
					"overflow-hidden gap-0 !rounded-none bg-white border",
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
					<h3 className="text-pink-600 text-lg font-semibold">{name}</h3>
					<p className="text-teal-600 text-sm">{designation}</p>

					<p className="text-gray-600 text-sm mt-2 line-clamp-3">
						{description}
					</p>
				</div>
			</Card>
		</Wrapper>
	);
}
