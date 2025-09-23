"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function ForgotPassword() {
  return (
   <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-sm space-y-6">
            {/* Title */}
            <div className="">
              <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-600">
                Please enter your details below
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="✉ hello@cartwright.com"
                className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 text-gray-900 bg-gray-50 pl-4"
              />
            </div>

            {/* Send Reset Email Button */}
            <Link href="/otp-verification">
              <Button 
              className="w-full mb-4 h-12 bg-[#D64575] hover:bg-pink-400 text-white rounded-full font-medium text-base">
                Send reset email
              </Button>
            </Link>

            {/* Back to Sign In Button */}
            <Link href="/">
              <Button
                variant="outline"
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-medium text-base bg-transparent"
              >
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
  );
}
