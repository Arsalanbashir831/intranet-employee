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

const cards = [
	{
		id: "1",
		image: "/images/office-work.png",
		title: "New technology awareness.",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		badgeLines: ["30", "Nov", "2021"],
	},
	{
		id: "2",
		image: "/images/office-work.png",
		title: "Client meeting discussion.",
		description:
			"About to in so terms voice at. Equal an would is found seems of.",
		badgeLines: ["04", "Dec", "2021"],
	},
	{
		id: "3",
		image: "/images/office-work.png",
		title: "Fast growth for business",
		description:
			"It more shed went up is roof if loud case. Delay music livel noise an.",
		badgeLines: ["04", "Dec", "2021"],
	},
	{
		id: "4",
		image: "/images/office-work.png",
		title: "Fourth Announcement",
		description:
			"Static extra card example for testing the grid layout with 4+ items.",
		badgeLines: ["10", "Dec", "2021"],
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<BannerSection />
			<PageHeader
				title="Home"
				crumbs={[
					{ label: "Pages" },
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
				<section className="bg-white rounded-2xl overflow-hidden p-[calc(var(--gap)*1.25)]">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[var(--gap)]">
						<h2 className="font-semibold leading-tight text-2xl sm:text-xl md:text-2xl">
							Latest Announcements
						</h2>
						<Link
							href="/company-hub"
							className="flex items-center underline font-medium text-[#E5004E] text-sm sm:text-base md:text-md">
							View More
							<ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-5" />
						</Link>
					</div>

					{/* Mobile / Tablet grid (no x-scroll) */}
					<div className="mt-[var(--gap)] grid grid-cols-1 md:grid-cols-2 gap-[var(--gap)] lg:hidden">
						{cards.map((c, i) => (
							<FeatureCard
								key={`m-${i}`}
								image={c.image}
								title={c.title}
								description={c.description}
								badgeLines={c.badgeLines}
								className="w-full"
							/>
						))}
					</div>

					{/* Desktop+: true horizontal scroller with edge alignment, no right gap */}
					{/* Desktop+: horizontal scroll ONLY for cards */}
					<div className="mt-[var(--gap)] hidden lg:block">
						<ScrollArea className="w-full">
							<div className="flex gap-[var(--gap)] py-1 snap-x snap-mandatory pr-[calc(var(--gap)*1.25)]">
								{cards.map((c, i) => (
									<div
										key={`d-${i}`}
										className="flex-shrink-0 snap-start w-[360px] xl:w-[380px]">
										<FeatureCard
											image={c.image}
											title={c.title}
											link={`/company-hub/${c.id}`}
											description={c.description}
											badgeLines={c.badgeLines}
											className="w-full h-full"
										/>
									</div>
								))}
							</div>
							<ScrollBar orientation="horizontal" className="mt-[var(--gap)]" />
						</ScrollArea>
					</div>
				</section>

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
