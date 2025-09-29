"use client";

import BannerSection from "@/components/common/banner-section";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import FeatureCard from "@/components/common/feature-card";
import Checklist from "@/components/common/checklist";
import QuickAccess from "@/components/common/quick-access";
import TeamSection from "@/components/teams/team-section";
import RecentPolicies from "@/components/common/recent-policies";
import ContactSection from "@/components/common/contact-section";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="bg-gray-200 min-h-screen flex justify-center">
			{/* Outer container */}
			<div className="w-full max-w-[1440px] h-[1539px] flex flex-col gap-8">
				{/* Top Section */}
				<div>
					<BannerSection />

					<PageHeader
						title="Home"
						crumbs={[
							{ label: "Pages" },
							{ label: "Home", href: ROUTES.DASHBOARD.HOME },
						]}
					/>

					<div className="w-full max-w-[1374px] h-[488px] mx-auto bg-white rounded-2xl p-6 flex flex-col gap-6">
						{/* Latest Announcements */}
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
							<h2 className="text-2xl font-semibold">Latest Announcements</h2>
							<Link
								href="/announcements"
								className="flex items-center text-base text-red-500 font-medium underline">
								View More
								<ArrowRight className="w-5 h-5 ml-1" />
							</Link>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
							<FeatureCard
								image="/images/office-work.png"
								title="New technology awareness."
								description="Delightful remarkably mr on announcing themselves entreaties favourable."
								badgeLines={["30", "Nov", "2021"]}
							/>
							<FeatureCard
								image="/images/meeting.png"
								title="Client meeting discussion."
								description="About to in so terms voice at. Equal an would is found seems of."
								badgeLines={["04", "Dec", "2021"]}
							/>
							<FeatureCard
								image="/images/business-growth.png"
								title="Fast growth for business"
								description="It more shed went up is roof if loud case. Delay music livel noise an."
								badgeLines={["04", "Dec", "2021"]}
							/>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="w-full max-w-[1364px] h-[706px] mx-auto grid grid-cols-1 md:grid-cols-[31%_65%] xl:grid-cols-[31%_75%]">
					{/* Left Column */}
					<div className="flex flex-col gap-3">
						<Checklist
							title="Task Checklist"
							viewMoreLink="/tasks"
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
							viewMoreLink="/tasks"
							tasks={[]}
						/>
						<ContactSection />
					</div>

					{/* Right Column */}
					<div className="flex flex-col gap-5">
						<QuickAccess />
						<div className="w-[999px] h-[269px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
							<div className="w-full overflow-hidden">
								<TeamSection />
							</div>
							<div className="w-full overflow-hidden">
								<RecentPolicies />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
