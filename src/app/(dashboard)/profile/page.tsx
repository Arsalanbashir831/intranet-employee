"use client";

import * as React from "react";
import { EmployeeProfileCard } from "@/components/profile/profile-card";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";

export default function Profile() {
	const [open, setOpen] = React.useState(false);
	const [saving, setSaving] = React.useState(false);

	// TODO: replace with your API call
	const handleChangePassword = async (vals: {
		current: string;
		next: string;
		confirm: string;
	}) => {
		setSaving(true);
		try {
			// await api.post("/me/change-password", vals);
			// toast.success("Password changed");
			setOpen(false);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			<PageHeader
				title="Profile"
				crumbs={[
					{ label: "Pages" },
					{ label: "Profile", href: ROUTES.DASHBOARD.PROFILE },
				]}
				action={
					<Button
						variant="outline"
						className="border-[#FF5A8B] text-[#FF5A8B] hover:bg-[#FFF1F5]"
						onClick={() => setOpen(true)}>
						Change Password
					</Button>
				}
			/>

			<ChangePasswordDialog
				open={open}
				onOpenChange={setOpen}
				onSubmit={handleChangePassword}
			/>
			<div className="p-4 sm:p-8 lg:p-6">
				<EmployeeProfileCard />
			</div>
		</div>
	);
}
