"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import { ProfilePictureDialog } from "./ProfilePictureDialog";
// import { RichTextEditor } from "../common/rich-text-editor";
// import Image from "next/image";
import { useMe } from "@/hooks/queries/use-auth";
// import { useUpdateEmployee } from "@/hooks/queries/use-employees";
// import { toast } from "sonner";
import type { Employee as ApiEmployee } from "@/services/auth";

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
  bio: string;
  profileImage: string;
}

interface EmployeeProfileCardProps {
  employee?: Employee;
}

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
  const { data, isLoading, isError } = useMe();
  // const { mutate: updateEmployeeMutation } = useUpdateEmployee();
  // const [isEditingEducation, setIsEditingEducation] = useState(false);
  // Transform API data to match component structure
  const apiEmployee = data?.employee as ApiEmployee | undefined;
  const resolvedEmployee: Employee | undefined = apiEmployee
    ? {
        id: apiEmployee.id.toString(),
        name: apiEmployee.emp_name,
        role: apiEmployee.role,
        email: apiEmployee.email,
        phone: apiEmployee.phone,
        joinDate: new Date(apiEmployee.hire_date).toLocaleDateString(),
        department:
          apiEmployee.branch_departments?.[0]?.department?.dept_name || "",
        reportingTo: apiEmployee.branch_departments?.[0]?.manager
          ? apiEmployee.branch_departments[0].manager.employee.emp_name
          : "--",
        address: apiEmployee.address,
        city: apiEmployee.city,
        branch: apiEmployee.branch_departments?.[0]?.branch?.branch_name || "",
        status: "Active Employee", // Default status
        education: apiEmployee.education || "",
        bio: apiEmployee.bio || "",
        profileImage: apiEmployee.profile_picture || "",
      }
    : employee;

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

  // const handleSaveEducation = () => {
  // 	updateEmployeeMutation(
  // 		{ education }, // Use the current education state value
  // 		{
  // 			onSuccess: () => {
  // 				toast.success("Education updated successfully");
  // 				setIsEditingEducation(false);
  // 				// Update initialEducation to the new value after successful save
  // 				setInitialEducation(education);
  // 			},
  // 			onError: (error) => {
  // 				toast.error("Failed to update education");
  // 				console.error("Failed to update education:", error);
  // 			},
  // 		}
  // 	);
  // };

  return (
    <div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-2">
      <Card
        className="
          mx-auto w-full max-w-[1374px]
          rounded-2xl border-0 bg-white
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7
        "
      >
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 sm:gap-6">
          {/* Left: Avatar + name/role + status + edit pic */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative">
              <Avatar className="size-20 sm:size-24 md:size-28">
                <AvatarImage
                  src={
                    resolvedEmployee.profileImage || "/logos/profile-circle.svg"
                  }
                  alt={resolvedEmployee.name}
                />
                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                  {resolvedEmployee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* <ProfilePictureDialog
								image={resolvedEmployee.profileImage}
								name={resolvedEmployee.name}
							/> */}
            </div>

            <div className="min-w-0">
              <Badge className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-xs">
                {resolvedEmployee.status}
              </Badge>

              <div className="mt-2 text-[#111827] font-semibold">
                {resolvedEmployee.name}
              </div>
              <div className="text-sm text-[#6B7280]">
                {resolvedEmployee.role}
              </div>
            </div>
          </div>

          {/* Right: Bio */}
          <div className="flex-1 w-full">
            <div className="w-full">
              {resolvedEmployee.bio && resolvedEmployee.bio.includes("<") ? (
                <div
                  className="min-h-[50px] border border-[#E2E8F0]  text-[#535862] p-3 rounded-md overflow-y-auto w-full text-sm"
                  dangerouslySetInnerHTML={{ __html: resolvedEmployee.bio }}
                />
              ) : resolvedEmployee.bio ? (
                <Textarea
                  value={resolvedEmployee.bio}
                  readOnly
                  className="min-h-[50px] resize-none border-[#E2E8F0] w-full"
                />
              ) : (
                <Textarea
                  value="No bio information available"
                  readOnly
                  className="min-h-[50px] resize-none border-[#E2E8F0] w-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-5 sm:my-6 bg-[#E7E9EE]" />

        {/* Details grid */}
        <div
          className="
            grid gap-x-6 gap-y-6
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          "
        >
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
            {
              icon: "/icons/map-pin.svg",
              label: "City",
              value: resolvedEmployee.city,
            },
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

        {/* Qualification Section */}
        <section className="mt-2 sm:mt-2">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 pb-2 border-b border-[#E5E7EB]">
            QUALIFICATION
          </h3>

          <div className="mt-4 sm:mt-5">
            {resolvedEmployee.education &&
            resolvedEmployee.education.includes("<") ? (
              <div
                className="text-[#535862] leading-relaxed prose prose-sm sm:prose-base focus:outline-none prose-p:leading-relaxed prose-pre:p-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 [&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
                dangerouslySetInnerHTML={{ __html: resolvedEmployee.education }}
              />
            ) : resolvedEmployee.education ? (
              <div className="text-[#535862] leading-relaxed whitespace-pre-wrap">
                {resolvedEmployee.education}
              </div>
            ) : (
              <div className="text-[#6B7280]">
                No qualifications and education information available
              </div>
            )}
          </div>
        </section>
      </Card>
    </div>
  );
}
