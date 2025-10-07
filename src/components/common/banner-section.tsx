"use client";

import { useAuth } from "@/contexts/auth-context";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function BannerSection({
	message = "Welcome Back Brian",
	onClose,
}: {
	message?: string;
	onClose?: () => void;
}) {
	const { user } = useAuth();
	const [isVisible, setIsVisible] = useState(true);

	const handleClose = () => {
		setIsVisible(false);
		onClose?.();
	};

	if (!isVisible) return null;

	return (
		<div className="w-full bg-teal-500 text-white px-4 py-2">
			{/* Full-width, always responsive container */}
			<div className="w-full flex items-center justify-center relative">
				<span className="text-sm  font-medium text-center">
					{user ? 'Welcome Back ' + user.name : message}
				</span>
				<Button
					size='icon'
					onClick={handleClose}
					className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-teal-600 rounded-full p-1 transition-colors duration-200 bg-transparent h-fit w-fit"
					aria-label="Close banner">
					<X size={20} className="border-2 border-[#FFFF] rounded-full" />
				</Button>
			</div>
		</div>
	);
}
