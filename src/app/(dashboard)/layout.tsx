import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Dashboard | Intranet",
};

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<Navbar />
			<main className="mx-auto max-w-screen-2xl">
				<Suspense>{children}</Suspense>
			</main>
		</div>
	);
}
