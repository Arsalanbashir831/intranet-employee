/**
 * Rich Text Editor component types
 */

export type RichTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
};
