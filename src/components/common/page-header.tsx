"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Crumb = { label: string; href?: string };
type Tab = { key: string; label: string };

type PageHeaderProps = {
	title: string;
	crumbs: Crumb[];
	action?: React.ReactNode;
	className?: string;

	// Tabs
	tabs?: Tab[];
	/** Controlled tab value (if you want to control it from the page) */
	activeTab?: string;
	/** Callback when tab changes (fires in both controlled & uncontrolled) */
	onTabChange?: (val: string) => void;

	/** Uncontrolled default tab key (fallback when URL has no ?tab=...) */
	defaultTab?: string;

	/** Sync tab to query string like ?tab=policies (default: false) */
	syncTabWithQuery?: boolean;
	/** Query key to use (default: "tab") */
	queryKey?: string;
};

export function PageHeader({
	title,
	crumbs,
	action,
	className,

	tabs = [],
	activeTab, // controlled value (optional)
	onTabChange, // callback (optional)
	defaultTab = tabs[0]?.key || "announcements",
	syncTabWithQuery = false,
	queryKey = "tab",
}: PageHeaderProps) {
	const router = useRouter();
	const search = useSearchParams();
	const pathname = usePathname();

	// derive initial from URL if syncing is enabled
	const tabFromUrl = syncTabWithQuery
		? (search.get(queryKey) as string) || defaultTab
		: defaultTab;

	// uncontrolled state (used when activeTab is not provided)
	const [internalTab, setInternalTab] = React.useState(tabFromUrl);

	// keep internal state in sync if URL changes (e.g., back/forward)
	React.useEffect(() => {
		if (!syncTabWithQuery) return;
		setInternalTab(tabFromUrl);
	}, [syncTabWithQuery, tabFromUrl]);

	const currentValue = activeTab ?? internalTab;

	const handleChange = (value: string) => {
		// update internal only when uncontrolled
		if (activeTab === undefined) {
			setInternalTab(value);
		}
		// always notify parent if provided
		onTabChange?.(value);

		// optionally sync to URL but keep current path
		if (syncTabWithQuery) {
			const qs = new URLSearchParams(search.toString());
			qs.set(queryKey, value);
			router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
		}
	};

	return (
		<div
			className={cn(
				"px-5 md:px-12 pt-4 pb-2 border-b border-[#E4E4E4] bg-white",
				className
			)}>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
				{/* Left */}
				<div className="flex items-center gap-3 min-w-0">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight truncate">
							{title}
						</h1>

						<div className="mt-1">
							<Breadcrumb>
								<BreadcrumbList>
									{crumbs.map((c, idx) => {
										const isLast = idx === crumbs.length - 1;
										return (
											<React.Fragment key={`${c.label}-${idx}`}>
												<BreadcrumbItem>
													{isLast || !c.href ? (
														<BreadcrumbPage className="text-[#E5004E]">
															{c.label}
														</BreadcrumbPage>
													) : (
														<BreadcrumbLink
															href={c.href}
															className="text-muted-foreground hover:text-foreground">
															{c.label}
														</BreadcrumbLink>
													)}
												</BreadcrumbItem>
												{!isLast ? (
													<BreadcrumbSeparator>/</BreadcrumbSeparator>
												) : null}
											</React.Fragment>
										);
									})}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</div>

					{/* Tabs */}
					{tabs.length > 0 && (
						<Tabs value={currentValue} onValueChange={handleChange}>
							<TabsList className="border border-gray-300 rounded-lg p-1 inline-flex ml-3">
								{tabs.map((t) => (
									<TabsTrigger
										key={t.key}
										value={t.key}
										className="p-3 rounded-md text-gray-600 data-[state=active]:bg-[#E5004E] data-[state=active]:text-white">
										{t.label}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					)}
				</div>

				{/* Right action */}
				{action ? <div className="shrink-0 self-end">{action}</div> : null}
			</div>
		</div>
	);
}
