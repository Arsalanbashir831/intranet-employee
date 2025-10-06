"use client";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight } from "lucide-react";
import ChecklistDrawerContent from "./checklist-drawer-content";

interface ChecklistDrawerProps {
	title: string;
	subtitle?: string;
	description: string;
	date: string;
	files?: {
		id: number;
		file: string;
		uploaded_at: string;
	}[];
}

export default function ChecklistDrawer({ files = [], ...props }: ChecklistDrawerProps) {
	return (
		<Sheet>
			<SheetTrigger id="sheet-trigger-checklist-drawer" asChild>
				<span className="flex items-center text-[10px] font-medium text-white hover:underline cursor-pointer">
					See Details
					<ArrowRight className="w-3 h-3 ml-1" />
				</span>
			</SheetTrigger>

			<ChecklistDrawerContent {...props} files={files} />
		</Sheet>
	);
}