"use client";

import Image from "next/image";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { ChecklistTaskDrawerProps } from "@/types/checklist";

export default function ChecklistDrawerContent({
  title,
  subtitle,
  description,
  date,
  files = [],
}: ChecklistTaskDrawerProps) {
  const handleFileDownload = (fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SheetContent
      id="sheet-content-checklist-drawer"
      side="right"
      className="sm:max-w-2xl bg-white shadow-xl rounded-l-2xl p-6 overflow-y-auto"
    >
      {/* Header */}
      <SheetHeader className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white shadow-xs border rounded-[7px] border-gray-300">
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
          <Image src="/icons/todo.svg" alt="todo" width={16} height={16} />
          Details
        </p>
        <hr className="mt-2 border-3 rounded border-gray-300" />
      </div>

      {/* Description */}
      <div className="space-y-3">
        <div
          className="text-sm text-gray-600 leading-relaxed prose-p:leading-relaxed prose-pre:p-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 [&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {/* Files Section */}
      {files.length > 0 && (
        <div>
          <div className="space-y-2">
            {files.map((file) => {
              // Extract filename from URL
              const filename = file.file.split("/").pop() || "File";
              return (
                <Button
                  key={file.id}
                  variant="outline"
                  className="w-full h-14 flex items-center rounded-xl justify-start gap-2 border-gray-200"
                  onClick={() => handleFileDownload(file.file)}
                >
                  <div className="bg-[#E5004E] p-2 rounded-sm flex items-center justify-center">
                    <Image
                      src="/icons/clipboard.svg"
                      alt="clipboard"
                      width={22}
                      height={22}
                    />
                  </div>
                  <span className="text-sm text-gray-700 truncate flex-1 text-left">
                    {filename}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Date */}
      <div>
        <span className="inline-block text-xs font-medium text-[#FF7979] bg-[#FF7979]/10 px-3 py-1 rounded-md">
          {date}
        </span>
      </div>
    </SheetContent>
  );
}
