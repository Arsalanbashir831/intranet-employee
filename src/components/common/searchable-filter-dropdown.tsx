"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FilterItem,
  SearchableFilterDropdownProps,
} from "@/types/searchable-filter-dropdown";

export function SearchableFilterDropdown<T extends FilterItem>({
  selectedValue,
  onValueChange,
  className,
  icon: Icon,
  items,
  isLoading,
  isError,
  searchPlaceholder,
  allLabel,
  loadingLabel,
  errorLabel,
  emptyLabel,
  emptySearchLabel,
  getItemId,
  getItemName,
  searchQuery,
  onSearchChange,
}: SearchableFilterDropdownProps<T>) {
  const [open, setOpen] = React.useState(false);

  // Get selected item name for display
  const selectedItemName = React.useMemo(() => {
    if (selectedValue === "__all__") return allLabel;
    const item = items.find((item) => getItemId(item) === selectedValue);
    return item ? getItemName(item) : allLabel;
  }, [selectedValue, items, allLabel, getItemId, getItemName]);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setOpen(false);
    onSearchChange(""); // Clear search when selection is made
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("gap-1 rounded-[4px] justify-between", className)}
        >
          <Icon className="size-3.5 mr-1" />
          {selectedItemName}
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[300px] w-fit p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={onSearchChange}
          />
          <CommandList>
            {/* Loading State */}
            {isLoading && (
              <div className="py-6 text-center text-sm text-gray-500">
                {loadingLabel}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="py-6 text-center text-sm text-red-500">
                {errorLabel}
              </div>
            )}

            {/* Items List */}
            {!isLoading && !isError && (
              <>
                <CommandEmpty>
                  {items.length === 0 && searchQuery
                    ? emptySearchLabel
                    : emptyLabel}
                </CommandEmpty>
                <CommandGroup>
                  {/* All Option */}
                  <CommandItem
                    value="__all__"
                    onSelect={() => handleSelect("__all__")}
                    className="py-2 text-[15px]"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === "__all__"
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {allLabel}
                  </CommandItem>

                  {/* Item Options */}
                  {items.map((item) => {
                    const itemId = getItemId(item);
                    const itemName = getItemName(item);
                    return (
                      <CommandItem
                        key={itemId}
                        value={itemName}
                        onSelect={() => handleSelect(itemId)}
                        className="py-2 text-[15px]"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValue === itemId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {itemName}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
