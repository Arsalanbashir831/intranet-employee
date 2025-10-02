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

/* Demo fallback */
const data: Employee = {
	id: "1",
	name: "Jocelyn Schleifer",
	role: "Manager",
	address: "3890 Poplar Dr.",
	city: "Lahore",
	branch: "Lahore",
	status: "ACTIVE",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
	profileImage: "https://via.placeholder.com/150",
};

export function TeamsDetailsCard({ employee }: EmployeeProfileCardProps) {
	const e = employee ?? data;
	const resolved: Employee = {
		...e,
		status: e.status === "ACTIVE" ? "Active Employee" : "Inactive",
	};

	const PublicIcon = ({ src }: { src: string }) => (
		<span
			className="inline-block size-4 bg-primary"
			style={{
				WebkitMaskImage: `url(${src})`,
				maskImage: `url(${src})`,
				WebkitMaskRepeat: "no-repeat",
				maskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
				maskPosition: "center",
				WebkitMaskSize: "contain",
				maskSize: "contain",
			}}
		/>
	);

	return (
		<div className="min-h-[1px] w-full bg-[#F8F8F8] py-5 sm:py-6 lg:py-5">
			{/* Page rails (no touching page edges) */}
			<main className="mx-auto w-full px-4 sm:px-6 md:px-4">
				<Card className="bg-white border-none rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 sm:p-6 lg:p-5">
					{/* Slug Header */}
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
						My Team
					</h2>

					{/* Profile Header Section */}
					<section className="flex flex-col md:flex-row items-start gap-5 sm:gap-6 border-b border-[#E5E7EB] pb-5 sm:pb-6">
						{/* Profile Picture */}
						<div className="relative">
							<Avatar className="size-24 sm:size-28 md:size-32 lg:size-36">
								<AvatarImage src={resolved.profileImage} alt={resolved.name} />
								<AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
									{resolved.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
						</div>

						{/* Info + Bio */}
						<div className="flex-1 w-full grid gap-4 md:gap-5 md:grid-cols-[minmax(160px,220px)_1fr]">
							{/* Left: status/name/role */}
							<div>
								<Badge className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-xs sm:text-sm">
									{resolved.status}
								</Badge>

								<h1 className="mt-2 text-base sm:text-lg font-semibold text-[#1D1F2C]">
									{resolved.name}
								</h1>
								<p className="text-sm text-[#667085]">{resolved.role}</p>
							</div>

							{/* Right: Bio */}
							<div className="min-w-0">
								<p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
									{resolved.bio}
								</p>
							</div>
						</div>
					</section>

					{/* Address, City, Branch */}
					<section className="mt-5 sm:mt-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
							].map((item) => (
								<div key={item.label} className="flex items-center gap-3">
									<div className="size-9 rounded-full bg-[#F0F1F3] grid place-items-center flex-shrink-0">
										<PublicIcon src={item.iconSrc} />
									</div>
									<div className="min-w-0">
										<p className="text-xs text-gray-500">{item.label}</p>
										<p className="text-sm font-medium text-gray-800 truncate">
											{item.value || "--"}
										</p>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* About Section */}
					<section className="mt-6 sm:mt-8">
						<h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 pb-2 border-b border-[#E5E7EB]">
							ABOUT {resolved.name.toUpperCase()}
						</h3>

						{/* readable line lengths on large screens */}
						<div className="mt-4 sm:mt-5 text-gray-700 leading-relaxed ">
							<div className="space-y-4">
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat.
								</p>
								<p>
									Duis aute irure dolor in reprehenderit in voluptate velit esse
									cillum dolore eu fugiat nulla pariatur. Excepteur sint
									occaecat cupidatat non proident, sunt in culpa qui officia
									deserunt mollit anim id est laborum.
								</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</p>
							</div>
						</div>
					</section>
				</Card>
			</main>
		</div>
	);
}
