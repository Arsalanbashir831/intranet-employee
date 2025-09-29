"use client";
import Image from "next/image";
import * as React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row p-6 lg:p-8">
      {/* Left side with logo and form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="mb-8 lg:mb-0">
          <Image src="/logo.svg" alt="Company Logo" width={231} height={85} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Right side with image (only visible on lg and above) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <div className="relative w-full h-full rounded-[24px] overflow-hidden">
          <Image
            src="/images/office-background.svg"
            alt="Office background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
