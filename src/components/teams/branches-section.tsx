"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useBranches } from "@/hooks/queries/use-branches";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import type { BranchCard } from "@/types/teams";

export default function BranchesSection() {
  const router = useRouter();

  // Fetch branches, limit to 3
  const { data, isLoading, isError } = useBranches(undefined, {
    page: 1,
    pageSize: 3,
  });

  // Transform API data to match component structure
  const branches: BranchCard[] =
    data?.branches?.results?.map((branch) => ({
      id: branch.id,
      name: branch.branch_name,
      employeeCount: branch.employee_count || 0,
    })) || [];

  const handleBranchClick = (branchId: number) => {
    // Navigate to people directory with branch filter pre-selected
    router.push(`${ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}?branch=${branchId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-tight">
            Branches
          </h2>
          <Link
            href={ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}
            className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base"
          >
            View More
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 flex items-center justify-center">
          <div>Loading branches...</div>
        </div>
      </Card>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-tight">
            Branches
          </h2>
          <Link
            href={ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}
            className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base"
          >
            View More
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 flex items-center justify-center">
          <div>Error loading branches</div>
        </div>
      </Card>
    );
  }

  // Show empty state
  if (branches.length === 0) {
    return (
      <Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-tight">
            Branches
          </h2>
          <Link
            href={ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}
            className="underline font-medium text-[#E5004E] text-xs sm:text-sm md:text-base"
          >
            View More
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 flex items-center justify-center">
          <div>No branches found</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#F9FFFF] rounded-lg p-3 gap-0 sm:p-4 md:p-5 flex flex-col max-h-[269px] min-h-[269px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2
          className="
            font-semibold text-gray-900
            text-base sm:text-lg md:text-xl
            leading-tight
          "
        >
          Branches
        </h2>

        <Link
          href={ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY}
          className="
            underline font-medium text-[#E5004E]
            text-xs sm:text-sm md:text-base
          "
        >
          View More
        </Link>
      </div>

      {/* Branches (scroll area) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
        {branches.map((branch) => (
          <div
            key={branch.id}
            onClick={() => handleBranchClick(branch.id)}
            className="w-full bg-white shadow-sm border border-gray-200 rounded-md px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {/* Left */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="min-w-0">
                <p className="text-sm sm:text-[0.95rem] font-medium text-gray-800 truncate">
                  {branch.name}
                </p>
                <Badge className="text-[10px] sm:text-xs px-2 py-0.5 bg-[#49A2A6] rounded-full mt-1">
                  {branch.employeeCount} employee
                  {branch.employeeCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            {/* Right */}
            <span className="underline font-medium text-[#E5004E] text-xs sm:text-sm flex-shrink-0">
              View
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
