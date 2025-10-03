// app/(dashboard)/home/page.tsx
"use client";

import BannerSection from "@/components/common/banner-section";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import FeatureCard from "@/components/common/feature-card";
import Checklist from "@/components/common/checklist";
import QuickAccess from "@/components/common/quick-access";
import TeamSection from "@/components/teams/team-section";
import RecentPolicies from "@/components/common/recent-policies";
import KnowledgeBaseTable from "@/components/knowledge-base/knowledge-base-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ContactSection from "@/components/common/contact-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LatestAnnouncements } from "@/components/dashboard/latest-announcements";



export default function Home() {
	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<BannerSection />
			<PageHeader
				title="Home"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Home", href: ROUTES.DASHBOARD.HOME },
				]}
			/>

			{/* one gutter to rule them all */}
			<main
				className="
          mx-auto w-full
          [--gap:1rem] sm:[--gap:1.125rem] lg:[--gap:1.25rem]
          px-[calc(var(--gap)*1.5)] py-[calc(var(--gap)*1.5)]
          max-w-[110rem] min-[2560px]:max-w-[140rem]
          space-y-[calc(var(--gap)*1.25)]
        ">
				{/* ============ Announcements (desktop = horizontal scroll) ============ */}
				<LatestAnnouncements />

				{/* ======================= Bottom area ======================= */}
				<section className="pb-[calc(var(--gap)*1.5)]">
					<div
						className="grid w-full grid-cols-1 md:grid-cols-[390px_minmax(0,1fr)]
            gap-[var(--gap)]">
						{/* Left column */}
						<div className="flex flex-col gap-[calc(var(--gap)*0.9)] w-full">
							<Checklist
								title="Task Checklist"
								viewMoreLink="/task-checklist"
								tasks={[
									"Follow the instructions and report everything properly",
									"Complete all assigned tasks on time",
									"Attend the scheduled team meeting promptly",
									"Update the documentation as per guidelines",
									"Submit the weekly report before Friday",
								]}
							/>
							<Checklist
								title="Training Checklist"
								viewMoreLink="/training-checklist"
								tasks={[
									"Follow the instructions and report everything properly",
									"Complete all assigned tasks on time",
									"Attend the scheduled team meeting promptly",
									"Update the documentation as per guidelines",
									"Submit the weekly report before Friday",
								]}
							/>
							{/* keep your contact block */}
							<div>
								{/* ContactSection keeps its own padding */}
								<ContactSection />
							</div>
						</div>

						{/* Right column */}
						<div className="flex flex-col gap-[calc(var(--gap)*0.9)] w-full">
							<div className="w-full">
								<QuickAccess />
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--gap)] auto-rows-fr">
								<section className="w-full overflow-hidden rounded-xl">
									<TeamSection />
								</section>
								<section className="w-full overflow-hidden rounded-xl">
									<RecentPolicies />
								</section>
							</div>

							{/* Knowledge Base */}
							<div className="w-full">
								<div className="rounded-xl h-[315px] overflow-hidden">
									<KnowledgeBaseTable
										showToolbar={false}
										limit={30}
										viewMoreHref="/knowledge-base"
										baseHref="/knowledge-base"
										className="bg-[#F9FFFF] gap-0 w-full h-full"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
