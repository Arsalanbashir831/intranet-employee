import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
    title: "Dashboard | Intranet",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}


