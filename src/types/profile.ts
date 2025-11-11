/**
 * Profile component types
 */

import type { EmployeeProfileData } from "@/lib/profile-utils";

// Profile Picture Dialog types
export type ProfilePictureSavePayload = {
	dataUrl: string; // cropped PNG data URL
	file: File; // cropped PNG File (named)
};

export type ProfilePictureDialogProps = {
	image: string | null; // current profile image (can be null)
	name: string;
	onSave?: (payload: ProfilePictureSavePayload) => Promise<void> | void;
	onDelete?: () => Promise<void> | void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

// Profile Icon types
export type PinkIconProps = {
	src: string;
	size?: number;
};

// Profile Card types
export type EmployeeProfileCardProps = {
	employee?: EmployeeProfileData;
};

// Change Password Dialog types
export type ChangePasswordValues = {
	current: string;
	next: string;
	confirm: string;
};

export type ChangePasswordDialogProps = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
};

