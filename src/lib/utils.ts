import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getApiBaseUrl = () => {
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (apiBaseUrl) {
		// Remove /api suffix if present
		return apiBaseUrl.replace(/\/api$/, "");
	}
	return "http://localhost:8000"; // fallback
};

/**
 * Utility function to download a file by creating a temporary link
 */
export function handleFileDownload(fileUrl: string): void {
	const link = document.createElement("a");
	link.href = fileUrl;
	link.target = "_blank";
	link.download = "";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}