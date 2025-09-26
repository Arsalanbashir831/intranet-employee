"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ChecklistTaskDrawerProps {
  title: string;
  subtitle?: string;
  description: string;
  date: string;
}

export default function ChecklistDrawer({
  title,
  subtitle,
  description,
  date,
}: ChecklistTaskDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="flex items-center text-[10px] font-medium text-white hover:underline cursor-pointer">
          See Details
          <ArrowRight className="w-3 h-3 ml-1" />
        </span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[380px] bg-white shadow-xl rounded-l-2xl p-6 overflow-y-auto"
      >
        {/* Header */}
        <SheetHeader className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-4">
            {/* Icon in rounded pink background */}
            <div className="p-2 bg-white shadow-xs border rounded-[7px] border-gray-300 ">
              <Image
                src="/icons/clipboard-primary.svg"
                alt="clipboard icon"
                width={30}
                height={30}
              />
            </div>
            <div>
              <SheetTitle className="text-[15px] font-semibold text-gray-800">
                {title}
              </SheetTitle>
              {subtitle && (
                <SheetDescription className="text-sm text-gray-500">
                  {subtitle}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* To Do Section */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
            <Image
              src="/icons/todo.svg"
              alt="clipboard"
              width={16}
              height={16}
            />
            To do
          </p>
          <hr className="mt-2 border-3 rounded border-gray-300" />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center rounded-xl justify-start gap-2 border-gray-200"
          >
            <div className="bg-[#E5004E] p-2 rounded-sm flex items-center justify-center">
              <Image
                src="/icons/clipboard.svg"
                alt="clipboard"
                width={22}
                height={22}
              />
            </div>
            Add KB Article
          </Button>
        </div>

        {/* Date */}
        <div className="mt-5">
          <span className="inline-block text-xs font-medium text-[#FF7979] bg-[#FF7979]/10 px-3 py-1 rounded-md">
            {date}
          </span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
