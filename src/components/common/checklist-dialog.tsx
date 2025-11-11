"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import ChecklistDialogContent from "./checklist-dialog-content";
import type { ChecklistDialogProps } from "@/types/checklist";

export default function ChecklistDialog({
  files = [],
  ...props
}: ChecklistDialogProps) {
  return (
    <Dialog>
      <DialogTrigger id="dialog-trigger-checklist-dialog" asChild>
        <span className="flex items-center text-[10px] sm:text-xs font-medium text-white hover:underline cursor-pointer active:opacity-70">
          See Details
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" />
        </span>
      </DialogTrigger>
      <ChecklistDialogContent {...props} files={files} />
    </Dialog>
  );
}
