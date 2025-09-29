"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

interface Policy {
	id: number;
	title: string;
	description: string;
	author: string;
	date: string;
}

const policies: Policy[] = [
	{
		id: 1,
		title: "Policy 1",
		description: "HERE ARE THE NEW ANNOUNCED POLICY FOR HR",
		author: "Cartwright King",
		date: "2024-07-26",
	},
	{
		id: 2,
		title: "Policy 2",
		description: "HERE ARE THE NEW ANNOUNCED POLICY FOR HR",
		author: "Cartwright King",
		date: "2024-07-26",
	},
];

export default function RecentPolicies() {
	return (
		<Card className="w-[448px] h-[268px] bg-[#F9FEFF] rounded-lg p-4 flex flex-col gap-0">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-semibold text-gray-900">
					Recent Policies
				</h2>
				<Link href="#" className="text-md font-medium text-[#E5004E] underline">
					View More
				</Link>
			</div>

			{/* Policies list */}
			<div className="space-y-3 overflow-y-auto pr-1">
				{policies.map((policy) => (
					<div
						key={policy.id}
						className="w-[412px] h-[109px] bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col justify-between">
						{/* Title & Description */}
						<div>
							<h3 className="text-md font-bold text-gray-900 uppercase tracking-wide">
								{policy.title}
							</h3>
							<p className="text-sm text-gray-600 mt-1">{policy.description}</p>
						</div>

						{/* Footer */}
						<div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
							<div className="h-6 w-6 rounded-full overflow-hidden">
								<Image
									src="/images/logo-circle.png" // <-- replace with your logo path
									alt={policy.author}
									width={24}
									height={24}
									className="object-cover"
								/>
							</div>
							<span className="font-medium">{policy.author}</span>
							<span>•</span>
							<span>{policy.date}</span>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
