"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex p-8">
      {/* Left side with logo and form */}
      <div className="w-1/2 flex flex-col">
        {/* Logo */}
        <div>
          <Image
            src="/main-logo.svg"
            alt="Company Logo"
            width={231}
            height={85}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-sm space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-6">
                Reset Password
              </h1>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-sm font-medium text-gray-700"
              >
                New Password*
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password*
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pr-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full bg-[#D64575] rounded-full hover:bg-pink-300 text-white py-3 font-medium">
              Confirm Reset Password
            </Button>
          </div>
        </div>
      </div>

      {/* Right side with image */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="relative w-full h-full rounded-[24px] overflow-hidden">
          <Image
            src="/office-background.svg"
            alt="Office background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
