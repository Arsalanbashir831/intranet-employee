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
import { ChevronDown, Check, Briefcase } from "lucide-react";
import { useDepartments } from "@/hooks/queries/use-departments";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface DepartmentFilterDropdownProps {
	selectedDepartment: string; // "__all__" or department ID as string
	onDepartmentChange: (departmentId: string) => void;
	className?: string;
}

export function DepartmentFilterDropdown({
	selectedDepartment,
	onDepartmentChange,
	className,
}: DepartmentFilterDropdownProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const debouncedSearch = useDebounce(searchQuery, 400);

	// Fetch departments with search
	const {
		data,
		isLoading,
		isError,
	} = useDepartments(
		debouncedSearch ? { search: debouncedSearch } : undefined,
		{ page: 1, pageSize: 1000 }
	);

	const departments = data?.departments?.results || [];

	// Get selected department name for display
	const selectedDepartmentName = React.useMemo(() => {
		if (selectedDepartment === "__all__") return "All Departments";
		const dept = departments.find((d) => d.id.toString() === selectedDepartment);
		return dept?.dept_name || "All Departments";
	}, [selectedDepartment, departments]);

	const handleSelect = (value: string) => {
		onDepartmentChange(value);
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
					<Briefcase className="size-3.5 mr-1" />
					{selectedDepartmentName}
					<ChevronDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-w-[300px] w-fit p-0" align="end">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search departments..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{/* Loading State */}
						{isLoading && (
							<div className="py-6 text-center text-sm text-gray-500">
								Loading departments...
							</div>
						)}

						{/* Error State */}
						{isError && (
							<div className="py-6 text-center text-sm text-red-500">
								Failed to load departments
							</div>
						)}

						{/* Departments List */}
						{!isLoading && !isError && (
							<>
								<CommandEmpty>
									{departments.length === 0 && searchQuery
										? "No departments found."
										: "No departments available."}
								</CommandEmpty>
								<CommandGroup>
									{/* All Departments Option */}
									<CommandItem
										value="__all__"
										onSelect={() => handleSelect("__all__")}
										className="py-2 text-[15px]"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedDepartment === "__all__"
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										All Departments
									</CommandItem>

									{/* Department Options */}
									{departments.map((dept) => (
										<CommandItem
											key={dept.id}
											value={dept.dept_name}
											onSelect={() => handleSelect(dept.id.toString())}
											className="py-2 text-[15px]"
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedDepartment === dept.id.toString()
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{dept.dept_name}
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
