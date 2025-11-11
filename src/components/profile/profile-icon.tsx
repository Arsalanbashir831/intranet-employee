/**
 * Reusable icon component with pink mask styling
 */

import type { PinkIconProps } from "@/types/profile";

export function PinkIcon({ src, size = 18 }: PinkIconProps) {
	return (
		<span
			aria-hidden
			className="inline-block bg-[#E5004E]"
			style={{
				width: size,
				height: size,
				WebkitMaskImage: `url(${src})`,
				maskImage: `url(${src})`,
				WebkitMaskRepeat: "no-repeat",
				maskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
				maskPosition: "center",
				WebkitMaskSize: "contain",
				maskSize: "contain",
			}}
		/>
	);
}

