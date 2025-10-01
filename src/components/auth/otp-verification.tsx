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
		<div className="flex-1 flex items-center justify-center px-6 sm:px-8">
			<div className="w-full max-w-md lg:w-[400px] lg:h-[428px] space-y-6 py-12 lg:py-0">
				{/* Icon */}
				<div className="w-16 h-16 bg-[#E5004E] rounded-full flex items-center justify-center mx-auto lg:mx-0">
					<Image src="/icons/lock.svg" alt="Lock Icon" width={28} height={28} />
				</div>

				{/* Title */}
				<div className="text-center lg:text-left">
					<h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-2">
						OTP Verification
					</h1>
					<p className="text-base sm:text-lg text-gray-600 mb-1">
						We&lsquo;ve sent a 4-digit code to{" "}
						<span className="font-medium">hello@cartwright.com</span>
					</p>
					<p className="text-base sm:text-lg text-gray-600">
						Not your email?{" "}
						<Button
							asChild
							variant="link"
							className="p-0 h-auto text-blue-500 hover:underline font-normal">
							<Link href="/forgot-password">Change it</Link>
						</Button>
					</p>
				</div>

				{/* OTP Input */}
				<div className="flex justify-center">
					<InputOTP maxLength={4} value={otp} onChange={setOtp}>
						<InputOTPGroup className="flex gap-3 sm:gap-4">
							{[0, 1, 2, 3].map((index) => (
								<InputOTPSlot
									key={index}
									index={index}
									className="w-14 h-14 sm:w-[80px] sm:h-[67px] !rounded-2xl sm:!rounded-3xl text-lg text-center border border-gray-300 focus:border-pink-500 focus:ring-pink-500"
								/>
							))}
						</InputOTPGroup>
					</InputOTP>
				</div>

				{/* Submit Button */}
				<Link href="/reset-password">
					<Button className="w-full h-12 mb-2 bg-[#E5004E] hover:bg-pink-300 text-white rounded-full font-medium text-base">
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
