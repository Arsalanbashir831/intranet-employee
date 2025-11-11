/**
 * API request and response types
 */

// Auth API types
export type LoginRequest = { username: string; password: string };
export type LoginResponse = { access: string; refresh: string };
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

