"use client";

import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { TeamsDetailsCard } from "@/components/teams/teams-details";
import { ROUTES } from "@/constants/routes";
import { useEmployee } from "@/hooks/queries/use-employees";
import { useParams } from "next/navigation";
import type { EmployeeProfileCard } from "@/types/employees";

export default function OrgChartDirectoryDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const { data, isLoading, isError, error } = useEmployee(id);

	// Transform API data to match component structure
	const employee: EmployeeProfileCard | undefined = data?.employee
		? {
				id: data.employee.id.toString(),
				name: data.employee.emp_name,
				role: data.employee.role,
				address: data.employee.address,
				city: data.employee.city,
				branches: Array.from(
					new Set(
						data.employee.branch_departments
							?.map((bd) => bd.branch?.branch_name)
							.filter((name): name is string => Boolean(name)) || []
					)
				),
				status: "ACTIVE", // Default status
				bio: data.employee.bio || "No bio available",
				profileImage:
					data.employee.profile_picture || "/images/default-profile.png",
				email: data.employee.email,
				phone: data.employee.phone,
				hireDate: data.employee.hire_date,
				departments: Array.from(
					new Set(
						data.employee.branch_departments
							?.map((bd) => bd.department?.dept_name)
							.filter((name): name is string => Boolean(name)) || []
					)
				),
				manager: data.employee.branch_departments?.[0]?.manager
					? {
							name: data.employee.branch_departments[0].manager.employee.emp_name,
							role: data.employee.branch_departments[0].manager.employee.role,
							profileImage:
								data.employee.branch_departments[0].manager.employee
									.profile_picture || "/images/default-profile.png",
					  }
					: undefined,
		  }
		: undefined;

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Loading employee details...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>
					Error loading employee details: {error?.message || "Unknown error"}
				</div>
			</div>
		);
	}

	if (!employee) return notFound();

	return (
		<div>
			<PageHeader
				title="People Directory"
				crumbs={[
					{ label: "Pages", href: "#" },
					{
						label: "People Directory",
						href: ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY,
					},
					{
						label: employee.name,
						href: `${ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}/${id}`,
					},
				]}
			/>
			<TeamsDetailsCard employee={employee} />
		</div>
	);
}
