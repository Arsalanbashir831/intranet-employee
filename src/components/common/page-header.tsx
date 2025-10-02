// components/common/page-header.tsx
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

	tabs?: Tab[];
	activeTab?: string; // controlled
	onTabChange?: (val: string) => void; // fires for both controlled/uncontrolled

	defaultTab?: string; // fallback when URL has no ?tab=
	syncTabWithQuery?: boolean; // default false
	queryKey?: string; // default "tab"
};

export function PageHeader(props: PageHeaderProps) {
	const {
		title,
		crumbs,
		action,
		className,
		tabs = [],
		activeTab,
		onTabChange,
		defaultTab = tabs[0]?.key || "",
		syncTabWithQuery = false,
		queryKey = "tab",
	} = props;

	const router = useRouter();
	const search = useSearchParams();
	const pathname = usePathname();

	// --- helpers
	const firstTabKey = tabs[0]?.key ?? "";
	const isValidTab = React.useCallback(
		(k: string | undefined | null) => !!k && tabs.some((t) => t.key === k),
		[tabs]
	);

	// track where the last change came from to avoid URL<->state ping-pong
	const lastSetRef = React.useRef<"url" | "local" | null>(null);

	// read from URL only if syncing
	const tabFromUrl = syncTabWithQuery ? search.get(queryKey) : null;

	// initial
	const safeInitial =
		(isValidTab(tabFromUrl) ? String(tabFromUrl) : undefined) ??
		(isValidTab(defaultTab) ? defaultTab : firstTabKey);

	const [internalTab, setInternalTab] = React.useState(safeInitial);
	const currentValue = activeTab ?? internalTab;

	// smooth non-blocking URL updates
	const [isPending, startTransition] = React.useTransition();

	// sync FROM URL -> internal, only when value truly changed and uncontrolled
	React.useEffect(() => {
		if (!syncTabWithQuery || activeTab !== undefined) return;
		const urlKey = search.get(queryKey);
		if (isValidTab(urlKey) && urlKey !== internalTab) {
			// ignore if this exact value was set locally right before
			if (lastSetRef.current === "local") {
				lastSetRef.current = null;
				return;
			}
			lastSetRef.current = "url";
			setInternalTab(String(urlKey));
		}
	}, [syncTabWithQuery, activeTab, search, queryKey, isValidTab, internalTab]);

	// if tabs change and current disappears, fall back
	React.useEffect(() => {
		const cur = currentValue;
		if (!isValidTab(cur)) {
			const fallback =
				(isValidTab(defaultTab) ? defaultTab : undefined) ?? firstTabKey;
			if (activeTab === undefined) setInternalTab(fallback);
			if (syncTabWithQuery) {
				startTransition(() => {
					const qs = new URLSearchParams(search.toString());
					qs.set(queryKey, fallback);
					router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
				});
			}
			onTabChange?.(fallback);
		}
		// react only to structural changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabs.map((t) => t.key).join("|")]);

	const handleChange = (value: string) => {
		if (activeTab === undefined) {
			lastSetRef.current = "local";
			setInternalTab(value);
		}
		onTabChange?.(value);
		if (syncTabWithQuery) {
			startTransition(() => {
				const qs = new URLSearchParams(search.toString());
				qs.set(queryKey, value);
				router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
			});
		}
		// scroll active trigger into view smoothly
		requestAnimationFrame(() => {
			const el = document.querySelector<HTMLButtonElement>(
				`[data-tab-trigger="${CSS.escape(value)}"]`
			);
			el?.scrollIntoView({
				behavior: "smooth",
				inline: "center",
				block: "nearest",
			});
		});
	};

	return (
		<div
			className={cn(
				"px-5 md:px-12 pt-4 pb-2 border-b border-[#E4E4E4] bg-white",
				className
			)}>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
				{/* Left */}
				<div className="flex flex-col md:flex-row md:items-center gap-3 min-w-0">
					<div className="min-w-0">
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
						<div
							className="
            md:ml-3 w-full md:w-auto overflow-x-auto
            scroll-smooth
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          ">
							<Tabs value={currentValue} onValueChange={handleChange}>
								<TabsList
									className="
                border border-gray-300 rounded-lg p-1 inline-flex min-w-max gap-1
              ">
									{tabs.map((t) => {
										const isActive = currentValue === t.key;
										return (
											<TabsTrigger
												key={t.key}
												value={t.key}
												data-tab-trigger={t.key}
												className={cn(
													"shrink-0 whitespace-nowrap px-3 py-2 text-sm rounded-md text-gray-600 transition",
													"data-[state=active]:bg-[#E5004E] data-[state=active]:text-white",
													// subtle animation to feel instant
													isActive
														? "scale-[0.98] animate-[fadeIn_.16s_ease-out]"
														: ""
												)}>
												{t.label}
											</TabsTrigger>
										);
									})}
								</TabsList>
							</Tabs>
						</div>
					)}
				</div>

				{/* Right action */}
				{action ? (
					<div className="shrink-0 self-end md:self-center">{action}</div>
				) : null}
			</div>
		</div>
	);
}
