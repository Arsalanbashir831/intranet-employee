import { TeamsDetailsCard } from "@/components/teams/teams-details";

interface Params {
	params: {
		id: string;
	};
}

const teamData = [
	{
		id: "1",
		name: "Jocelyn Schleifer",
		role: "Manager",
		address: "3890 Poplar Dr.",
		city: "Lahore",
		branch: "Lahore",
		status: "ACTIVE",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
		profileImage: "/images/team-member-2.png",
	},
	// Add more members
];

export default function TeamById({ params }: Params) {
	const member = teamData.find((m) => m.id === params.id);

	if (!member) return <p>Team member not found.</p>;

	return <TeamsDetailsCard employee={member} />;
}
