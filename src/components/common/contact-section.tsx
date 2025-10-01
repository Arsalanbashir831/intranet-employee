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
		<Card className="w-full max-w-[390px] rounded-lg shadow-sm bg-[#F9FEFF] gap-0 p-3 sm:p-4">
			<CardContent className="p-0 flex flex-col items-center gap-3 sm:gap-4">
				{/* Heading */}
				<h2 className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">
					Connect With Us
				</h2>

				{/* Social Icons in one row */}
				<div
					className="
            flex items-center justify-center
            gap-2 sm:gap-3 md:gap-4   /* reduced gaps */
            overflow-x-auto
          ">
					{socialLinks.map((link) => (
						<a
							key={link.id}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="
                flex items-center justify-center
                w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                rounded-full hover:opacity-80 transition
                shrink-0
              ">
							<Image
								src={link.icon}
								alt={`${link.name} icon`}
								width={28}
								height={28}
								className="object-contain w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10"
							/>
						</a>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
