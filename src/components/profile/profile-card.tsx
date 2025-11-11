"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";
import { useMe } from "@/hooks/queries/use-auth";
import { useMemo } from "react";
import {
  type EmployeeProfileData,
  transformApiEmployeeToProfileData,
  getInitials,
  isHtmlContent,
  PROFILE_CONSTANTS,
} from "@/lib/profile-utils";
import { DETAIL_FIELDS, type DetailField } from "@/constants/profile";
import { PinkIcon } from "./profile-icon";
import type { EmployeeProfileCardProps } from "@/types/profile";

const { DEFAULT_PROFILE_IMAGE, EMPTY_VALUE } = PROFILE_CONSTANTS;

function LoadingState() {
  return (
    <div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-2">
      <Card className="mx-auto w-full max-w-[1374px] rounded-2xl border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 sm:gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <Skeleton className="size-20 sm:size-24 md:size-28 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </div>

          <Separator className="bg-[#E7E9EE]" />

          {/* Details grid skeleton */}
          <div className="grid gap-x-6 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>

          {/* Qualification section skeleton */}
          <section className="mt-2 sm:mt-2">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-24 w-full" />
          </section>
        </div>
      </Card>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-2">
      <Card className="mx-auto w-full max-w-[1374px] rounded-2xl border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7">
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">Error loading profile data</p>
        </div>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-2">
      <Card className="mx-auto w-full max-w-[1374px] rounded-2xl border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7">
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No profile data available</p>
        </div>
      </Card>
    </div>
  );
}

function BioSection({ bio }: { bio: string }) {
  if (isHtmlContent(bio)) {
    return (
      <div
        className="min-h-[50px] border border-[#E2E8F0] text-[#535862] p-3 rounded-md overflow-y-auto w-full text-sm"
        dangerouslySetInnerHTML={{ __html: bio }}
      />
    );
  }

  if (bio) {
    return (
      <Textarea
        value={bio}
        readOnly
        className="min-h-[50px] resize-none border-[#E2E8F0] w-full"
      />
    );
  }

  return (
    <Textarea
      value="No bio information available"
      readOnly
      className="min-h-[50px] resize-none border-[#E2E8F0] w-full"
    />
  );
}

function EducationSection({ education }: { education: string }) {
  if (!education) {
    return (
      <div className="text-[#6B7280]">
        No qualifications and education information available
      </div>
    );
  }

  if (isHtmlContent(education)) {
    return (
      <div
        className="text-[#535862] leading-relaxed prose prose-sm sm:prose-base focus:outline-none prose-p:leading-relaxed prose-pre:p-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 [&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
        dangerouslySetInnerHTML={{ __html: education }}
      />
    );
  }

  return (
    <div className="text-[#535862] leading-relaxed whitespace-pre-wrap">
      {education}
    </div>
  );
}

function ProfileHeader({ employee }: { employee: EmployeeProfileData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 sm:gap-6">
      {/* Left: Avatar + name/role + status */}
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="relative">
          <Avatar className="size-20 sm:size-24 md:size-28">
            <AvatarImage
              src={employee.profileImage || DEFAULT_PROFILE_IMAGE}
              alt={employee.name}
            />
            <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0">
          <Badge className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-xs">
            {employee.status}
          </Badge>
          <div className="mt-2 text-[#111827] font-semibold">
            {employee.name}
          </div>
          <div className="text-sm text-[#6B7280]">{employee.role}</div>
        </div>
      </div>

      {/* Right: Bio */}
      <div className="flex-1 w-full">
        <BioSection bio={employee.bio} />
      </div>
    </div>
  );
}

function ProfileDetails({ employee }: { employee: EmployeeProfileData }) {
  const detailFields: DetailField[] = useMemo(
    () => [
      {
        ...DETAIL_FIELDS[0],
        value: `ID-${employee.id}`,
      },
      {
        ...DETAIL_FIELDS[1],
        value: employee.email,
      },
      {
        ...DETAIL_FIELDS[2],
        value: employee.phone,
      },
      {
        ...DETAIL_FIELDS[3],
        value: employee.joinDate,
      },
      {
        ...DETAIL_FIELDS[4],
        value: employee.department,
      },
      {
        ...DETAIL_FIELDS[5],
        value: employee.reportingTo,
      },
      {
        ...DETAIL_FIELDS[6],
        value: employee.branch,
      },
    ],
    [employee]
  );

  return (
    <div className="grid gap-x-6 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {detailFields.map((field) => (
        <div key={field.label} className="flex items-start gap-3">
          <div className="mt-0.5 size-9 rounded-full bg-[#FFE9F1] grid place-items-center">
            <PinkIcon src={field.icon} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] text-[#6B7280]">{field.label}</div>
            <div className="text-[13px] sm:text-sm font-medium text-[#111827] truncate">
              {field.value || EMPTY_VALUE}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Main Component ---------- */
export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
  const { data, isLoading, isError } = useMe();

  const resolvedEmployee = useMemo<EmployeeProfileData | undefined>(() => {
    if (employee) return employee;
    if (data?.employee) {
      return transformApiEmployeeToProfileData(data.employee);
    }
    return undefined;
  }, [employee, data?.employee]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!resolvedEmployee) {
    return <EmptyState />;
  }

  return (
    <div className="w-full bg-[#F8F8F8] py-4 sm:py-6 lg:py-2">
      <Card className="mx-auto w-full max-w-[1374px] rounded-2xl border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7">
        <ProfileHeader employee={resolvedEmployee} />

        <Separator className="my-5 sm:my-6 bg-[#E7E9EE]" />

        <ProfileDetails employee={resolvedEmployee} />

        {/* Qualification Section */}
        <section className="mt-2 sm:mt-2">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 pb-2 border-b border-[#E5E7EB]">
            QUALIFICATION
          </h3>
          <div className="mt-4 sm:mt-5">
            <EducationSection education={resolvedEmployee.education} />
          </div>
        </section>
      </Card>
    </div>
  );
}
