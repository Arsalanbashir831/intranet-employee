"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { ChevronDown, Check, Building2 } from "lucide-react";
import { useBranches } from "@/hooks/queries/use-branches";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface BranchFilterDropdownProps {
	selectedBranch: string; // "__all__" or branch ID as string
	onBranchChange: (branchId: string) => void;
	className?: string;
}

export function BranchFilterDropdown({
	selectedBranch,
	onBranchChange,
	className,
}: BranchFilterDropdownProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const debouncedSearch = useDebounce(searchQuery, 400);

	// Fetch branches with search
	const {
		data,
		isLoading,
		isError,
	} = useBranches(debouncedSearch, { page: 1, pageSize: 1000 });

	const branches = data?.branches?.results || [];

	// Get selected branch name for display
	const selectedBranchName = React.useMemo(() => {
		if (selectedBranch === "__all__") return "All Branches";
		const branch = branches.find((b) => b.id.toString() === selectedBranch);
		return branch?.branch_name || "All Branches";
	}, [selectedBranch, branches]);

	const handleSelect = (value: string) => {
		onBranchChange(value);
		setOpen(false);
		setSearchQuery(""); // Clear search when selection is made
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("gap-1 rounded-[4px] justify-between", className)}
				>
					<Building2 className="size-3.5 mr-1" />
					{selectedBranchName}
					<ChevronDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-w-[300px] w-fit p-0" align="end">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search branches..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{/* Loading State */}
						{isLoading && (
							<div className="py-6 text-center text-sm text-gray-500">
								Loading branches...
							</div>
						)}

						{/* Error State */}
						{isError && (
							<div className="py-6 text-center text-sm text-red-500">
								Failed to load branches
							</div>
						)}

						{/* Branches List */}
						{!isLoading && !isError && (
							<>
								<CommandEmpty>
									{branches.length === 0 && searchQuery
										? "No branches found."
										: "No branches available."}
								</CommandEmpty>
								<CommandGroup>
									{/* All Branches Option */}
									<CommandItem
										value="__all__"
										onSelect={() => handleSelect("__all__")}
										className="py-2 text-[15px]"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedBranch === "__all__"
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										All Branches
									</CommandItem>

									{/* Branch Options */}
									{branches.map((branch) => (
										<CommandItem
											key={branch.id}
											value={branch.branch_name}
											onSelect={() => handleSelect(branch.id.toString())}
											className="py-2 text-[15px]"
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedBranch === branch.id.toString()
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{branch.branch_name}
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
