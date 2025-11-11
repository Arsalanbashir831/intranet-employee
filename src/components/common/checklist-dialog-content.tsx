"use client";

import Image from "next/image";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChecklistTaskDialogProps } from "@/types/checklist";
import { handleFileDownload } from "@/lib/utils";

export default function ChecklistDialogContent({
  title,
  subtitle,
  description,
  date,
  files = [],
}: ChecklistTaskDialogProps) {

  return (
    <DialogContent
      id="dialog-content-checklist-dialog"
      showCloseButton={false}
      className="w-[calc(100%-2rem)] sm:max-w-5xl bg-white shadow-xl rounded-lg p-0 max-h-[90vh] flex flex-col overflow-hidden"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 sm:p-6 pb-3 sm:pb-4 flex-shrink-0">
        <DialogHeader className="flex flex-col items-start gap-1 sm:gap-2">
          <div className="flex items-start gap-2 sm:gap-4 pr-8 w-full">
            <div className="p-2 sm:p-2 bg-white shadow-xs border rounded-[7px] border-gray-300 flex-shrink-0">
              <Image
                src="/icons/clipboard-primary.svg"
                alt="clipboard icon"
                width={24}
                height={24}
                className="sm:w-[30px] sm:h-[30px]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-[12px] sm:text-[15px] text-left font-semibold text-gray-800 break-words">
                {title}
              </DialogTitle>
              {subtitle && (
                <DialogDescription className="text-xs sm:text-sm text-gray-500 break-words">
                  {subtitle}
                </DialogDescription>
              )}
            </div>
            <DialogClose className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 text-gray-500 hover:text-gray-700">
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="h-[500px]">
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 gap-3 sm:gap-4 flex flex-col h-full">
          {/* To Do Section */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-1">
              <Image
                src="/icons/todo.svg"
                alt="todo"
                width={14}
                height={14}
                className="sm:w-4 sm:h-4"
              />
              Details
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1 sm:space-y-2">
            <div
              className="text-xs sm:text-sm text-gray-600 leading-relaxed prose-p:leading-relaxed prose-pre:p-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 [&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* Files Section */}
          {files.length > 0 && (
            <div className="mt-2 sm:mt-4">
              <div className="space-y-2">
                {files.map((file) => {
                  // Extract filename from URL
                  const filename = file.file.split("/").pop() || "File";
                  return (
                    <Button
                      key={file.id}
                      variant="outline"
                      className="w-full h-12 sm:h-14 flex items-center rounded-xl justify-start gap-2 border-gray-200 p-2 sm:p-3"
                      onClick={() => handleFileDownload(file.file)}
                    >
                      <div className="bg-[#E5004E] p-1.5 sm:p-2 rounded-sm flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/icons/clipboard.svg"
                          alt="clipboard"
                          width={18}
                          height={18}
                          className="sm:w-[22px] sm:h-[22px]"
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 truncate flex-1 text-left">
                        {filename}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="mt-2 sm:mt-4">
            <span className="inline-block text-[10px] sm:text-xs font-medium text-[#FF7979] bg-[#FF7979]/10 px-2 sm:px-3 py-1 rounded-md">
              {date}
            </span>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}
