"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function BannerSection({
	message = "Welcome Back Brian",
	onClose,
}: {
	message?: string;
	onClose?: () => void;
}) {
	const [isVisible, setIsVisible] = useState(true);

	const handleClose = () => {
		setIsVisible(false);
		onClose?.();
	};

	if (!isVisible) return null;

	return (
		<div className="w-full bg-teal-500 text-white px-4 py-3 sm:py-4 md:py-5 lg:py-6">
			{/* Full-width, always responsive container */}
			<div className="w-full flex items-center justify-center relative">
				<span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center">
					{message}
				</span>
				<button
					onClick={handleClose}
					className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-teal-600 rounded-full p-1 transition-colors duration-200"
					aria-label="Close banner">
					<X size={20} className="border-2 border-[#FFFF] rounded-full" />
				</button>
			</div>
		</div>
	);
}
