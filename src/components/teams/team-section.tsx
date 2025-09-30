"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
interface TeamMember {
	id: number;
	name: string;
	role: "Manager" | "Team";
	image?: string;
}

const teamMembers: TeamMember[] = [
	{
		id: 1,
		name: "Raheem Hussain",
		role: "Manager",
		image: "/images/profile-pic.png",
	},
	{
		id: 2,
		name: "Raheem Hussain",
		role: "Team",
		image: "/images/profile-pic.png",
	},
	{
		id: 3,
		name: "Raheem Hussain",
		role: "Team",
		image: "/images/profile-pic.png",
	},
];

export default function TeamSection() {
	return (
		<Card className="w-[494px] h-[269px] bg-[#F9FFFF] rounded-lg p-4 flex flex-col gap-0">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-semibold text-gray-900">My Team</h2>
				<Link
					href="/teams"
					className="text-md font-medium text-[#E5004E] underline">
					View More
				</Link>
			</div>

			{/* Members */}
			<div className="space-y-2 overflow-y-auto pr-1">
				{teamMembers.map((member) => (
					<div
						key={member.id}
						className="w-[458px] h-[71px] flex items-center justify-between bg-white shadow-sm px-6 py-2.5 border border-gray-200">
						{/* Left section */}
						<div className="flex items-center gap-3">
							<Avatar className="h-12 w-12 rounded-full">
								<AvatarImage src={member.image} alt={member.name} />
								<AvatarFallback>
									{member.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div>
								<Badge className="text-xs px-2 bg-[#49A2A6]  py-0.5 rounded-full capitalize mb-1">
									{member.role}
								</Badge>
								<p className="text-sm font-medium text-gray-800">
									{member.name}
								</p>
							</div>
						</div>

						{/* Right section */}
						<Link
							href=""
							className="text-sm font-medium text-[#E5004E] underline">
							View Profile
						</Link>
					</div>
				))}
			</div>
		</Card>
	);
}
