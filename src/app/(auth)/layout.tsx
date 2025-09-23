"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white flex p-8">
      {/* Left side with logo and form */}
      <div className="w-1/2 flex flex-col">
        <div>
          <Image
            src="/logo.svg"
            alt="Company Logo"
            width={231}
            height={85}
          />
        </div>

        {children}
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
