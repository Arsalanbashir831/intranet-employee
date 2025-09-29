"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ContactSection() {
	const socialLinks = [
		{ id: 1, name: "Facebook", href: "#", icon: "/logos/facebook.svg" },
		{ id: 2, name: "Instagram", href: "#", icon: "/logos/instagram.svg" },
		{ id: 3, name: "LinkedIn", href: "#", icon: "/logos/linkedin-blue.svg" },
		{ id: 4, name: "X", href: "#", icon: "/logos/twitter.svg" },
		{ id: 5, name: "Website", href: "#", icon: "/logos/website.svg" },
	];

	return (
		<Card className="w-[390px] h-[130px] m-5  gap-0 rounded-[9px] shadow-sm bg-[#F9FEFF] ">
			<CardContent className="flex flex-col items-center justify-center h-full gap-5 p-0">
				{/* Heading */}
				<h2 className="text-lg font-semibold text-gray-800">Connect With Us</h2>

				{/* Social Icons */}
				<div className="flex items-center justify-center gap-5">
					{socialLinks.map((link) => (
						<a
							key={link.id}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition">
							<Image
								src={link.icon}
								alt={`${link.name} icon`}
								width={43}
								height={42}
								className="object-contain"
							/>
						</a>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
