"use client";

import { PageHeader } from "@/components/common/page-header";
import TeamsCard from "@/components/teams/teams-card";
import { ROUTES } from "@/hooks/constants/routes";
import Link from "next/link";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TableSearch } from "@/components/card-table/table-search";

const teamData = [
	{
		id: "1",
		name: "Jocelyn Schleifer",
		designation: "Manager",
		image: "/images/team-member-1.png",
	},
	{
		id: "2",
		name: "John Doe",
		designation: "Developer",
		image: "/images/team-member-2.png",
	},
	{
		id: "3",
		name: "Martin Donin",
		designation: "Lead",
		image: "/images/team-member-3.png",
	},
	{
		id: "4",
		name: "Jordyn Septimus",
		designation: "Software Engineer",
		image: "/images/team-member-4.png",
	},
	{
		id: "5",
		name: "Marilyn Levin",
		designation: "Software Engineer",
		image: "/images/team-member-5.png",
	},
];

export default function Teams() {
	return (
		<div>
			{/* Page Header */}
			<PageHeader
				title="Teams"
				crumbs={[
					{ label: "Pages" },
					{ label: "Teams", href: ROUTES.DASHBOARD.TEAMS },
				]}
			/>

			<div className="p-6">
				{/* Main Content Card */}
				<div className="bg-white rounded-2xl shadow-sm p-6">
					<h1 className="text-3xl font-bold mb-6">My Team</h1>

					{/* Search + Filters */}
					<div className="flex flex-col md:flex-row md:items-center mb-6">
						{/* Search */}
						<div className="flex-1 max-w-sm">
							<TableSearch placeholder="Search by Name" />
						</div>

						{/* Filters */}
						<div className="flex flex-wrap gap-3">
							<Select>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Expertise" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="frontend">Frontend</SelectItem>
									<SelectItem value="backend">Backend</SelectItem>
									<SelectItem value="fullstack">Full Stack</SelectItem>
								</SelectContent>
							</Select>

							<Select>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="lahore">Lahore</SelectItem>
									<SelectItem value="karachi">Karachi</SelectItem>
									<SelectItem value="islamabad">Islamabad</SelectItem>
								</SelectContent>
							</Select>

							<Select>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="manager">Manager</SelectItem>
									<SelectItem value="developer">Developer</SelectItem>
									<SelectItem value="designer">Designer</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Cards Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{teamData.map((member) => (
							<Link key={member.id} href={`/teams/${member.id}`}>
								<TeamsCard
									image={member.image}
									name={member.name}
									designation={member.designation}
									description="There are many variations of passages of Lorem Ipsum available."
								/>
							</Link>
						))}
					</div>

					{/* Pagination */}
					<div className="mt-6 flex justify-end">
						{/* <CardTablePagination /> */}
					</div>
				</div>
			</div>
		</div>
	);
}
