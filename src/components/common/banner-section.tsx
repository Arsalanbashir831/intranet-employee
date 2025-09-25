'use client';

import { X } from "lucide-react";
import { useState } from "react";

export default function BannerSection({
  message = "Welcome Back Briann",
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
    <div
      className="bg-teal-500 text-white flex items-center justify-center relative px-4"
      style={{ width: "1440px", height: "48px" }}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-teal-600 rounded-full p-1 transition-colors duration-200"
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
