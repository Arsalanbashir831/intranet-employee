import BannerSection from "@/components/common/banner-section";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import FeatureCard from "@/components/common/feature-card";
import Checklist from "@/components/common/checklist";
import QuickAccess from "@/components/common/quick-access";
import RecentPolicies from "@/components/common/recent-policies";
import TeamSection from "@/components/teams/team-section";
import ContactSection from "@/components/common/contact-section";

export default function Home() {
	return (
		<div className=" min-h-screen">
			<BannerSection />
			<PageHeader
				title="Profile"
				crumbs={[
					{ label: "Pages" },
					{ label: "Profile", href: ROUTES.DASHBOARD.PROFILE },
				]}
			/>

			<div className="flex flex-row">
				<FeatureCard
					image="/images/office-work.png"
					title="New technology awarness."
					description="Delightful remarkably mr on announcing themselves entreaties favourable."
					badgeLines={["30", "Nov", "2021"]}
					width={320}
					height={500}
				/>
			</div>
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
			<Checklist title="Training Checklist" viewMoreLink="/tasks" tasks={[]} />
			<ContactSection />
			<QuickAccess />
			<TeamSection />
			<RecentPolicies />
		</div>
	);
}
