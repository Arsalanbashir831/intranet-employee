"use client";

import { PageHeader } from "@/components/common/page-header";
import FeatureCard from "@/components/common/feature-card";
import Link from "next/link";
import { ROUTES } from "@/hooks/constants/routes";

// Mock data — replace with real API later
const announcements = [
	{
		id: "1",
		title: "A DEEP DIVE INTO THE INFLUENCE OF CULTURAL MOVEMENTS",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		image: "/images/office-work.png",
		badgeLines: ["09", "Sep", "2024"],
	},
	{
		id: "2",
		title: "NEW OFFICE OPENING IN LAHORE",
		description: "We're excited to announce our new branch in Lahore!",
		image: "/images/office-work.png",
		badgeLines: ["01", "Aug", "2024"],
	},
	{
		id: "3",
		title: "Q3 TEAM AWARDS CEREMONY",
		description: "Celebrating excellence across departments.",
		image: "/images/office-work.png",
		badgeLines: ["15", "Jul", "2024"],
	},
];

export default function CompanyHub() {
	return (
		<div>
			{/* Page Header */}
			<PageHeader
				title="Company Hub"
				crumbs={[
					{ label: "Pages" },
					{ label: "Company Hub", href: ROUTES.DASHBOARD.COMPANY_HUB },
				]}
			/>
			<div className="container mx-auto px-4 py-8">
				{/* Horizontal Scrollable Feature Cards */}
				<div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4">
					{announcements.map((item) => (
						<Link
							href={`/company-hub/${item.id}`}
							key={item.id}
							className="shrink-0">
							<FeatureCard
								image={item.image}
								title={item.title}
								description={item.description}
								badgeLines={item.badgeLines}
								width={320}
								height={500}
							/>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
