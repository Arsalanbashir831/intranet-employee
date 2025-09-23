"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import Image from "next/image";

export function OTPVerification() {
  const [otp, setOtp] = useState("");

  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="w-[400px] h-[428px] max-w-sm space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D64575] rounded-full flex items-center justify-center">
          <Image src="/icons/lock.svg" alt="Lock Icon" width={28} height={28} />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-5xl font-semibold text-gray-900 mb-2">
            OTP Verification
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            We&lsquo;ve sent a 4-digit code to{" "}
            <span className="font-medium">hello@cartwright.com</span>
          </p>
          <p className="text-lg text-gray-600">
            Not your email?{" "}
            <Button
              asChild
              variant="link"
              className="p-0 h-auto text-blue-500 hover:underline font-normal"
            >
              <Link href="/forgot-password">Change it</Link>
            </Button>
          </p>
        </div>

        {/* OTP Input (shadcn input-otp) */}
        <div className="flex justify-center">
          <InputOTP maxLength={4} value={otp} onChange={setOtp}>
            <InputOTPGroup className="flex gap-4">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-[80px] h-[67px] !rounded-3xl text-lg text-center border border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Submit Button */}
        <Link href="/reset-password">
          <Button className="w-full h-12 mb-2 bg-[#D64575] hover:bg-pink-300 text-white rounded-full font-medium text-base">
            Submit
          </Button>
        </Link>

        {/* Resend Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn’t get the code?{" "}
            <button className="text-blue-500 hover:underline">Resend</button>
          </p>
        </div>
      </div>
    </div>
  );
}
