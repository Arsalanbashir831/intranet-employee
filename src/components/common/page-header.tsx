"use client";

import * as React from "react";
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

type Crumb = {
	label: string;
	href?: string;
};

type Tab = {
	key: string;
	label: string;
};

type PageHeaderProps = {
	title: string;
	crumbs: Crumb[];
	action?: React.ReactNode;
	className?: string;

	// ✅ Tabs props
	tabs?: Tab[];
	activeTab?: string;
	onTabChange?: (val: string) => void;
};

export function PageHeader({
	title,
	crumbs,
	action,
	className,
	tabs = [],
	activeTab,
	onTabChange,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"px-5 md:px-12 pt-4 pb-2 border-b border-[#E4E4E4] bg-[#FFFF]",
				className
			)}>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
				{/* Left side */}
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
					{/* ✅ Tabs (dynamic) */}
					{tabs.length > 0 && (
						<Tabs value={activeTab} onValueChange={onTabChange}>
							<TabsList className="border-gray-500">
								{tabs.map((t) => (
									<TabsTrigger
										key={t.key}
										value={t.key}
										className="px-4 py-2 rounded-md text-gray-300 data-[state=active]:bg-[#E5004E] data-[state=active]:text-[#FFFF]">
										{t.label}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					)}
				</div>

				{/* Right side action optional */}
				{action ? <div className="shrink-0 self-end">{action}</div> : null}
			</div>
		</div>
	);
}
