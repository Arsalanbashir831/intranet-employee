"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

export default function DocumentCard() {
  return (
    <Card className="w-[320px] h-[503px] m-5 rounded-md overflow-hidden">
      {/* Top Section - Fixed 222px */}
      <div className="flex h-[222px] w-full items-center justify-center bg-pink-50">
        <Image
          src="/icons/document.svg" // replace with your actual path
          alt="Document Icon"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Bottom Section - Fixed 280px */}
      <div className="h-[280px] w-full bg-white px-5 pb-4 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-2xl text-[#D64575]">Document - 1</h3>

          {/* Author + Date */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
              <Image
                src="/icons/profile-icon.svg"
                alt="Profile"
                width={30}
                height={30}
                className="object-contain"
              />
              {/* Author info */}
            <div className="flex flex-col text-sm">
              <span className="font-semibold text-gray-900">
                CARTWRIGHT KING
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarDays className="h-3.5 w-3.5" />
                Monday, September 9, 2024
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600">
            Delightful remarkably mr on announcing themselves entreaties
            favourable.
          </p>
        </div>

        {/* Button pinned to bottom */}
        <Button className="w-full h-[34px] rounded-lg bg-[#E5004E] text-sm font-medium text-white hover:bg-pink-500">
          Download Document
        </Button>
      </div>
    </Card>
  );
}

            