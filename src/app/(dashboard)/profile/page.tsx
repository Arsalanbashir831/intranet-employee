"use client";

import * as React from "react";
import { EmployeeProfileCard } from "@/components/profile/profile-card";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/components/profile/change-password-dialog";
import { MfaDialog } from "@/components/profile/mfa-dialog";
import { useAuth } from "@/contexts/auth-context";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
	const [open, setOpen] = React.useState(false);
	const [mfaOpen, setMfaOpen] = React.useState(false);
	const { user } = useAuth();
	console.log(user);
	const isMfaEnabled = user?.mfa_enabled ?? false;

	return (
		<div>
			<PageHeader
				title="Profile"
				crumbs={[
					{ label: "Pages", href: '#' },
					{ label: "Profile", href: ROUTES.DASHBOARD.PROFILE },
				]}
				action={
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Switch
								checked={isMfaEnabled}
								onCheckedChange={() => setMfaOpen(true)}
								className="data-[state=unchecked]:bg-pink-200 data-[state=checked]:bg-[#FF5A8B] cursor-pointer"
								thumbClassName="data-[state=unchecked]:bg-[#FF5A8BB2]"
							/>
							<span className="text-sm font-medium text-gray-700">
								2FA {isMfaEnabled ? "Enabled" : "Disabled"}
							</span>
						</div>
						<Button
							variant="outline"
							className="border-[#FF5A8B] text-[#FF5A8B] hover:bg-[#FFF1F5]"
							onClick={() => setOpen(true)}>
							Change Password
						</Button>
					</div>
				}
			/>

			<ChangePasswordDialog
				open={open}
				onOpenChange={setOpen}
			/>
			<MfaDialog
				open={mfaOpen}
				onOpenChange={setMfaOpen}
				isEnabled={isMfaEnabled}
			/>
			<div className="p-4 sm:p-8 lg:p-6">
				<EmployeeProfileCard />
			</div>
		</div>
	);
}