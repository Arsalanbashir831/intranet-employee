/**
 * Image processing utility functions
 */

/**
 * Read a file as a data URL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Create an image element from a source URL
 */
export function createImageElement(src: string): Promise<HTMLImageElement> {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new window.Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

interface CropRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface CropResult {
	dataUrl: string;
	file: File;
}

/**
 * Crop an image to a square (circle-masked visually) and return PNG dataURL + File
 */
export async function cropToDataUrlAndFile(
	imageSrc: string,
	rect: CropRect,
	fileName = "avatar.png"
): Promise<CropResult> {
	const img = await createImageElement(imageSrc);

	// 1) Draw cropped rectangle
	const cropCanvas = document.createElement("canvas");
	cropCanvas.width = rect.width;
	cropCanvas.height = rect.height;
	const ctx = cropCanvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unsupported");
	ctx.drawImage(
		img,
		rect.x,
		rect.y,
		rect.width,
		rect.height,
		0,
		0,
		rect.width,
		rect.height
	);

	// 2) Apply circle mask
	const size = Math.min(rect.width, rect.height);
	const out = document.createElement("canvas");
	out.width = size;
	out.height = size;
	const octx = out.getContext("2d");
	if (!octx) throw new Error("Canvas unsupported");
	octx.beginPath();
	octx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
	octx.closePath();
	octx.clip();
	octx.drawImage(cropCanvas, (size - rect.width) / 2, (size - rect.height) / 2);

	const dataUrl = out.toDataURL("image/png");
	const res = await fetch(dataUrl);
	const blob = await res.blob();
	const file = new File([blob], fileName, { type: "image/png" });
	return { dataUrl, file };
}

