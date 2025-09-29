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
		<div
			className="mx-auto bg-gray-200"
			style={{
				width: "1440px",
				height: "1539px",
			}}>
			{/* Banner */}
			<BannerSection />

			{/* Page Header */}
			<PageHeader
				title="Home"
				crumbs={[
					{ label: "Pages" },
					{ label: "Home", href: ROUTES.DASHBOARD.HOME },
				]}
			/>

			{/* ===== Latest Announcements ===== */}
			<div
				className="bg-white mx-auto rounded-2xl"
				style={{
					width: "1374px",
					height: "488px",
					padding: "20px",
				}}>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-semibold">Latest Announcements</h2>
					<div className="flex flex-row items-center gap-1">
						<Link
							href="/announcements"
							className="flex items-center text-sm text-red-500 font-medium underline">
							View More
							<ArrowRight className="w-4 h-4 ml-1" />
						</Link>
					</div>
				</div>

				<div className="flex overflow-x-auto gap-9 scrollbar-hide">
					<FeatureCard
						image="/images/office-work.png"
						title="New technology awarness."
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

			{/* ===== Bottom Section (2 Columns fixed sizes) ===== */}
			<div
				className="grid mx-auto"
				style={{
					width: "1401px",
					height: "706px",
					gridTemplateColumns: "390px 950px",
					columnGap: "24px",
					padding: "20px",
				}}>
				{/* Left Column */}
				<div className="flex flex-col gap-3 w-[390px] h-[706px]">
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
				<div className="flex flex-col gap-5 w-[950px] h-[706px]">
					<QuickAccess />

					{/* Row: Team + Recent Policies */}
					<div className="grid grid-cols-2 gap-15">
						<TeamSection />
						<RecentPolicies />
					</div>
				</div>
			</div>
		</div>
	);
}
