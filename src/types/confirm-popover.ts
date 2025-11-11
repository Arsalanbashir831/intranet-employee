/**
 * Confirm Popover component types
 */

import * as React from "react";

export type ConfirmPopoverProps = {
  children: React.ReactNode; // trigger
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  disabled?: boolean;
};
