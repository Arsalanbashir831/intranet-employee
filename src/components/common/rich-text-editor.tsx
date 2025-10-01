"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Highlight } from "@tiptap/extension-highlight";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	AlignLeft,
	AlignCenter,
	AlignRight,
	List,
	ListOrdered,
	Image as ImageIcon,
	Type,
	ChevronUp,
	ChevronDown,
	HighlighterIcon,
	BaselineIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export interface RichTextEditorProps {
	content?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	minHeight?: string;
	maxHeight?: string;
}

export function RichTextEditor({
	content = "",
	onChange,
	placeholder = "Write your content here...",
	className,
	disabled = false,
	minHeight = "160px", // a bit smaller for phones
	maxHeight = "480px",
}: RichTextEditorProps) {
	const [fontSize, setFontSize] = React.useState(16);
	const [showTextColorPicker, setShowTextColorPicker] = React.useState(false);
	const [showHighlightColorPicker, setShowHighlightColorPicker] =
		React.useState(false);
	const [textColor, setTextColor] = React.useState("#000000");
	const [highlightColor, setHighlightColor] = React.useState("#FFFF00");
	const [imageUrl, setImageUrl] = React.useState("");
	const [showImagePopover, setShowImagePopover] = React.useState(false);

	const quickTextColors = [
		"#000000",
		"#333333",
		"#666666",
		"#999999",
		"#CCCCCC",
		"#FFFFFF",
		"#FF0000",
		"#FF6600",
		"#FFCC00",
		"#00FF00",
		"#0066FF",
		"#6600FF",
		"#FF0066",
		"#00FFFF",
		"#FFFF00",
		"#FF00FF",
		"#00FF66",
		"#0066FF",
	];
	const quickHighlightColors = [
		"#FFFF00",
		"#FFE066",
		"#FFB366",
		"#FF9999",
		"#99CCFF",
		"#99FF99",
		"#FFCCFF",
		"#CC99FF",
		"#FFE6CC",
		"#E6F3FF",
		"#E6FFE6",
		"#FFF0E6",
		"#F0F8FF",
		"#F5F5DC",
		"#FFE4E1",
		"#E0FFFF",
		"#F0FFF0",
		"#FFFACD",
	];

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest("[data-color-picker]")) {
				setShowTextColorPicker(false);
				setShowHighlightColorPicker(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false,
				codeBlock: false,
				blockquote: false,
				horizontalRule: false,
				hardBreak: false,
				code: false,
				bold: {},
				italic: {},
				strike: {},
				bulletList: { keepMarks: true, keepAttributes: false },
				orderedList: { keepMarks: true, keepAttributes: false },
			}),
			TextStyle,
			Color,
			TextAlign.configure({ types: ["paragraph"] }),
			BulletList.configure({
				HTMLAttributes: { class: "list-disc list-inside" },
				itemTypeName: "listItem",
				keepMarks: true,
				keepAttributes: false,
			}),
			OrderedList.configure({
				HTMLAttributes: { class: "list-decimal list-inside" },
				itemTypeName: "listItem",
				keepMarks: true,
				keepAttributes: false,
			}),
			ListItem.configure({ HTMLAttributes: { class: "list-item" } }),
			Image.configure({
				HTMLAttributes: { class: "max-w-full h-auto rounded" },
			}),
			Highlight.configure({ multicolor: true }),
			Placeholder.configure({ placeholder }),
		],
		content,
		editable: !disabled,
		immediatelyRender: false,
		onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
		editorProps: {
			attributes: {
				class: cn(
					"prose prose-sm sm:prose-base max-w-none focus:outline-none",
					"prose-p:leading-relaxed prose-pre:p-0",
					"prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
					"[&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
				),
			},
		},
	});

	React.useEffect(() => {
		if (!editor) return;
		if (typeof content === "string") {
			try {
				const current = editor.getHTML();
				if (current !== content) editor.commands.setContent(content);
			} catch {
				editor.commands.setContent(content);
			}
		}
	}, [editor, content]);

	const updateFontSize = (size: number) => {
		const clamped = Math.max(8, Math.min(72, size));
		setFontSize(clamped);
		editor?.chain().focus().setFontSize?.(`${clamped}px`).run();
	};

	const handleTextColorChange = (color: string) => {
		setTextColor(color);
		editor?.chain().focus().setColor(color).run();
	};
	const handleHighlightColorChange = (color: string) => {
		setHighlightColor(color);
		editor?.chain().focus().setHighlight({ color }).run();
	};
	const toggleHighlight = () => {
		if (editor?.isActive("highlight"))
			editor?.chain().focus().unsetHighlight().run();
		else editor?.chain().focus().setHighlight({ color: highlightColor }).run();
	};

	const insertImage = () => {
		if (imageUrl.trim()) {
			editor?.chain().focus().setImage({ src: imageUrl.trim() }).run();
			setImageUrl("");
			setShowImagePopover(false);
		}
	};
	const handleImageUrlKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			insertImage();
		}
	};
	const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value && !isNaN(Number(value))) updateFontSize(Number(value));
	};
	const handleFontSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		e.stopPropagation();
	};

	if (!editor) return null;

	return (
		<div
			className={cn("rounded-md border border-[#E2E8F0] bg-white", className)}>
			{/* Toolbar (responsive: scrolls on mobile, wraps if needed) */}
			<div
				className={cn(
					"flex flex-wrap md:flex-nowrap items-center gap-1 md:gap-2",
					"border-b border-[#E2E8F0] text-muted-foreground text-xs sm:text-sm",
					"px-2 sm:px-3 py-1.5",
					"overflow-x-auto md:overflow-x-visible",
					"[&::-webkit-scrollbar]:hidden scrollbar-none"
				)}>
				{/* Font size */}
				<div className="pl-0 sm:pl-1 flex items-center">
					<Input
						type="number"
						value={fontSize}
						onChange={handleFontSizeChange}
						onKeyDown={handleFontSizeKeyDown}
						className="w-10 sm:w-11 h-7 text-[10px] sm:text-xs text-[#475569] font-bold border-none shadow-none rounded pl-1 pr-0
                       [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						min={8}
						max={72}
					/>
					<div className="ml-1 -space-y-1">
						<ChevronUp
							className="size-3 cursor-pointer text-[#475569] hover:text-foreground"
							onClick={() => updateFontSize(fontSize + 1)}
						/>
						<ChevronDown
							className="size-3 cursor-pointer text-[#475569] hover:text-foreground"
							onClick={() => updateFontSize(fontSize - 1)}
						/>
					</div>
				</div>

				<Separator
					orientation="vertical"
					className="!h-7 sm:!h-8 mx-1 bg-[#E2E8F0]"
				/>

				{/* Text color */}
				<Popover
					open={showTextColorPicker}
					onOpenChange={setShowTextColorPicker}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"h-7 w-7 p-0 text-[#475569]",
								editor?.isActive("textStyle") && "bg-muted"
							)}>
							<BaselineIcon className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-[200px] sm:w-[220px] p-3"
						align="start"
						data-color-picker>
						<div className="mb-3">
							<div className="text-xs text-muted-foreground mb-2">
								Quick Colors
							</div>
							<div className="grid grid-cols-6 gap-1">
								{quickTextColors.map((color, idx) => (
									<Button
										key={`${color}-${idx}`}
										variant="ghost"
										size="sm"
										className={cn(
											"w-6 h-6 rounded border-2 transition-all hover:scale-110",
											textColor === color
												? "border-gray-400 ring-2 ring-gray-300"
												: "border-gray-200 hover:border-gray-300"
										)}
										style={{ backgroundColor: color }}
										onClick={() => handleTextColorChange(color)}
										title={color}
									/>
								))}
							</div>
						</div>
						<div className="border-t pt-3">
							<div className="text-xs text-muted-foreground mb-2">
								Custom Color
							</div>
							<HexColorPicker
								color={textColor}
								onChange={handleTextColorChange}
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-3 flex justify-between items-center">
							<span className="text-xs text-muted-foreground">Text Color</span>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 px-2 text-xs"
								onClick={() => setShowTextColorPicker(false)}>
								Done
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				{/* Highlight */}
				<Popover
					open={showHighlightColorPicker}
					onOpenChange={setShowHighlightColorPicker}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"h-7 w-7 p-0 text-[#475569]",
								editor?.isActive("highlight") && "bg-muted"
							)}
							onClick={toggleHighlight}
							onContextMenu={(e) => {
								e.preventDefault();
								setShowHighlightColorPicker(true);
							}}
							title="Left click: Toggle highlight • Right click: Change color">
							<HighlighterIcon className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-[200px] sm:w-[220px] p-3"
						align="start"
						data-color-picker>
						<div className="mb-3">
							<div className="text-xs text-muted-foreground mb-2">
								Quick Colors
							</div>
							<div className="grid grid-cols-6 gap-1">
								{quickHighlightColors.map((color, idx) => (
									<Button
										variant="ghost"
										size="sm"
										key={`${color}-${idx}`}
										className={cn(
											"w-6 h-6 rounded border-2 transition-all hover:scale-110",
											highlightColor === color
												? "ring-2 ring-gray-300"
												: "border-gray-200 hover:border-gray-300"
										)}
										style={{ backgroundColor: color }}
										onClick={() => handleHighlightColorChange(color)}
										title={color}
									/>
								))}
							</div>
						</div>
						<div className="border-t pt-3">
							<div className="text-xs text-muted-foreground mb-2">
								Custom Color
							</div>
							<HexColorPicker
								color={highlightColor}
								onChange={handleHighlightColorChange}
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-3 flex justify-between items-center">
							<span className="text-xs text-muted-foreground">
								Highlight Color
							</span>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 px-2 text-xs"
								onClick={() => setShowHighlightColorPicker(false)}>
								Done
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				{/* Inline styles */}
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive("bold") && "bg-muted"
					)}
					onClick={() => editor.chain().focus().toggleBold().run()}>
					<Bold className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive("italic") && "bg-muted"
					)}
					onClick={() => editor.chain().focus().toggleItalic().run()}>
					<Italic className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive("underline") && "bg-muted"
					)}
					onClick={() => editor.chain().focus().toggleUnderline?.().run()}>
					<Underline className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive("strike") && "bg-muted"
					)}
					onClick={() => editor.chain().focus().toggleStrike().run()}>
					<Strikethrough className="size-4" />
				</Button>

				<Separator
					orientation="vertical"
					className="!h-7 sm:!h-8 mx-1 bg-[#E2E8F0]"
				/>

				{/* Align */}
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive({ textAlign: "left" }) && "bg-muted"
					)}
					onClick={() => editor.chain().focus().setTextAlign("left").run()}>
					<AlignLeft className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive({ textAlign: "center" }) && "bg-muted"
					)}
					onClick={() => editor.chain().focus().setTextAlign("center").run()}>
					<AlignCenter className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive({ textAlign: "right" }) && "bg-muted"
					)}
					onClick={() => editor.chain().focus().setTextAlign("right").run()}>
					<AlignRight className="size-4" />
				</Button>

				<Separator
					orientation="vertical"
					className="!h-7 sm:!h-8 mx-1 bg-[#E2E8F0]"
				/>

				{/* Lists */}
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive("bulletList") && "bg-muted"
					)}
					onClick={() => editor.chain().focus().toggleBulletList().run()}>
					<List className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-7 w-7 p-0 text-[#475569]",
						editor.isActive("orderedList") && "bg-muted"
					)}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}>
					<ListOrdered className="size-4" />
				</Button>

				<Separator
					orientation="vertical"
					className="!h-7 sm:!h-8 mx-1 bg-[#E2E8F0]"
				/>

				{/* Image */}
				<Popover open={showImagePopover} onOpenChange={setShowImagePopover}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0 text-[#475569]">
							<ImageIcon className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[260px] sm:w-80 p-3" align="start">
						<div className="space-y-3">
							<div>
								<label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
									Image URL
								</label>
								<Input
									placeholder="Enter image URL..."
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									onKeyDown={handleImageUrlKeyDown}
									className="w-full"
								/>
							</div>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setImageUrl("");
										setShowImagePopover(false);
									}}>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={insertImage}
									disabled={!imageUrl.trim()}>
									Insert Image
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Separator
					orientation="vertical"
					className="!h-7 sm:!h-8 mx-1 bg-[#E2E8F0]"
				/>

				{/* Tags (sample) */}
				<Button
					variant="ghost"
					className="h-7 px-2 text-[11px] sm:text-xs text-[#475569]"
					onClick={() =>
						editor
							?.chain()
							.focus()
							.insertContent(
								'<span style="color:#6b7280;font-style:italic;">#</span>'
							)
							.run()
					}>
					<Type className="size-4 mr-1" />
					Tags
				</Button>
			</div>

			{/* Editor Content */}
			<div
				className="p-3 sm:p-4 focus-within:outline-none"
				style={{
					minHeight, // base min height (can pass prop)
					maxHeight, // base max height
					overflowY: "auto",
				}}>
				<EditorContent
					editor={editor}
					className="focus:outline-none [&_ul_li_p]:inline [&_ol_li_p]:inline [&_ul_li_p]:m-0 [&_ol_li_p]:m-0"
					style={{
						fontSize: `${fontSize}px`,
					}}
				/>
			</div>
		</div>
	);
}
