"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export function ForgotPassword() {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="w-[450px] h-[428px] max-w-md space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-5xl font-semibold text-gray-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-lg text-gray-600">
            Please enter your details below
          </p>
        </div>

        {/* Email Input */}
        <div className="relative space-y-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Image
              src="/icons/sms.svg"
              alt="Email Icon"
              width={18}
              height={18}
              className="text-gray-400"
            />
          </span>
          <Input
            type="email"
            placeholder="hello@cartwright.com"
            className="h-12 border-gray-700 rounded-full focus:border-pink-500 focus:ring-pink-500 text-gray-900 pl-10"
          />
        </div>

        {/* Send Reset Email Button */}
        <Link href="/otp-verification">
          <Button className="w-full mb-4 h-12 bg-[#D64575] hover:bg-pink-400 text-white rounded-full font-medium text-base">
            Send reset email
          </Button>
        </Link>

        {/* Back to Sign In Button */}
        <Link href="/">
          <Button
            variant="outline"
            className="w-full h-12 border-gray-700 text-gray-700 hover:bg-gray-50 rounded-full font-medium text-base bg-transparent"
          >
            Back to sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}
