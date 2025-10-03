// app/(dashboard)/teams/[id]/page.tsx
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { TeamsDetailsCard } from "@/components/teams/teams-details";
import { ROUTES } from "@/constants/routes";

type PageProps = { params: Promise<{ id: string }> }; // 👈 params is a Promise

const teamData = [
	{
		id: "1",
		name: "Jocelyn Schleifer",
		role: "Manager",
		address: "3890 Poplar Dr.",
		city: "Lahore",
		branch: "Lahore",
		status: "ACTIVE",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		profileImage: "/images/team-member-1.png",
	},
	{
		id: "2",
		name: "John Doe",
		role: "Developer",
		address: "123 Main St.",
		city: "Karachi",
		branch: "Karachi",
		status: "ACTIVE",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		profileImage: "/images/team-member-2.png",
	},
];

export default async function TeamSlug({ params }: PageProps) {
	const { id } = await params; // 👈 Await params
	const member = teamData.find((m) => String(m.id) === String(id));

	if (!member) return notFound();

	return (
		<div>
			<PageHeader
				title="Teams"
				crumbs={[
					{ label: "Pages" },
					{ label: "Teams", href: ROUTES.DASHBOARD.TEAMS },
				]}
			/>
			<TeamsDetailsCard employee={member} />
		</div>
	);
}
