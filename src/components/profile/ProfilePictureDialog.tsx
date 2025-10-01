"use client";

import { useState } from "react";
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
import Image from "next/image";

export function ProfilePictureDialog({
	image,
	name,
}: {
	image: string;
	name: string;
}) {
	const [preview] = useState(image);

	return (
		<Dialog>
			{/* Trigger Button */}
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="secondary"
					className="absolute bottom-0 right-0 rounded-full bg-white shadow-md">
					<Image src="/icons/edit.svg" width={19} height={18} alt="edit" />
				</Button>
			</DialogTrigger>

			{/* Dialog Content */}
			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-row items-center gap-2">
					<Image
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
						<AvatarImage src={preview} alt={name} />
						<AvatarFallback>{name[0]}</AvatarFallback>
					</Avatar>
					<p className="text-sm text-muted-foreground">Drag to reposition</p>

					{/* Actions */}
					<div className="flex gap-6">
						<div className="flex flex-col rounded-lg items-center justify-center bg-gray-100 w-[77px] h-[71px]">
							<Button variant="ghost" size="icon">
								<Image
									src="/icons/crop.svg"
									width={30}
									height={30}
									alt="crop"
								/>
							</Button>
							<p className="text-xs mt-1">Crop</p>
						</div>
						<div className="flex flex-col rounded-lg items-center justify-center bg-gray-100 w-[77px] h-[71px]">
							<Button variant="ghost" size="icon">
								<Image
									src="/icons/upload.svg"
									width={20}
									height={20}
									alt="upload"
								/>
							</Button>
							<p className="text-xs mt-1">Upload</p>
						</div>
						<div className="flex flex-col rounded-lg items-center justify-center bg-gray-100 w-[77px] h-[71px]">
							<Button variant="ghost" size="icon">
								<Image
									src="/icons/delete.svg"
									width={20}
									height={20}
									alt="delete"
								/>
							</Button>
							<p className="text-xs mt-1">Delete</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<DialogFooter className="flex w-full gap-2">
					<Button variant="outline" className="w-1/2">
						Cancel
					</Button>
					<Button className="w-1/2 bg-[#E5004E] hover:bg-pink-700 text-white">
						Done
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
