'use client'

import { Navbar } from "@/components/common/navigation/navbar";
import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/auth-context";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<div className="min-h-screen bg-[#F8F8F8]">
					<Navbar />
					<main >
						<Suspense>{children}</Suspense>
					</main>
				</div>
				<ReactQueryDevtools initialIsOpen={false} />
			</AuthProvider>
		</QueryClientProvider>
	);
}