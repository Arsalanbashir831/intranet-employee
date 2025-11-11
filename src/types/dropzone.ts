/**
 * Dropzone component types
 */

import * as React from "react";

export type DropzoneProps = {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  children?: React.ReactNode;
  showPreview?: boolean;
  initialPreviewUrls?: string[]; // pre-loaded previews (e.g., existing images in edit mode)
};
