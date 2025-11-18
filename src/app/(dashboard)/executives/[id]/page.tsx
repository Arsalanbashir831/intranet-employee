"use client";

import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { TeamsDetailsCard } from "@/components/teams/teams-details";
import { ROUTES } from "@/constants/routes";
import { useExecutive } from "@/hooks/queries/use-executive-members";
import { useParams } from "next/navigation";
import type { EmployeeProfileCard } from "@/types/employees";

export default function ExecutiveSlug() {
	const params = useParams();
	const id = params.id as string;

	const { data, isLoading, isError, error } = useExecutive(id);

	// Transform API data to match component structure
	const executive: EmployeeProfileCard | undefined = data
		? {
				id: data.id.toString(),
				name: data.name,
				role: data.role,
				address: data.address,
				city: data.city,
				status: "ACTIVE", // Default status
				bio: data.bio || "No bio available",
				profileImage: data.profile_picture || "/images/default-profile.png",
				email: data.email,
				phone: data.phone,
				branches: data.branch ? [data.branch] : [],
				hireDate: data.hire_date || "-",
				departments: data.department ? [data.department] : [],
		  }
		: undefined;

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Loading executive details...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>
					Error loading executive details: {error?.message || "Unknown error"}
				</div>
			</div>
		);
	}

	if (!executive) return notFound();

	return (
		<div>
			<PageHeader
				title="Executives"
				crumbs={[
					{ label: "Pages", href: "#" },
					{ label: "Executives", href: ROUTES.DASHBOARD.EXECUTIVES },
					{
						label: executive.name,
						href: `${ROUTES.DASHBOARD.EXECUTIVES}/${id}`,
					},
				]}
			/>
			<TeamsDetailsCard employee={executive} />
		</div>
	);
}
