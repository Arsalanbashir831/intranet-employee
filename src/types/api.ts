/**
 * API request and response types
 */

// Auth API types
export type LoginRequest = { username: string; password: string };
export type LoginResponse = {
	access: string;
	refresh: string;
	mfa_required?: boolean;
	challenge_token?: string;
};
export type RefreshRequest = { refresh: string };
export type RefreshResponse = {
	access: string;
	refresh?: string;
};
export type VerifyRequest = { token: string };
export type ForgotPasswordRequest = { email: string };
export type ResetPasswordWithOTPRequest = {
	email: string;
	otp: string;
	new_password: string;
};

// MFA Types
export type MfaEnrollResponse = {
	secret: string;
	otpauth_uri: string;
};

export type MfaConfirmRequest = {
	code: string;
};

export type MfaVerifyRequest = {
	challenge_token: string;
	code: string;
};

export type MfaDisableRequest = {
	code: string;
};

