import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { login, logout, refreshToken, forgotPassword, resetPasswordWithOTP, changePassword, getMe, mfaEnroll, mfaConfirm, mfaVerify, mfaDisable } from "@/services/auth";
import type { LoginRequest, ForgotPasswordRequest, ResetPasswordWithOTPRequest, MfaConfirmRequest, MfaVerifyRequest, MfaDisableRequest, LoginResponse } from "@/types/api";
import type { MeResponse } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { setAuthCookies, clearAuthCookies } from "@/lib/cookies";
import { useRouter } from "next/navigation";

export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: async (data: LoginResponse) => {
      // If MFA is required, do NOT set cookies or redirect yet.
      // The component will handle the challenge view.
      if (data.mfa_required) {
        return;
      }

      // Store tokens via cookies only
      if (typeof window !== "undefined") {
        setAuthCookies(data.access, data.refresh);

        // Dispatch custom event to notify auth context
        window.dispatchEvent(new CustomEvent('auth:login'));
      }

      // Invalidate all queries to refetch with new auth state
      qc.invalidateQueries();

      // Navigate to dashboard
      if (typeof window !== "undefined") {
        // Use Next.js router
        router.push(ROUTES.DASHBOARD.HOME);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Handle different types of errors
      if (error instanceof Error) {
        // Network or other errors
        throw new Error("Unable to connect to the server. Please check your connection and try again.");
      } else {
        // API errors
        const err = error as {
          response?: {
            status?: number;
            data?: {
              detail?: string;
            }
          }
        };

        // Handle specific HTTP status codes
        switch (err.response?.status) {
          case 400:
            throw new Error("Invalid request. Please check your credentials and try again.");
          case 401:
            throw new Error("Invalid username or password.");
          case 403:
            throw new Error("Account access denied. Please contact your administrator.");
          case 500:
            throw new Error("Server error. Please try again later.");
          case 503:
            throw new Error("Service temporarily unavailable. Please try again later.");
          default:
            throw new Error(err.response?.data?.detail || "Login failed. Please try again.");
        }
      }
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logout,
    retry: false,
    // Prevent churn immediately when user clicks sign out
    onMutate: async () => {
      await qc.cancelQueries();
      if (typeof window !== "undefined") {
        clearAuthCookies();
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    },
    onSuccess: () => {
      // Clear tokens (cookies-only)
      if (typeof window !== "undefined") {
        clearAuthCookies();

        // Dispatch custom event to notify auth context
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }

      // Clear all cached data
      qc.clear();

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = ROUTES.AUTH.LOGIN;
      }
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails on server, clear local state
      if (typeof window !== "undefined") {
        clearAuthCookies();

        // Dispatch custom event to notify auth context
        window.dispatchEvent(new CustomEvent('auth:logout'));

        qc.clear();
        window.location.href = ROUTES.AUTH.LOGIN;
      }
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshTokenValue: string) => refreshToken(refreshTokenValue),
    onSuccess: (data) => {
      // Update stored tokens (cookies-only)
      if (typeof window !== "undefined") {
        setAuthCookies(data.access, data.refresh || "");
      }
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // If refresh fails, clear tokens and redirect to login
      if (typeof window !== "undefined") {
        clearAuthCookies();
        window.location.href = ROUTES.AUTH.LOGIN;
      }
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onError: (error) => {
      console.error("Forgot password failed:", error);
      throw new Error("Failed to send reset email. Please try again.");
    },
  });
}

export function useResetPasswordWithOTP() {
  return useMutation({
    mutationFn: (data: ResetPasswordWithOTPRequest) => resetPasswordWithOTP(data),
    onError: (error) => {
      console.error("Reset password failed:", error);
      throw new Error("Failed to reset password. Please try again.");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) => changePassword(data),
    onError: (error) => {
      console.error("Change password failed:", error);
      // Let the specific error message from the API pass through instead of overriding it
      throw error;
    },
  });
}

export function useMe() {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// MFA Hooks
export function useMfaEnroll() {
  return useMutation({
    mutationFn: mfaEnroll,
  });
}

export function useMfaConfirm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MfaConfirmRequest) => mfaConfirm(data),
    onSuccess: () => {
      // Invalidate 'me' query to update mfa_enabled status
      qc.invalidateQueries({ queryKey: ["me"] });
      // Force AuthContext to refresh
      window.dispatchEvent(new Event('auth:refresh'));
    }
  });
}

export function useMfaVerify() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: MfaVerifyRequest) => mfaVerify(data),
    onSuccess: async (data: LoginResponse) => {
      // Store tokens via cookies only (service handles this, but double check environment)
      if (typeof window !== "undefined") {
        setAuthCookies(data.access, data.refresh);

        // Dispatch custom event to notify auth context
        window.dispatchEvent(new CustomEvent('auth:login'));
      }

      // Invalidate all queries to refetch with new auth state
      qc.invalidateQueries();

      // Navigate to dashboard
      if (typeof window !== "undefined") {
        router.push(ROUTES.DASHBOARD.HOME);
      }
    },
    onError: (error) => {
      console.error("MFA Verify failed:", error);
      throw error;
    }
  });
}

export function useMfaDisable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MfaDisableRequest) => mfaDisable(data),
    onSuccess: () => {
      // Invalidate 'me' query to update mfa_enabled status
      qc.invalidateQueries({ queryKey: ["me"] });
      // Force AuthContext to refresh
      window.dispatchEvent(new Event('auth:refresh'));
    }
  });
}
