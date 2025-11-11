"use client";

import React, { useCallback, useRef, useState } from "react";
import NextImage from "next/image";
import Cropper, { Area } from "react-easy-crop";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import { useUploadProfilePicture, useDeleteProfilePicture } from "@/hooks/queries/use-employees";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { readFileAsDataUrl, cropToDataUrlAndFile } from "@/lib/image-utils";
import type { ProfilePictureDialogProps } from "@/types/profile";

/* ---------------------- Component ---------------------- */
export function ProfilePictureDialog({
	image,
	name,
	onSave,
	onDelete,
	open,
	onOpenChange,
}: ProfilePictureDialogProps) {
	const { user } = useAuth();
	const { mutate: uploadProfilePicture } = useUploadProfilePicture();
	const { mutate: deleteProfilePicture } = useDeleteProfilePicture();
	
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = typeof open === "boolean";
	const dialogOpen = isControlled ? open! : internalOpen;
	const setDialogOpen = (v: boolean) =>
		isControlled ? onOpenChange?.(v) : setInternalOpen(v);

	const initialPreview = image ?? "";
	const [preview, setPreview] = useState<string>(initialPreview);
	const [source, setSource] = useState<string | null>(null);
	const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const dataUrl = await readFileAsDataUrl(f);
		setSource(dataUrl);
	};

	const onCropComplete = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const handleDone = async () => {
		if (!source || !croppedAreaPixels || !user?.employeeId) return;
		
		try {
			const { dataUrl, file } = await cropToDataUrlAndFile(
				source,
				croppedAreaPixels,
				"avatar.png"
			);
			
			// Upload the file using the hook
			uploadProfilePicture(file, {
				onSuccess: () => {
					// Call the onSave callback if provided
					onSave?.({ dataUrl, file });
					
					// Close the dialog
					setDialogOpen(false);
					
					toast.success("Profile picture updated successfully");
				},
				onError: (error) => {
					console.error("Failed to upload profile picture:", error);
					toast.error("Failed to update profile picture");
				}
			});
		} catch (error) {
			console.error("Failed to process profile picture:", error);
			toast.error("Failed to process profile picture");
		}
	};

	const handleDelete = async () => {
		if (!user?.employeeId) return;
		
		// Delete the profile picture using the hook
		deleteProfilePicture(undefined, {
			onSuccess: () => {
				// Reset the preview
				setPreview("");
				setSource(null);
				setCroppedAreaPixels(null);
				setZoom(1);
				setCrop({ x: 0, y: 0 });
				
				// Call the onDelete callback if provided
				onDelete?.();
				
				// Close the dialog
				setDialogOpen(false);
				
				toast.success("Profile picture deleted successfully");
			},
			onError: (error) => {
				console.error("Failed to delete profile picture:", error);
				toast.error("Failed to delete profile picture");
			}
		});
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{/* Trigger button on avatar corner */}
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="secondary"
					className="absolute bottom-0 right-0 rounded-full bg-white shadow-md hover:bg-[#E5004E] group transition"
					onClick={() => setDialogOpen(true)}>
					<NextImage
						src="/icons/edit.svg"
						width={19}
						height={18}
						alt="edit"
						className="transition group-hover:brightness-0 group-hover:invert"
					/>
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-row items-center gap-2">
					<NextImage
						src="/icons/featured-icon.svg"
						width={40}
						height={40}
						alt="crop"
					/>
					<DialogTitle>Change Profile Picture</DialogTitle>
				</DialogHeader>

				{/* Profile Preview */}
				<div className="flex flex-col items-center justify-center gap-4 py-6">
					<Avatar className="size-36">
						<AvatarImage
							src={source ? undefined : preview || "/images/blank.png"}
							alt={name}
						/>
						{!source && <AvatarFallback>{name?.[0] ?? "?"}</AvatarFallback>}
						{source && (
							<div className="absolute inset-0 rounded-full overflow-hidden">
								<Cropper
									image={source}
									crop={crop}
									zoom={zoom}
									aspect={1}
									cropShape="round"
									showGrid={false}
									onCropChange={setCrop}
									onZoomChange={setZoom}
									onCropComplete={onCropComplete}
								/>
							</div>
						)}
					</Avatar>

					{source && (
						<div className="w-full px-4 -mt-2">
							<Input
								type="range"
								min={1}
								max={3}
								step={0.01}
								value={zoom}
								onChange={(e) => setZoom(Number(e.target.value))}
								className="w-full"
							/>
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-6">
						<div className="flex flex-col rounded-lg items-center justify-center bg-gray-100 w-[77px] h-[71px]">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => fileInputRef.current?.click()}
								title="Choose image to crop">
								<NextImage
									src="/icons/crop.svg"
									width={30}
									height={30}
									alt="crop"
								/>
							</Button>
							<p className="text-xs mt-1">Crop</p>
						</div>

						<div className="flex flex-col rounded-lg items-center justify-center bg-gray-100 w-[77px] h-[71px]">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => fileInputRef.current?.click()}
								title="Upload new">
								<NextImage
									src="/icons/upload.svg"
									width={20}
									height={20}
									alt="upload"
								/>
							</Button>
							<p className="text-xs mt-1">Upload</p>
						</div>

						<div className="flex flex-col rounded-lg items-center justify-center bg-gray-100 w-[77px] h-[71px]">
							<Button
								variant="ghost"
								size="icon"
								onClick={handleDelete}
								title="Delete">
								<NextImage
									src="/icons/delete.svg"
									width={20}
									height={20}
									alt="delete"
								/>
							</Button>
							<p className="text-xs mt-1">Delete</p>
						</div>
					</div>

					<Input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				<DialogFooter className="flex w-full gap-2">
					<Button
						variant="outline"
						className="w-1/2"
						onClick={() => setDialogOpen(false)}>
						Cancel
					</Button>
					<Button
						className="w-1/2 bg-[#E5004E] hover:bg-pink-700 text-white"
						onClick={handleDone}
						title={
							!source || !croppedAreaPixels
								? "Select & crop an image first"
								: "Save"
						}>
						Done
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}