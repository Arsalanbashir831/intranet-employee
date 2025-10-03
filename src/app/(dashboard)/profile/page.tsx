"use client";

import * as React from "react";
import { EmployeeProfileCard } from "@/components/profile/profile-card";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { useChangePassword } from "@/hooks/queries/use-auth";
import { toast } from "sonner";

export default function Profile() {
	const [open, setOpen] = React.useState(false);
	const { mutate: changePassword, isPending } = useChangePassword();

	const handleChangePassword = async (vals: {
		current: string;
		next: string;
		confirm: string;
	}) => {
		if (vals.next !== vals.confirm) {
			toast.error("New passwords do not match");
			return;
		}
		
		changePassword(
			{
				current_password: vals.current,
				new_password: vals.next,
			},
			{
				onSuccess: () => {
					toast.success("Password changed successfully");
					setOpen(false);
				},
				onError: (error) => {
					toast.error(error instanceof Error ? error.message : "Failed to change password");
				},
			}
		);
	};

	return (
		<div>
			<PageHeader
				title="Profile"
				crumbs={[
					{ label: "Pages", href:'#' },
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