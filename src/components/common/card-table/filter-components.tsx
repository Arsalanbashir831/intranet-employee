"use client";

import * as React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	useDepartments,
	useBranchDepartments,
} from "@/hooks/queries/use-departments";
import type {
	DepartmentFilterProps,
	BranchDepartmentFilterProps,
	SearchFilterProps,
} from "@/types/card-table";

export function DepartmentFilter({
	value,
	onValueChange,
	placeholder = "Select department",
}: DepartmentFilterProps) {
	const { data: departmentsData, isLoading } = useDepartments({
		page_size: 1000,
	});

	const departments = React.useMemo(() => {
		if (!departmentsData) return [];
		const list = Array.isArray(departmentsData)
			? departmentsData
			: (departmentsData as { departments?: { results?: unknown[] } })
					?.departments?.results || [];
		return (list as { id: number; dept_name: string }[]).map((dept) => ({
			id: dept.id,
			name: dept.dept_name,
		}));
	}, [departmentsData]);

	return (
		<div className="space-y-2">
			<Label htmlFor="department">Department</Label>
			<Select value={value || undefined} onValueChange={onValueChange}>
				<SelectTrigger id="department" className="w-full border-[#E4E4E4]">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{isLoading ? (
						<SelectItem value="__loading__" disabled>
							Loading...
						</SelectItem>
					) : (
						<>
							<SelectItem value="__all__">All Departments</SelectItem>
							{departments.map((dept) => (
								<SelectItem key={dept.id} value={String(dept.id)}>
									{dept.name}
								</SelectItem>
							))}
						</>
					)}
				</SelectContent>
			</Select>
		</div>
	);
}


export function BranchDepartmentFilter({
	value,
	onValueChange,
	placeholder = "Select branch department",
}: BranchDepartmentFilterProps) {
	const { data: branchDeptsData, isLoading } = useBranchDepartments({
		page_size: 1000,
	});

	const branchDepartments = React.useMemo(() => {
		if (!branchDeptsData) return [];

		return (
			branchDeptsData as {
				id: number;
				branch: { branch_name: string };
				department: { dept_name: string | unknown };
			}[]
		).map((bd) => ({
			id: bd.id,
			name: `${
				typeof bd.department?.dept_name === "string"
					? bd.department.dept_name
					: "Unknown Department"
			} - ${bd.branch?.branch_name || "Unknown Branch"}`,
		}));
	}, [branchDeptsData]);

	return (
		<div className="space-y-2">
			<Label htmlFor="branch-department">Branch Department</Label>
			<Select value={value || undefined} onValueChange={onValueChange}>
				<SelectTrigger
					id="branch-department"
					className="w-full border-[#E4E4E4]">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{isLoading ? (
						<SelectItem value="__loading__" disabled>
							Loading...
						</SelectItem>
					) : (
						<>
							<SelectItem value="__all__">All Branch Departments</SelectItem>
							{branchDepartments.map((bd) => (
								<SelectItem key={bd.id} value={String(bd.id)}>
									{bd.name}
								</SelectItem>
							))}
						</>
					)}
				</SelectContent>
			</Select>
		</div>
	);
}


export function SearchFilter({
	value,
	onValueChange,
	placeholder = "Search...",
	label = "Search",
}: SearchFilterProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="search">{label}</Label>
			<Input
				id="search"
				value={value}
				onChange={(e) => onValueChange(e.target.value)}
				placeholder={placeholder}
				className="w-full"
			/>
		</div>
	);
}
