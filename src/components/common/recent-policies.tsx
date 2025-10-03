"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useLatestPolicies } from "@/hooks/queries/use-announcements";
import { useAuth } from "@/contexts/auth-context";
import { ROUTES } from "@/constants/routes";

interface Policy {
	id: number;
	title: string;
	description: string;
	author: string;
	date: string;
}

export default function RecentPolicies() {
	const { user } = useAuth();
	const { data, isLoading, isError } = useLatestPolicies(user?.employeeId || 0, 3);
	
	// Transform API data to match the component's expected structure
	const policies: Policy[] = data?.announcements?.results?.map(policy => ({
		id: policy.id,
		title: policy.title,
		description: policy.body.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
		author: "Cartwright King", // Default author as in mock data
		date: new Date(policy.created_at).toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
	})) || [];

	// Show loading state
	if (isLoading) {
		return (
			<Card className="w-full bg-[#F9FEFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[268px] min-h-[268px] overflow-hidden">
				<div className="flex items-center justify-between mb-3 sm:mb-4">
					<h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
						Recent Policies
					</h2>
					<Link
						href={ROUTES.DASHBOARD.COMPANY_HUB + "/?tab=policies"}
						className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base">
						View More
					</Link>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 flex items-center justify-center">
					<div>Loading policies...</div>
				</div>
			</Card>
		);
	}

	// Show error state
	if (isError) {
		return (
			<Card className="w-full bg-[#F9FEFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[268px] min-h-[268px] overflow-hidden">
				<div className="flex items-center justify-between mb-3 sm:mb-4">
					<h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
						Recent Policies
					</h2>
					<Link
						href={ROUTES.DASHBOARD.COMPANY_HUB + "/?tab=policies"}
						className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base">
						View More
					</Link>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 flex items-center justify-center">
					<div>Error loading policies</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="w-full bg-[#F9FEFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[268px] min-h-[268px] overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between mb-3 sm:mb-4">
				<h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl">
					Recent Policies
				</h2>
				<Link
					href={ROUTES.DASHBOARD.COMPANY_HUB + "/?tab=policies"}
					className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base">
					View More
				</Link>
			</div>

			{/* Policies list (scroll if overflow) */}
			<div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
				{policies.map((policy) => (
					<div
						key={policy.id}
						className="w-full bg-white border border-gray-200 rounded-md shadow-sm p-3 sm:p-4 flex flex-col justify-between min-h-[90px] sm:min-h-[100px] md:min-h-[109px]">
						{/* Title & Description */}
						<div>
							<h3 className="uppercase tracking-wide text-sm sm:text-[15px] md:text-base font-bold text-gray-900">
								{policy.title}
							</h3>
							<p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">
								{policy.description}
							</p>
						</div>

						{/* Footer */}
						<div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-gray-500">
							<div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full overflow-hidden">
								<Image
									src="/images/logo-circle.png"
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