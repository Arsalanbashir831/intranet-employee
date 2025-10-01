"use client";

import RightAuthAside from "@/components/auth/RightAuthAside";
import Image from "next/image";
import * as React from "react";

export default function AuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
			{/* LEFT: logo + form */}
			<section className="flex flex-col px-6 sm:px-8 lg:px-12 py-6 lg:py-8">
				<div className="mb-8">
					<Image src="/logo.svg" alt="Company Logo" width={231} height={85} />
				</div>
				<div className="flex-1 flex items-center justify-center">
					{children}
				</div>
			</section>

			{/* RIGHT: gradient panel (visible on lg+) */}
			<section className="hidden lg:block">
				<RightAuthAside />
			</section>
		</div>
	);
}
