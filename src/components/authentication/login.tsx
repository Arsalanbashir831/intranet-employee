"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-[400px] h-[428px] max-w-sm">
            <h1 className="text-5xl font-semibold text-center text-gray-900 mb-8">
              Login
            </h1>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-600 mb-4">
                Company Email *
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="hello@uwiki.co"
                className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 text-gray-900 bg-gray-50"
              />
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-600 mb-4">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
              <Link href="/forgot-password">
                <Button
                  variant="link"
                  className="text-sm text-teal-500 hover:underline"
                >
                  Forgot password ?
                </Button>
              </Link>
            </div>

            <Button className="w-full h-12 bg-[#D64575] hover:bg-pink-400 text-white rounded-full font-medium text-base">
              Sign In
            </Button>
          </div>
        </div>
  );
}
