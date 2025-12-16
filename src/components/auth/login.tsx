"use client";
// Login component for intranet staff
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLogin, useMfaVerify } from "@/hooks/queries/use-auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ROUTES } from "@/constants/routes";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // MFA State
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: verifyMfa, isPending: isVerifyPending } = useMfaVerify();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { username: email, password },
      {
        onSuccess: (data) => {
          if (data.mfa_required && data.challenge_token) {
            setIsMfaRequired(true);
            setChallengeToken(data.challenge_token);
            toast.info("Please enter your 2FA code.");
          }
        },
        onError: (error) => {
          console.error(error);
          toast.error(
            error instanceof AxiosError
              ? error?.response?.data?.detail
              : "Login failed. Please try again."
          );
        },
      }
    );
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMfa(
      { challenge_token: challengeToken, code: otpCode },
      {
        onError: (error) => {
          console.error("MFA Error", error);
          const msg = error instanceof AxiosError
            ? error?.response?.data?.detail
            : "Invalid code";
          toast.error(msg || "Verification failed");
          // Optionally clear code on error
          setOtpCode("");
        }
      }
    )
  };

  if (isMfaRequired) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          {/* Icon */}
          <div className="h-20 w-20 bg-[#E5004E] rounded-full flex items-center justify-center mb-2">
            <div className="h-10 w-10 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-[#111827] tracking-tight">OTP Verification</h1>
            <div className="text-lg text-gray-500">
              Enter the 6-digit code from your <br /> authenticator app
            </div>
            <div className="flex items-center justify-center gap-1 text-base text-gray-500 mt-2">
              <span>Not your account?</span>
              <Button
                variant='link'
                onClick={() => {
                  setIsMfaRequired(false);
                  setOtpCode("");
                  setChallengeToken("");
                }}
                className="text-[#2563EB] hover:underline font-medium px-0"
              >
                Change it
              </Button>
            </div>
          </div>

          <form onSubmit={handleMfaSubmit} className="w-full space-y-8 mt-4">
            <div className="flex justify-center w-full">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(val) => setOtpCode(val)}
              >
                <InputOTPGroup className="gap-3 sm:gap-4 flex w-full justify-center">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-14 h-14 sm:w-[80px] sm:h-[67px] !rounded-2xl sm:!rounded-3xl text-lg text-center border border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isVerifyPending || otpCode.length !== 6}
              className="w-full h-14 bg-[#F4729F] hover:bg-[#E5004E] text-white rounded-full font-semibold text-lg transition-colors shadow-sm"
            >
              {isVerifyPending ? "Verifying..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 sm:px-8">
      <div className="w-full max-w-md lg:w-[400px] lg:h-[428px] space-y-6">
        <h1 className="text-4xl sm:text-5xl font-semibold text-center text-gray-900 mb-8">
          Login
        </h1>

        <form onSubmit={handleLoginSubmit} className="w-full space-y-5">
          <div className="w-full space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-600 mb-2">
              Company Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 text-gray-900 bg-gray-50"
              placeholder="hello@uwiki.co"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-600 mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="h-12 pr-10 border-gray-200 focus:border-pink-500 focus:ring-pink-500 bg-gray-50"
              />
              <Button
                variant="ghost"
                type="button"
                className="absolute top-1/2 right-1 -translate-y-1/2 p-0 h-auto"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-right mt-3 mb-5">
            <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>
              <Button
                variant="link"
                className="text-sm text-teal-500 hover:underline"
                type="button"
              >
                Forgot password ?
              </Button>
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoginPending}
            className="w-full h-12 bg-[#E5004E] hover:bg-pink-400 text-white rounded-full font-medium text-base"
          >
            {isLoginPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
