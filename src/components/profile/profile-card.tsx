"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Image from "next/image";
import { ProfilePictureDialog } from "./ProfilePictureDialog";
import { RichTextEditor } from "../common/rich-text-editor";

/* ---------- Types ---------- */
interface Employee {
	id: string;
	name: string;
	role: string;
	email: string;
	phone: string;
	joinDate: string;
	department: string;
	reportingTo: string;
	address: string;
	city: string;
	branch: string;
	status: string;
	bio: string;
	profileImage: string;
}
interface EmployeeProfileCardProps {
	employee?: Employee;
	employeeId?: number | string;
}

/* ---------- Demo fallback ---------- */
const data = {
	id: 1,
	name: "Brian F.",
	role: "Design",
	email: "lindablair@mail.com",
	phone: "050 414 8778",
	joinDate: "2022-12-12",
	department: "HR",
	reportingTo: "Flores",
	address: "3890 Poplar Dr.",
	city: "Lahore",
	branch: "Lahore",
	status: "Active Employee",
	bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	profileImage: "https://via.placeholder.com/280",
	active: true,
	branch_detail: { department_detail: { name: "HR" } },
};

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
	const e: any = employee ?? data;

	const resolved: Employee = {
		id: String(e.id ?? ""),
		name: e.full_name ?? e.name ?? "",
		role: e.emp_role ?? e.job_title ?? e.role ?? "",
		email: e.email ?? e.user_email ?? "",
		phone: e.phone ?? e.phone_number ?? "",
		joinDate: e.join_date
			? new Date(e.join_date).toLocaleDateString()
			: e.joinDate ?? "",
		department:
			e.branch_detail?.department_detail?.name ??
			e.department_name ??
			e.department ??
			"",
		reportingTo: e.supervisor_name ?? e.reportingTo ?? "--",
		address: e.address ?? "",
		city: e.user_city ?? e.city ?? "",
		branch: e.branch_name ?? e.branch ?? "",
		status: e.active === false ? "INACTIVE" : e.status ?? "Active Employee",
		bio: e.qualification_details ?? e.bio ?? "",
		profileImage:
			e.profile_picture_url ?? e.profile_picture ?? e.profileImage ?? "",
	};

	const [isEditingBio, setIsEditingBio] = useState(false);
	const [bio, setBio] = useState(resolved.bio || "");

	// Pink masked icon helper
	const PinkIcon = ({ src, size = 18 }: { src: string; size?: number }) => (
		<span
			aria-hidden
			className="inline-block bg-[#E5004E]"
			style={{
				width: size,
				height: size,
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
		<div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-8">
			<Card
				className="
          mx-auto w-full max-w-[1200px]
          rounded-2xl border-0 bg-white
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7
        ">
				{/* Top row */}
				<div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 sm:gap-6">
					{/* Left: Avatar + name/role + status + edit pic */}
					<div className="flex items-start gap-4 sm:gap-5">
						<div className="relative">
							<Avatar className="size-20 sm:size-24 md:size-28">
								<AvatarImage src={resolved.profileImage} alt={resolved.name} />
								<AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
									{resolved.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<ProfilePictureDialog
								image={resolved.profileImage}
								name={resolved.name}
							/>
						</div>

						<div className="min-w-0">
							<Badge className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-xs">
								{resolved.status}
							</Badge>

							<div className="mt-2 text-[#111827] font-semibold">
								{resolved.name}
							</div>
							<div className="text-sm text-[#6B7280]">{resolved.role}</div>
						</div>
					</div>

					{/* Right: Bio with border and floating edit button */}
					<div className="relative">
						{isEditingBio ? (
							<>
								<RichTextEditor
									content={bio}
									onChange={setBio}
									className="min-h-[140px] border border-[#E5E7EB] rounded-md bg-white"
								/>
								<div className="mt-2 flex justify-end gap-2">
									<Button
										variant="outline"
										onClick={() => setIsEditingBio(false)}>
										Cancel
									</Button>
									<Button
										className="bg-[#E5004E] hover:bg-[#c90043] text-white"
										onClick={() => setIsEditingBio(false)}>
										Save
									</Button>
								</div>
							</>
						) : (
							<>
								<Textarea
									value={bio}
									readOnly
									className="
                    min-h-[120px] resize-none
                    border border-[#E5E7EB] bg-white rounded-md
                    text-[13px] sm:text-sm
                  "
								/>
								<button
									type="button"
									onClick={() => setIsEditingBio(true)}
									aria-label="Edit bio"
									className="
                    absolute -right-2 sm:right-0 -top-2 sm:-top-3
                    size-8 rounded-full bg-white shadow-md ring-1 ring-black/5
                    grid place-items-center
                  ">
									<PinkIcon src="/icons/edit.svg" />
								</button>
							</>
						)}
					</div>
				</div>

				{/* Divider */}
				<Separator className="my-5 sm:my-6 bg-[#E7E9EE]" />

				{/* Details grid */}
				<div
					className="
            grid gap-x-6 gap-y-6
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          ">
					{[
						{
							icon: "/icons/id-badge.svg",
							label: "User ID",
							value: `ID-${resolved.id}`,
						},
						{
							icon: "/icons/envelope.svg",
							label: "E-mail",
							value: resolved.email,
						},
						{
							icon: "/icons/smartphone.svg",
							label: "Phone Number",
							value: resolved.phone,
						},
						{
							icon: "/icons/calendar.svg",
							label: "Join Date",
							value: resolved.joinDate,
						},
						{
							icon: "/icons/hierarchy.svg",
							label: "Department",
							value: resolved.department,
						},
						{
							icon: "/icons/manager.svg",
							label: "Reporting to",
							value: resolved.reportingTo,
						},
						{
							icon: "/icons/map-pin.svg",
							label: "Address",
							value: resolved.address,
						},
						{ icon: "/icons/map-pin.svg", label: "City", value: resolved.city },
						{
							icon: "/icons/branch.svg",
							label: "Branch",
							value: resolved.branch,
						},
					].map((row) => (
						<div key={row.label} className="flex items-start gap-3">
							<div className="mt-0.5 size-9 rounded-full bg-[#FFE9F1] grid place-items-center">
								<PinkIcon src={row.icon} />
							</div>
							<div className="min-w-0">
								<div className="text-[12px] text-[#6B7280]">{row.label}</div>
								<div className="text-[13px] sm:text-sm font-medium text-[#111827] truncate">
									{row.value || "--"}
								</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}
