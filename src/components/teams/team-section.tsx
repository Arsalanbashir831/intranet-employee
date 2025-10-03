"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useBranchDepartmentEmployees } from "@/hooks/queries/use-departments";
import { useAuth } from "@/contexts/auth-context";

interface TeamMember {
	id: number;
	name: string;
	role: "Manager" | "Team";
	image?: string;
}

export default function TeamSection() {
	const { user } = useAuth();
	
	// Fetch team members based on user's branch department, limit to 3
	const { data, isLoading, isError } = useBranchDepartmentEmployees(
		user?.branchDepartmentId || 0,
		{ page: 1, pageSize: 3 }
	);
	
	// Transform API data to match component structure
	const teamMembers: TeamMember[] = data?.employees?.results?.slice(0, 3).map(employee => ({
		id: employee.id,
		name: employee.emp_name,
		role: employee.role.toLowerCase().includes('manager') ? "Manager" : "Team",
		image: employee.profile_picture || "/images/default-profile.png",
	})) || [];

	// Show loading state
	if (isLoading) {
		return (
			<Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
				<div className="flex items-center justify-between mb-3 sm:mb-4">
					<h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-tight">
						My Team
					</h2>
					<Link href="/teams" className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base">
						View More
					</Link>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 flex items-center justify-center">
					<div>Loading team members...</div>
				</div>
			</Card>
		);
	}

	// Show error state
	if (isError) {
		return (
			<Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
				<div className="flex items-center justify-between mb-3 sm:mb-4">
					<h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-tight">
						My Team
					</h2>
					<Link href="/teams" className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base">
						View More
					</Link>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 flex items-center justify-center">
					<div>Error loading team members</div>
				</div>
			</Card>
		);
	}

	// Show empty state
	if (!user?.branchDepartmentId || teamMembers.length === 0) {
		return (
			<Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
				<div className="flex items-center justify-between mb-3 sm:mb-4">
					<h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-tight">
						My Team
					</h2>
					<Link href="/teams" className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base">
						View More
					</Link>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 flex items-center justify-center">
					<div>No team members found</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between mb-3 sm:mb-4">
				<h2
					className="
            font-semibold text-gray-900
            text-base sm:text-lg md:text-xl
            leading-tight
          ">
					My Team
				</h2>

				<Link
					href="/teams"
					className="
            underline font-medium text-[#E5004E]
            text-xs sm:text-sm md:text-base
          ">
					View More
				</Link>
			</div>

			{/* Members (scroll area) */}
			<div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
				{teamMembers.map((member) => (
					<div
						key={member.id}
						className="w-full bg-white shadow-sm border border-gray-200 rounded-md px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
						{/* Left */}
						<div className="flex items-center gap-3 sm:gap-4 min-w-0">
							<Avatar className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full">
								<AvatarImage src={member.image} alt={member.name} />
								<AvatarFallback>
									{member.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="min-w-0">
								<Badge className="text-[10px] sm:text-xs px-2 py-0.5 bg-[#49A2A6] rounded-full capitalize mb-1">
									{member.role}
								</Badge>
								<p className="text-sm sm:text-[0.95rem] font-medium text-gray-800 truncate">
									{member.name}
								</p>
							</div>
						</div>

						{/* Right */}
						<Link
							href={`/teams/${member.id}`}
							className="underline font-medium text-[#E5004E] text-xs sm:text-sm flex-shrink-0">
							View Profile
						</Link>
					</div>
				))}
			</div>
		</Card>
	);
}