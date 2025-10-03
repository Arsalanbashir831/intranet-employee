"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ProfilePictureDialog } from "./ProfilePictureDialog";
import { RichTextEditor } from "../common/rich-text-editor";
import Image from "next/image";
import { useEmployee, useUpdateEmployee } from "@/hooks/queries/use-employees";
import { toast } from "sonner";

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
	education: string;
	profileImage: string;
}

interface EmployeeProfileCardProps {
	employee?: Employee;
}

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
	const { data, isLoading, isError } = useEmployee();
	const { mutate: updateEmployeeMutation } = useUpdateEmployee();
	const [isEditingEducation, setIsEditingEducation] = useState(false);
	const [education, setEducation] = useState("");
	const [initialEducation, setInitialEducation] = useState("");

	// Transform API data to match component structure
	const resolvedEmployee: Employee | undefined = data?.employee ? {
		id: data.employee.id.toString(),
		name: data.employee.emp_name,
		role: data.employee.role,
		email: data.employee.email,
		phone: data.employee.phone,
		joinDate: new Date(data.employee.hire_date).toLocaleDateString(),
		department: data.employee.branch_department?.department?.dept_name || "",
		reportingTo: data.employee.branch_department?.manager ? 
			data.employee.branch_department.manager.employee.emp_name : "--",
		address: data.employee.address,
		city: data.employee.city,
		branch: data.employee.branch_department?.branch?.branch_name || "",
		status: "Active Employee", // Default status
		education: data.employee.education || "",
		profileImage: data.employee.profile_picture || "",
	} : employee;

	// Initialize education state when employee data is first loaded
	useEffect(() => {
		if (resolvedEmployee && !initialEducation) {
			setEducation(resolvedEmployee.education);
			setInitialEducation(resolvedEmployee.education);
		}
	}, [resolvedEmployee, initialEducation]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading profile data</div>;
	}

	if (!resolvedEmployee) {
		return <div>No profile data available</div>;
	}

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

	const handleSaveEducation = () => {
		updateEmployeeMutation(
			{ education }, // Use the current education state value
			{
				onSuccess: () => {
					toast.success("Education updated successfully");
					setIsEditingEducation(false);
					// Update initialEducation to the new value after successful save
					setInitialEducation(education);
				},
				onError: (error) => {
					toast.error("Failed to update education");
					console.error("Failed to update education:", error);
				},
			}
		);
	};

	return (
		<div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-2">
			<Card
				className="
          mx-auto w-full max-w-[1374px]
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
								<AvatarImage src={resolvedEmployee.profileImage} alt={resolvedEmployee.name} />
								<AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
									{resolvedEmployee.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>

							<ProfilePictureDialog
								image={resolvedEmployee.profileImage}
								name={resolvedEmployee.name}
								onSave={async ({ file }) => {
									// The hook in ProfilePictureDialog handles the API call
									console.log("Profile picture saved");
								}}
								onDelete={async () => {
									// The hook in ProfilePictureDialog handles the API call
									console.log("Profile picture deleted");
								}}
							/>
						</div>

						<div className="min-w-0">
							<Badge className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-xs">
								{resolvedEmployee.status}
							</Badge>

							<div className="mt-2 text-[#111827] font-semibold">
								{resolvedEmployee.name}
							</div>
							<div className="text-sm text-[#6B7280]">{resolvedEmployee.role}</div>
						</div>
					</div>

					{/* Right: Education with border and floating edit button */}
					<div className="flex-1 max-w-3xl flex items-end gap-1">
						{isEditingEducation ? (
							<div className="w-full">
								{/* Rich Text Editor in edit mode */}
								<RichTextEditor
									content={education}
									onChange={setEducation}
									className="min-h-[120px] border border-gray-200 rounded-md"
								/>

								{/* Action Buttons */}
								<div className="flex justify-end gap-2 mt-2">
									<Button
										variant="outline"
										onClick={() => {
											setIsEditingEducation(false);
											// Reset to initial value when canceling
											setEducation(initialEducation);
										}}>
										Cancel
									</Button>
									<Button
										className="bg-pink-600 hover:bg-pink-700 text-white"
										onClick={handleSaveEducation}>
										Save
									</Button>
								</div>
							</div>
						) : (
							<>
								{/* Readonly Education View */}
								{education && education.includes('<') ? (
									<div 
										className="min-h-[120px] border border-[#E2E8F0] bg-gray-50 p-3 rounded-md overflow-y-auto min-w-[75vw] md:min-w-[40vw] lg:min-w-[50vw]"
										dangerouslySetInnerHTML={{ __html: education }}
									/>
								) : education ? (
									<Textarea
										value={education}
										readOnly
										className="min-h-[120px] resize-none border-[#E2E8F0] bg-gray-50"
									/>
								) : (
									<Textarea
										value="No education information available"
										readOnly
										className="min-h-[120px] resize-none border-[#E2E8F0] bg-gray-50"
									/>
								)}

								{/* Edit Button */}
								<Button
									size="icon"
									variant="secondary"
									className="rounded-full bg-[#F0F1F3] shadow-md  group transition hover:bg-[#E5004E]"
									onClick={() => setIsEditingEducation(true)}>
									<Image
										src="/icons/edit.svg"
										width={18}
										height={19}
										alt="edit"
										className="transition group-hover:brightness-0 group-hover:invert"
									/>
								</Button>
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
							value: `ID-${resolvedEmployee.id}`,
						},
						{
							icon: "/icons/envelope.svg",
							label: "E-mail",
							value: resolvedEmployee.email,
						},
						{
							icon: "/icons/smartphone.svg",
							label: "Phone Number",
							value: resolvedEmployee.phone,
						},
						{
							icon: "/icons/calendar.svg",
							label: "Join Date",
							value: resolvedEmployee.joinDate,
						},
						{
							icon: "/icons/hierarchy.svg",
							label: "Department",
							value: resolvedEmployee.department,
						},
						{
							icon: "/icons/manager.svg",
							label: "Reporting to",
							value: resolvedEmployee.reportingTo,
						},
						{
							icon: "/icons/map-pin.svg",
							label: "Address",
							value: resolvedEmployee.address,
						},
						{ icon: "/icons/map-pin.svg", label: "City", value: resolvedEmployee.city },
						{
							icon: "/icons/branch.svg",
							label: "Branch",
							value: resolvedEmployee.branch,
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