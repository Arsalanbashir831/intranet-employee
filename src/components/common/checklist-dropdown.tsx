"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ChecklistDialog() {
  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        
      </DialogTrigger>

      {/* Right side drawer */}
      <DialogContent
        className="fixed top-[250px] h-screen w-[400px] border-l border-gray-100 bg-white shadow-lg rounded-l-xl overflow-y-auto p-0"
        // prevent Radix from auto-focusing and recentering
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Accessibility requirement (hidden title for screen readers) */}
        <DialogTitle>
          <span className="sr-only">Task Details</span>
        </DialogTitle>

        {/* Inner content wrapper (537x1024) */}
        <div
          className="mx-auto my-10 bg-white rounded-lg overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center">
                <Image
                  src="/icons/clipboard-text-primary.svg"
                  alt="No tasks"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  Design new ui presentation
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Dribbble marketing
                </div>
              </div>
            </div>

            {/* To do section */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/todo.svg"
                  alt="No tasks"
                  width={16}
                  height={16}
                  className="object-contain"
                />
                <div className="text-xs uppercase text-gray-400">To do</div>
              </div>
              <div className="h-px border-4 rounded-full border-gray-300 mt-2" />
            </div>

            {/* Body text */}
            <div className="mt-5 text-md text-gray-700 leading-relaxed max-w-[350px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </div>

            {/* Add KB Article button */}
            <div className="mt-6  max-w-[350px]">
              <button
                type="button"
                className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2 bg-white hover:shadow-sm transition"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#E5004E] rounded-md border border-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/clipboard-text.svg"
                    alt="No tasks"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  Add KB Article
                </span>
              </button>
            </div>

            {/* Date pill */}
            <div className="mt-5">
              <div className="inline-block text-xs text-pink-500 bg-pink-50 px-3 py-1 rounded-full font-medium">
                25 Aug 2022
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
