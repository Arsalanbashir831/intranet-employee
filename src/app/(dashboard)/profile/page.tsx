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
import { Badge } from "@/components/ui/badge";

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
			<div className="p-4 sm:p-8 lg:p-6 space-y-8">
				<EmployeeProfileCard />

				<div className="w-full max-w-[1374px] mx-auto">
					<h2 className="text-lg font-semibold mb-4 text-[#111827]">Security Settings</h2>
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-full">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-medium text-[#111827]">Two-Factor Authentication (2FA)</h3>
									{isMfaEnabled && <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Enabled</Badge>}
								</div>
								<p className="text-sm text-gray-500">
									Add an extra layer of security to your account using an authenticator app.
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant='outline'
									onClick={() => setMfaOpen(true)}
									className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
								>
									{isMfaEnabled ? "Disable" : "Enable"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}