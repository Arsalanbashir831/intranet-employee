"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
interface Employee {
	id: string;
	name: string;
	role: string;
	address: string;
	city: string;
	branch: string;
	status: string;
	bio: string;
	profileImage: string;
}

interface EmployeeProfileCardProps {
	employee?: Employee;
}

const data = {
	name: "Jocelyn Schleifer",
	role: "Manager",
	address: "3890 Poplar Dr.",
	city: "Lahore",
	branch: "Lahore",
	status: "ACTIVE",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	profileImage: "https://via.placeholder.com/150",
};

export function TeamsDetailsCard({ employee }: EmployeeProfileCardProps) {
	const e = employee ?? data;
	const resolved: Employee = {
		...e,
		id: "1",
		status: e.status === "ACTIVE" ? "Active Employee" : "Inactive",
	};

	const PublicIcon = ({ src }: { src: string }) => (
		<span
			className="size-4 bg-primary"
			style={{
				WebkitMaskImage: `url(${src})`,
				maskImage: `url(${src})`,
				WebkitMaskRepeat: "no-repeat",
				maskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
				maskPosition: "center",
				WebkitMaskSize: "contain",
				maskSize: "contain",
				display: "inline-block",
			}}
		/>
	);

	return (
		<div className="container mx-auto my-6">
			<Card className="border-none max-w-7xl mx-auto rounded-lg shadow-[0px_4px_30px_0px_#2E2D740c] p-8">
				{/* Slug Header */}
				<h2 className="text-xl font-semibold text-gray-800 mb-6">My Team</h2>

				{/* Profile Header Section */}
				<div className="flex border-b pb-6 flex-col md:flex-row items-start w-full gap-6">
					{/* Profile Picture */}
					<div className="relative">
						<Avatar className="size-36">
							<AvatarImage src={resolved.profileImage} alt={resolved.name} />
							<AvatarFallback className="text-lg font-semibold bg-gray-100 text-gray-600">
								{resolved.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
					</div>

					{/* Info + Bio */}
					<div className="flex flex-1 flex-col items-start mt-5 md:flex-row w-full">
						{/* Left Side: Status, Name, Role */}
						<div className="flex flex-col gap-2 min-w-[150px]">
							<Badge
								variant="secondary"
								className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-sm self-start whitespace-nowrap">
								{resolved.status}
							</Badge>

							<h1 className="text-base font-semibold text-[#1D1F2C]">
								{resolved.name}
							</h1>

							<p className="text-sm text-[#667085]">{resolved.role}</p>
						</div>

						{/* Right Side: Bio */}
						<div className="flex-1 max-w-3xl">
							<p className="text-sm text-gray-700 leading-relaxed">
								{resolved.bio}
							</p>
						</div>
					</div>
				</div>

				{/* Address, City, Branch */}
				<div className="flex flex-wrap gap-8">
					{[
						{
							iconSrc: "/icons/map-pin.svg",
							label: "Address",
							value: resolved.address,
						},
						{
							iconSrc: "/icons/hierarchy.svg",
							label: "City",
							value: resolved.city,
						},
						{
							iconSrc: "/icons/branch.svg",
							label: "Branch",
							value: resolved.branch,
						},
					].map((item, index) => (
						<div key={index} className="flex items-center gap-2 min-w-[200px]">
							<div className="w-8 h-8 rounded-full bg-[#F0F1F3] grid place-items-center flex-shrink-0">
								<PublicIcon src={item.iconSrc} />
							</div>
							<div>
								<p className="text-xs text-gray-500">{item.label}</p>
								<p className="text-sm font-medium text-gray-800">
									{item.value}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* About Section */}
				<h3 className="text-xl font-bold border-b text-gray-800 mt-3 pb-2		">
					ABOUT {resolved.name.toUpperCase()}
				</h3>

				<div>
					<div className="space-y-4 text-gray-700">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
