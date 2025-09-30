"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";

type Values = { current: string; next: string; confirm: string };

export function ChangePasswordDialog({
	open,
	onOpenChange,
	onSubmit,
	loading = false,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	onSubmit: (values: Values) => Promise<void> | void;
	loading?: boolean;
}) {
	const [show, setShow] = React.useState<{ [k: string]: boolean }>({});
	const [values, setValues] = React.useState<Values>({
		current: "",
		next: "",
		confirm: "",
	});
	const [error, setError] = React.useState<string>("");

	const toggle = (k: keyof Values) => setShow((s) => ({ ...s, [k]: !s[k] }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (!values.current || !values.next || !values.confirm) {
			setError("All fields are required.");
			return;
		}
		if (values.next !== values.confirm) {
			setError("New password and confirm password do not match.");
			return;
		}
		await onSubmit(values);
	};

	const Field = ({
		id,
		label,
		valueKey,
	}: {
		id: string;
		label: string;
		valueKey: keyof Values;
	}) => (
		<div className="space-y-2">
			<Label htmlFor={id} className="text-sm">
				{label}
			</Label>
			<div className="relative">
				<Input
					id={id}
					type={show[valueKey] ? "text" : "password"}
					value={values[valueKey]}
					onChange={(e) =>
						setValues((v) => ({ ...v, [valueKey]: e.target.value }))
					}
					className="pl-9 pr-10"
					placeholder="Your Password"
				/>
				<Image
					src="/icons/lock-black.svg"
					alt=""
					width={16}
					height={16}
					className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
					aria-hidden="true"
				/>
				<button
					type="button"
					onClick={() => toggle(valueKey)}
					className="absolute right-3 top-1/2 -translate-y-1/2"
					aria-label="Toggle password visibility">
					{show[valueKey] ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</button>
			</div>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Security &amp; Login</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5">
					<Field id="current" label="Current password" valueKey="current" />
					<Field id="next" label="New password" valueKey="next" />
					<Field id="confirm" label="Confirm password" valueKey="confirm" />

					{error && <p className="text-sm text-red-600">{error}</p>}

					{/* <DialogFooter className="gap-2">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Change Password"}
						</Button>
					</DialogFooter> */}
				</form>
			</DialogContent>
		</Dialog>
	);
}
