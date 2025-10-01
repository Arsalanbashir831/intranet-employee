"use client";

import BannerSection from "@/components/common/banner-section";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/hooks/constants/routes";
import FeatureCard from "@/components/common/feature-card";
import Checklist from "@/components/common/checklist";
import QuickAccess from "@/components/common/quick-access";
import TeamSection from "@/components/teams/team-section";
import RecentPolicies from "@/components/common/recent-policies";
import ContactSection from "@/components/common/contact-section";
import KnowledgeBaseTable from "@/components/knowledge-base/knowledge-base-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const cards = [
	{
		image: "/images/office-work.png",
		title: "New technology awareness.",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		badgeLines: ["30", "Nov", "2021"],
	},
	{
		image: "/images/office-work.png",
		title: "Client meeting discussion.",
		description:
			"About to in so terms voice at. Equal an would is found seems of.",
		badgeLines: ["04", "Dec", "2021"],
	},
	{
		image: "/images/office-work.png",
		title: "Fast growth for business",
		description:
			"It more shed went up is roof if loud case. Delay music livel noise an.",
		badgeLines: ["04", "Dec", "2021"],
	},
	{
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
			{/* PAGE CONTAINER — same padding everywhere */}
			<main
				className="
          mx-auto w-full
          px-4 py-4 sm:px-6 md:px-8 lg:px-10 min-[1920px]:px-12 min-[2560px]:px-16
          max-w-[95rem] lg:max-w-[110rem] min-[2560px]:max-w-[140rem]
          space-y-8 sm:space-y-10 lg:space-y-12 min-[1920px]:space-y-14
        ">
				{/* ANNOUNCEMENTS — consistent inner padding */}
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<h2 className="font-semibold leading-tight text-2xl sm:text-3xl md:text-4xl">
							Latest Announcements
						</h2>
						<Link
							href="/company-hub"
							className="flex items-center underline font-medium text-[#E5004E] text-sm sm:text-base md:text-lg">
							View More
							<ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
						</Link>
					</div>

					{/* Cards */}
					<div className="mt-6">
						{/* Mobile/Tablet grid (no x-scroll) */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:hidden">
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

						{/* Desktop+ horizontal scroller with edge alignment */}
						<div className="hidden lg:block">
							{/* pull to edges, then push inner padding so first/last card align */}
							<div className="-mx-6 sm:-mx-8 lg:-mx-10">
								<div className="overflow-x-auto px-6 sm:px-8 lg:px-10">
									<div className="flex gap-8">
										{cards.map((c, i) => (
											<div
												key={`d-${i}`}
												className="flex-shrink-0 w-[340px] md:w-[360px] lg:w-[380px]">
												<FeatureCard
													image={c.image}
													title={c.title}
													description={c.description}
													badgeLines={c.badgeLines}
													className="w-full h-full"
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* BOTTOM SECTION — consistent gaps */}
				<section className="pb-7">
					<div
						className="
              grid w-full
              grid-cols-1
              md:grid-cols-[32%_60%] lg:grid-cols-[30%_65%] xl:grid-cols-[28%_70%]
              gap-6 sm:gap-8 lg:gap-10 min-[1920px]:gap-12
            ">
						{/* Left column */}
						<div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
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
								tasks={[]}
							/>
							<ContactSection />
						</div>

						{/* Right column */}
						<div className="flex flex-col gap-5	">
							<div className="w-full">
								<QuickAccess />
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 auto-rows-fr">
								<section className="w-full overflow-hidden rounded-xl">
									<TeamSection />
								</section>
								<section className="w-full overflow-hidden rounded-xl">
									<RecentPolicies />
								</section>
							</div>

							{/* Knowledge Base — size cap + full width inside */}
							<div className="w-full">
								<div className="max-w-[950px] h-[231px] rounded-xl overflow-hidden">
									<KnowledgeBaseTable
										showToolbar={false}
										limit={4}
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
