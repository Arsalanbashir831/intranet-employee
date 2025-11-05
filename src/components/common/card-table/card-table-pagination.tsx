"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationState } from "@/lib/pagination-utils";
import { calculateTotalPages, generatePageNumbers } from "@/lib/pagination-utils";

interface CardTablePaginationProps<TData> {
  table?: Table<TData>;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  alwaysShow?: boolean; // Show pagination even for single page
}

export function CardTablePagination<TData>({ 
  table, 
  pageIndex: externalPageIndex,
  pageSize: externalPageSize = 10,
  totalCount = 0,
  onPaginationChange,
  alwaysShow = false
}: CardTablePaginationProps<TData>) {
  // Use external pagination if provided, otherwise use table pagination
  const isExternalPagination = externalPageIndex !== undefined && onPaginationChange !== undefined;
  
  const pageCount = isExternalPagination 
    ? calculateTotalPages(totalCount, externalPageSize) 
    : table?.getPageCount() || 0;
    
  const pageIndex = isExternalPagination 
    ? externalPageIndex 
    : table?.getState().pagination.pageIndex || 0;

  const numbers = React.useMemo(() => {
    if (pageCount <= 1) {
      // If alwaysShow is true and there's at least 1 page, return [0] for single page
      if (alwaysShow && pageCount === 1) {
        return [0];
      }
      return [];
    }
    
    if (isExternalPagination) {
      return generatePageNumbers(pageIndex, pageCount);
    }
    
    if (!table) return [];
    
    const pages: (number | "...")[] = [];
    for (let i = 0; i < pageCount; i++) pages.push(i);
    if (pages.length <= 7) return pages;
    const cur = pageIndex;
    const start = Math.max(0, cur - 1);
    const end = Math.min(pageCount - 1, cur + 1);
    const res: (number | "...")[] = [0];
    if (start > 1) res.push("...");
    for (let i = start; i <= end; i++) if (i !== 0 && i !== pageCount - 1) res.push(i);
    if (end < pageCount - 2) res.push("...");
    res.push(pageCount - 1);
    return res;
  }, [pageCount, pageIndex, isExternalPagination, table, alwaysShow]);

  // Don't show pagination if there's only one page or no data (unless alwaysShow is true)
  if (pageCount <= 1 && !alwaysShow) {
    return null;
  }
  
  // Don't show if no data
  if (pageCount === 0) {
    return null;
  }

  const go = (idx: number) => {
    if (isExternalPagination && onPaginationChange) {
      onPaginationChange({ pageIndex: idx, pageSize: externalPageSize });
    } else if (table) {
      table.setPageIndex(idx);
    }
  };

  const canPreviousPage = isExternalPagination 
    ? pageIndex > 0 
    : table?.getCanPreviousPage() || false;
    
  const canNextPage = isExternalPagination 
    ? pageIndex < pageCount - 1 
    : table?.getCanNextPage() || false;

  const handlePreviousPage = () => {
    if (isExternalPagination && onPaginationChange) {
      onPaginationChange({ pageIndex: Math.max(0, pageIndex - 1), pageSize: externalPageSize });
    } else if (table) {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (isExternalPagination && onPaginationChange) {
      onPaginationChange({ pageIndex: Math.min(pageCount - 1, pageIndex + 1), pageSize: externalPageSize });
    } else if (table) {
      table.nextPage();
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="icon"
        variant="outline"
        onClick={handlePreviousPage}
        disabled={!canPreviousPage}
        className="size-9 rounded-[4px] border-[#C4CDD5] text-[#C4CDD5]"
      >
        <ChevronLeft className="size-4" />
      </Button>
      {numbers.map((n, i) =>
        n === "..." ? (
          <div key={`dots-${i}`} className="size-9 rounded-[4px] border grid place-items-center text-[#C4CDD5] border-[#C4CDD5]">
            …
          </div>
        ) : (
          <Button
            key={n}
            variant="outline"
            onClick={() => go(n as number)}
            className={cn(
              "size-9 rounded-[4px] border grid place-items-center font-semibold hover:text-primary",
              pageIndex === n ? "border-[#D64575] text-[#D64575]" : "border-[#C4CDD5] text-[#C4CDD5]"
            )}
          >
            {(n as number) + 1}
          </Button>
        )
      )}
      <Button
        size="icon"
        variant="outline"
        onClick={handleNextPage}
        disabled={!canNextPage}
        className="size-9 rounded-[4px] border-[#C4CDD5] text-[#C4CDD5]"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}