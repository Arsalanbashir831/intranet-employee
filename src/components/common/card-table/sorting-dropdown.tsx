import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListFilter } from "lucide-react";

type SortingDropdownProps = {
	sortOptions: { label: string; value: string }[];
	activeSort: string;
	onSortChange: (value: string) => void;
};

export function SortingDropdown(props: SortingDropdownProps) {
	const { sortOptions, activeSort, onSortChange } = props;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger id="dropdown-trigger-sorting" asChild>
				<Button variant="outline" className="gap-1 rounded-[4px] border-black">
					<ListFilter className="size-3.5 mr-1" /> Sort By
					<ChevronDown className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				{sortOptions && sortOptions.length > 0 ? (
					<DropdownMenuRadioGroup
						value={activeSort}
						onValueChange={onSortChange}>
						{sortOptions.map((opt) => (
							<DropdownMenuRadioItem
								key={opt.value}
								value={opt.value}
								className="py-2 text-[15px]">
								{opt.label}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				) : (
					<DropdownMenuLabel className="text-sm text-muted-foreground">
						No sort options
					</DropdownMenuLabel>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
