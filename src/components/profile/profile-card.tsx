"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea"; // ✅ Shadcn textarea
import { Button } from "../ui/button"; // ✅ Shadcn button
import { Pencil } from "lucide-react";
import Image from "next/image";
import { ProfilePictureDialog } from "./ProfilePictureDialog";

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

const data = {
  id: 1,
  name: "Brian F.",
  role: "Designer",
  email: "john.doe@example.com",
  phone: "1234567890",
  joinDate: "2021-01-01",
  department: "Engineering",
  reportingTo: "Brian F.",
  address: "123 Main St",
  city: "New York",
  branch: "New York",
  status: "Active Employee",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  profileImage: "https://via.placeholder.com/150",
  qualification_details:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  profile_picture_url: "https://via.placeholder.com/150",
  profile_picture: "https://via.placeholder.com/150",
  active: true,
  branch_detail: {
    department_detail: {
      name: "Engineering",
    },
  },
};

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
  const e: unknown = data ?? employee;
  const resolved: Employee | null = e
    ? {
        id: String((e as { id?: number | string }).id ?? ""),
        name:
          (e as { full_name?: string; name?: string }).full_name ??
          (e as { full_name?: string; name?: string }).name ??
          "",
        role:
          (e as { emp_role?: string; job_title?: string }).emp_role ??
          (e as { emp_role?: string; job_title?: string }).job_title ??
          "",
        email:
          (e as { email?: string; user_email?: string }).email ??
          (e as { email?: string; user_email?: string }).user_email ??
          "",
        phone:
          (e as { phone?: string; phone_number?: string }).phone ??
          (e as { phone?: string; phone_number?: string }).phone_number ??
          "",
        joinDate: (e as { join_date?: string }).join_date
          ? new Date(
              (e as { join_date?: string }).join_date!
            ).toLocaleDateString()
          : "",
        department:
          (e as { branch_detail?: { department_detail?: { name?: string } } })
            .branch_detail?.department_detail?.name ??
          (e as { department_name?: string; department?: string })
            .department_name ??
          (e as { department_name?: string; department?: string }).department ??
          "",
        reportingTo:
          (e as { supervisor_name?: string; reportingTo?: string })
            .supervisor_name ??
          (e as { supervisor_name?: string; reportingTo?: string })
            .reportingTo ??
          "--",
        address: (e as { address?: string }).address ?? "",
        city:
          (e as { user_city?: string; city?: string }).user_city ??
          (e as { user_city?: string; city?: string }).city ??
          "",
        branch:
          (e as { branch_name?: string; branch?: string }).branch_name ??
          (e as { branch_name?: string; branch?: string }).branch ??
          "",
        status: (e as { active?: boolean }).active ? "ACTIVE" : "INACTIVE",
        bio:
          (e as { qualification_details?: string }).qualification_details ?? "",
        profileImage:
          (e as { profile_picture_url?: string; profile_picture?: string })
            .profile_picture_url ??
          (e as { profile_picture_url?: string; profile_picture?: string })
            .profile_picture ??
          "",
      }
    : null;

  const [bio, setBio] = useState(resolved?.bio || "");

  if (!resolved) {
    return (
      <Card className="border-none rounded-lg shadow-[0px_4px_30px_0px_#2E2D740c] gap-0 p-8">
        Loading...
      </Card>
    );
  }

  // Helper to render an icon from public/icons with brand color using CSS mask
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
    <Card className="border-none mx-auto my w-[1374px] h-[617px] rounded-lg shadow-[0px_4px_30px_0px_#2E2D740c] gap-0">
      {/* Profile Header Section */}
      <div className="px-8 py-6">
        <div className="flex flex-col md:flex-row items-start w-full gap-6">
          {/* Profile Picture + Edit */}
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
            {/* Edit button bottom-right */}
            <ProfilePictureDialog image={resolved.profileImage} name={resolved.name} />


            {/* <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-1 right-1 rounded-full bg-white shadow-md"
            >
              <Image src="/icons/edit.svg" width={24} height={24} alt="edit" />
            </Button> */}
          </div>

          {/* Info + Bio */}
          <div className="flex flex-1 flex-col items-start mt-5 md:flex-row w-full">
            {/* Left Side: Status, Name, Role */}
            <div className="flex flex-col gap-2 min-w-[150px]">
              <Badge
                variant="secondary"
                className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-sm self-start whitespace-nowrap"
              >
                {resolved.status}
              </Badge>

              <h1 className="text-base font-semibold text-[#1D1F2C]">
                {resolved.name}
              </h1>

              <p className="text-sm text-[#667085]">{resolved.role}</p>
            </div>

            {/* Right Side: Bio + Edit */}
            <div className="flex-1 max-w-3xl flex items-end gap-1">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about the employee..."
                className="min-h-[120px] resize-none border-[#E2E8F0]"
              />

              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white shadow-md"
              >
                <Image
                  src="/icons/edit.svg"
                  width={24}
                  height={24}
                  alt="edit"
                />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-[#E0E2E7] mt-6" />
      </div>

      <div className="p-8 pt-0">
        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              iconSrc: "/icons/id-badge.svg",
              label: "User ID",
              value: resolved.id,
            },
            {
              iconSrc: "/icons/envelope.svg",
              label: "E-mail",
              value: resolved.email,
            },
            {
              iconSrc: "/icons/smartphone.svg",
              label: "Phone Number",
              value: resolved.phone,
            },
            {
              iconSrc: "/icons/calendar.svg",
              label: "Join Date",
              value: resolved.joinDate,
            },
            {
              iconSrc: "/icons/hierarchy.svg",
              label: "Department",
              value: resolved.department,
            },
            {
              iconSrc: "/icons/manager.svg",
              label: "Reporting to",
              value: resolved.reportingTo,
            },
            {
              iconSrc: "/icons/map-pin.svg",
              label: "Address",
              value: resolved.address,
            },
            {
              iconSrc: "/icons/map-pin.svg",
              label: "City",
              value: resolved.city,
            },
            {
              iconSrc: "/icons/branch.svg",
              label: "Branch",
              value: resolved.branch,
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Icon from public/icons */}
              <div className="w-10 h-10 rounded-full bg-[#F0F1F3] grid place-items-center flex-shrink-0">
                <PublicIcon src={item.iconSrc} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#667085] mb-1">{item.label}</p>
                <p className="text-sm font-medium text-[#1D1F2C] truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
