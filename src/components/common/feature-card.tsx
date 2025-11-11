"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { FeatureCardProps, BadgeItem } from "@/types/feature-card";

export default function FeatureCard({
  image,
  title,
  description,
  link = "#",
  badgeLines,
  className,
  imgClassName,
}: FeatureCardProps) {
  // Responsive aspect ratio for image area
  const renderBadgeItem = (item: BadgeItem) => {
    if (typeof item === "string" || typeof item === "number") return item;
    return (
      <>
        {item.front}
        {item.back && <small className="ml-1">{item.back}</small>}
      </>
    );
  };

  return (
    <Card
      className={[
        "overflow-hidden relative grid grid-rows-[auto_1fr] min-h-0 min-w-0",
        // Responsive min/max heights for card
        "h-full w-full",
        className || "",
        "min-h-[340px] md:min-h-[380px] lg:min-h-[440px]",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{}}
    >
      {/* Badge */}
      {badgeLines && badgeLines.length === 3 && (
        <div className="absolute top-2 left-2 bg-white/60 backdrop-blur-sm rounded-sm shadow-md flex flex-col items-center justify-center px-2 w-14 h-20 min-[1920px]:w-16 min-[1920px]:h-24 min-[2560px]:w-20 min-[2560px]:h-28 z-10">
          <span className="text-xl min-[1920px]:text-2xl font-bold leading-tight">
            {renderBadgeItem(badgeLines[0])}
          </span>
          <span className="text-md min-[1920px]:text-lg font-bold leading-tight">
            {renderBadgeItem(badgeLines[1])}
          </span>
          <span className="text-md min-[1920px]:text-lg font-bold leading-tight">
            {renderBadgeItem(badgeLines[2])}
          </span>
        </div>
      )}

      {/* Top (Image area) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[3/2] lg:aspect-[5/4] xl:aspect-[7/5]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width:2560px) 20vw, (min-width:1920px) 25vw, (min-width:1024px) 30vw, 100vw"
            className={["object-cover bg-[#373332]", imgClassName || ""]
              .filter(Boolean)
              .join(" ")}
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-pink-50">
            <Image
              src="/icons/document.svg"
              alt="Default Icon"
              fill
              className={["object-contain", imgClassName || ""]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
        )}
      </div>

      {/* Bottom (Content) */}
      <div className="flex flex-col px-5 py-4 overflow-hidden min-h-0">
        <div className="space-y-3 overflow-hidden">
          <h1 className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl line-clamp-2 text-[clamp(1rem,1vw+0.75rem,2rem)]">
            {title}
          </h1>

          <p className="text-gray-600 text-md sm:text-sm md:text-md leading-snug line-clamp-3 text-[clamp(0.9rem,0.7vw+0.6rem,1.3rem)]">
            {description}
          </p>
        </div>

        {link && (
          <Link
            href={link}
            className="mt-auto underline font-medium text-[#E5004E] hover:text-pink-300 text-[clamp(0.9rem,0.6vw+0.6rem,1rem)] min-[1920px]:text-[1.1rem]"
          >
            Read More
          </Link>
        )}
      </div>
    </Card>
  );
}
