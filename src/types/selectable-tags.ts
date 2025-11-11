/**
 * Selectable Tags component types
 */

import * as React from "react";

// Reusable SelectableItem type
export type SelectableItem = {
  id: string;
  label: string;
};

export type SelectableTagsProps = {
  items: SelectableItem[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
  allowCreate?: boolean;
  onCreateTag?: (label: string) => void;
  icon?: React.ReactNode;
  // Optional custom renderer to display selected items inside the trigger
  renderSelected?: (id: string) => React.ReactNode;
};
