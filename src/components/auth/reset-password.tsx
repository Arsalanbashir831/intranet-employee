"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md space-y-6 py-8 md:py-0">
        <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-6 text-center md:text-left">
          Reset Password
        </h1>

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
              className="h-12 pr-10 border-gray-200 focus:border-pink-500 focus:ring-pink-500 bg-gray-50"
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
              className="h-12 pr-10 border-gray-200 focus:border-pink-500 focus:ring-pink-500 bg-gray-50"
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
        <Button className="w-full h-12 mb-2 bg-[#D64575] hover:bg-pink-300 text-white rounded-full font-medium text-base">
          Confirm Reset Password
        </Button>
      </div>
    </div>
  );
}
