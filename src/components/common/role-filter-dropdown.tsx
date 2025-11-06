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
import { ChevronDown, Check, Users } from "lucide-react";
import { useRoles } from "@/hooks/queries/use-roles";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface RoleFilterDropdownProps {
	selectedRole: string; // "__all__" or role ID as string
	onRoleChange: (roleId: string) => void;
	className?: string;
}

export function RoleFilterDropdown({
	selectedRole,
	onRoleChange,
	className,
}: RoleFilterDropdownProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const debouncedSearch = useDebounce(searchQuery, 400);

	// Fetch roles with search
	const {
		data,
		isLoading,
		isError,
	} = useRoles(debouncedSearch, { page: 1, pageSize: 50 });

	const roles = data?.roles?.results || [];

	// Get selected role name for display
	const selectedRoleName = React.useMemo(() => {
		if (selectedRole === "__all__") return "All Roles";
		const role = roles.find((r) => r.id.toString() === selectedRole);
		return role?.name || "All Roles";
	}, [selectedRole, roles]);

	const handleSelect = (value: string) => {
		onRoleChange(value);
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
					<Users className="size-3.5 mr-1" />
					{selectedRoleName}
					<ChevronDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-w-[300px] w-fit p-0" align="end">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search roles..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{/* Loading State */}
						{isLoading && (
							<div className="py-6 text-center text-sm text-gray-500">
								Loading roles...
							</div>
						)}

						{/* Error State */}
						{isError && (
							<div className="py-6 text-center text-sm text-red-500">
								Failed to load roles
							</div>
						)}

						{/* Roles List */}
						{!isLoading && !isError && (
							<>
								<CommandEmpty>
									{roles.length === 0 && searchQuery
										? "No roles found."
										: "No roles available."}
								</CommandEmpty>
								<CommandGroup>
									{/* All Roles Option */}
									<CommandItem
										value="__all__"
										onSelect={() => handleSelect("__all__")}
										className="py-2 text-[15px]"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedRole === "__all__"
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										All Roles
									</CommandItem>

									{/* Role Options */}
									{roles.map((role) => (
										<CommandItem
											key={role.id}
											value={role.name}
											onSelect={() => handleSelect(role.id.toString())}
											className="py-2 text-[15px]"
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedRole === role.id.toString()
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{role.name}
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
