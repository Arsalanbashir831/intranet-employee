"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import type {
  EmployeeProfileCard,
  EmployeeProfileCardProps,
} from "@/types/employees";

/* Demo fallback */
const data: EmployeeProfileCard = {
  id: "1",
  name: "Jocelyn Schleifer",
  role: "Manager",
  address: "3890 Poplar Dr.",
  city: "Lahore",
  branches: ["Lahore"],
  status: "ACTIVE",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  profileImage: "https://via.placeholder.com/150",
  email: "jocelyn@example.com",
  phone: "03001234567",
  hireDate: "2025-10-01",
  departments: ["IT"],
  manager: {
    name: "John Manager",
    role: "Senior Manager",
    profileImage: "https://via.placeholder.com/150",
  },
};

export function TeamsDetailsCard({ employee }: EmployeeProfileCardProps) {
  const e = employee ?? data;
  const resolved: EmployeeProfileCard = {
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
    <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
      {/* Page rails (no touching page edges) */}
      <main className="mx-auto w-full px-4 sm:px-6 md:px-4">
        <Card className="bg-white border-none rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 sm:p-6 lg:p-5">
          {/* Profile Header Section */}
          <section className="flex flex-col md:flex-row item-center md:items-start gap-5 sm:gap-6">
            {/* Profile Picture */}
            <div className="relative mx-auto">
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
            <div className="flex-1 w-full grid gap-4 md:gap-5 md:grid-cols-[minmax(160px,220px)_1fr] items-center justify-items-center md:justify-items-start md:items-start text-center md:text-left ">
              {/* Left: status/name/role */}
              <div>
                <Badge className="bg-[#1A9882] text-white rounded-full px-3 py-1 text-xs sm:text-sm">
                  {resolved.status}
                </Badge>

                <h1 className="mt-2text-base sm:text-lg font-semibold text-[#1D1F2C]">
                  {resolved.name}
                </h1>
                <p className="text-sm text-[#667085]">{resolved.role}</p>
                <div className="mt-3 space-y-2">
                  {resolved.branches && resolved.branches.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-full bg-[#F0F1F3] grid place-items-center flex-shrink-0">
                        <PublicIcon src="/icons/branch.svg" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Branch{resolved.branches.length > 1 ? "es" : ""}
                        </p>
                        <p className="text-xs font-medium text-gray-800">
                          {resolved.branches.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {resolved.departments && resolved.departments.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-full bg-[#F0F1F3] grid place-items-center flex-shrink-0">
                        <PublicIcon src="/icons/hierarchy.svg" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Department{resolved.departments.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs font-medium text-gray-800">
                          {resolved.departments.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Bio */}
              {/* <div className="min-w-0">
                {resolved.bio && resolved.bio !== "null" ? (
                  <div
                    className="text-sm sm:text-[15px] text-[#535862] leading-relaxed prose-p:leading-relaxed prose-pre:p-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 [&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: resolved.bio }}
                  />
                ) : (
                  <p className="text-sm sm:text-[15px] text-[#535862] leading-relaxed">
                    No bio available
                  </p>
                )}
              </div> */}
            </div>
          </section>
        </Card>
      </main>
    </div>
  );
}
