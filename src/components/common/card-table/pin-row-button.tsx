import { Pin } from "lucide-react";
import { Button } from "../../ui/button";
import type { PinRowButtonProps, RowWithId } from "@/types/card-table";

export function PinRowButton<TData extends RowWithId>({
	row,
	pinnedIds,
	togglePin,
}: PinRowButtonProps<TData>) {
	const id = row.original.id;
	const isPinned = pinnedIds.has(id);

	return (
		<Button
			variant="link"
			size="icon"
			className={`p-0 h-fit w-fit text-primary hover:text-primary/80 opacity-0 transition-opacity group-hover:opacity-100 ${
				isPinned ? "opacity-100" : ""
			}`}
			onClick={() => togglePin(id)}
			aria-label={isPinned ? "Unpin" : "Pin"}
			title={isPinned ? "Unpin" : "Pin"}>
			<Pin className={`size-4 rotate-45 ${isPinned ? "fill-current" : ""}`} />
		</Button>
	);
}
