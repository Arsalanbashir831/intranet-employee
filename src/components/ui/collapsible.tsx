"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

function Collapsible({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

import { useId } from "react";

function CollapsibleTrigger({
	id,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
	id?: string;
}) {
	const reactId = useId();
	const stableId = id ?? `collapsible-trigger-${reactId}`;
	return (
		<CollapsiblePrimitive.CollapsibleTrigger
			id={stableId}
			data-slot="collapsible-trigger"
			{...props}
		/>
	);
}

function CollapsibleContent({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
	return (
		<CollapsiblePrimitive.CollapsibleContent
			data-slot="collapsible-content"
			{...props}
		/>
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
