
import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { setAuthCookies } from "@/lib/cookies";
import type { MeResponse } from "@/types/auth";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  VerifyRequest,
  ForgotPasswordRequest,
  ResetPasswordWithOTPRequest,
  MfaEnrollResponse,
  MfaConfirmRequest,
  MfaVerifyRequest,
  MfaDisableRequest,
} from "@/types/api";

export async function login(credentials: LoginRequest) {
  const res = await apiCaller<LoginResponse>(API_ROUTES.AUTH.OBTAIN_TOKEN, "POST", credentials, {}, "json");
  const { access, refresh, mfa_required } = res.data;

  // Only set cookies if MFA is NOT required
  if (!mfa_required) {
    // Persist tokens immediately for subsequent requests
    setAuthCookies(access, refresh);
  }

  return res.data;
}

export async function refreshToken(refreshToken: string) {
  const res = await apiCaller<RefreshResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, "POST", { refresh: refreshToken }, {}, "json");
  return res.data;
}

export async function verifyToken(token?: string) {
  // Returns void on 200, throws on 401/invalid
  // If no token provided, get the current token from cookies
  let tokenToVerify = token;
  if (!tokenToVerify && typeof window !== "undefined") {
    const { getAuthTokens } = await import("@/lib/cookies");
    const { accessToken } = getAuthTokens();
    tokenToVerify = accessToken || undefined;
  }

  if (!tokenToVerify) {
    throw new Error("No token available for verification");
  }

  await apiCaller<void>(API_ROUTES.AUTH.VERIFY_TOKEN, "POST", { token: tokenToVerify } as VerifyRequest, {}, "json");
}

// New function to get user profile information
export async function getMe(): Promise<MeResponse> {
  const res = await apiCaller<MeResponse>(API_ROUTES.AUTH.ME, "GET");
  return res.data;
}

export async function logout() {
  // No backend endpoint specified for logout in current routes.
  // If added later, call it here. For now this is a no-op placeholder.
}

// Forgot password function
export async function forgotPassword(data: ForgotPasswordRequest) {
  await apiCaller<void>(API_ROUTES.AUTH.FORGOT_PASSWORD, "POST", data, {}, "json");
}

// Reset password with OTP function
export async function resetPasswordWithOTP(data: ResetPasswordWithOTPRequest) {
  await apiCaller<void>(API_ROUTES.AUTH.RESET_PASSWORD, "POST", data, {}, "json");
}

// Change password function
export async function changePassword(data: { current_password: string; new_password: string }) {
  await apiCaller<void>(API_ROUTES.AUTH.CHANGE_PASSWORD, "POST", data, {}, "json");
}

// MFA Functions
export async function mfaEnroll() {
  const res = await apiCaller<MfaEnrollResponse>(API_ROUTES.MFA.ENROLL, "POST");
  return res.data;
}

export async function mfaConfirm(data: MfaConfirmRequest) {
  await apiCaller<void>(API_ROUTES.MFA.CONFIRM, "POST", data, {}, "json");
}

export async function mfaVerify(data: MfaVerifyRequest) {
  const res = await apiCaller<LoginResponse>(API_ROUTES.MFA.VERIFY, "POST", data, {}, "json");
  const { access, refresh } = res.data;
  // Persist tokens immediately for subsequent requests
  setAuthCookies(access, refresh);
  return res.data;
}

export async function mfaDisable(data: MfaDisableRequest) {
  await apiCaller<void>(API_ROUTES.MFA.DISABLE, "POST", data, {}, "json");
}
