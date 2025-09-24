"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type BadgeItem = string | number | { front: string | number; back?: string | number };

interface PolicyCardProps {
  image?: string;
  title: string;
  description: string;
  link?: string;
  width?: number | string;
  height?: number | string;
  badgeLines?: BadgeItem[];
}

export default function FeatureCard({
  image,
  title,
  description,
  link = "#",
  width = 320,
  height = 450,
  badgeLines,
}: PolicyCardProps) {
  const topHeight = Math.floor((247 / 450) * Number(height));
  const bottomHeight = Number(height) - topHeight;

  // helper: safely render a BadgeItem
  const renderBadgeItem = (item: BadgeItem) => {
    if (typeof item === "string" || typeof item === "number") {
      return item;
    }
    return (
      <>
        {item.front}
        {item.back && <small className="ml-1">{item.back}</small>}
      </>
    );
  };

  return (
    <Card
      className="m-5 overflow-hidden relative"
      style={{
        width,
        height,
        display: "grid",
        gridTemplateRows: `${topHeight}px ${bottomHeight}px`,
      }}
    >
      {/* Badge (date / month / year layout) */}
      {badgeLines && badgeLines.length === 3 && (
        <div
          className="absolute top-2 left-2 bg-white/60 backdrop-blur-sm rounded-sm shadow-md flex flex-col items-center justify-center px-2"
          style={{ width: 60, height: 80 }}
        >
          {/* Date */}
          <span className="text-xl font-bold leading-tight">
            {renderBadgeItem(badgeLines[0])}
          </span>

          {/* Month */}
          <span className="text-md font-bold leading-tight">
            {renderBadgeItem(badgeLines[1])}
          </span>

          {/* Year */}
          <span className="text-md font-bold leading-tight">
            {renderBadgeItem(badgeLines[2])}
          </span>
        </div>
      )}

      {/* Top Half */}
      {image ? (
        <Image src={image} alt={title} width={320} height={274} />
      ) : (
        <div
          className="flex items-center justify-center flex-shrink-0 bg-pink-50"
          style={{ height: topHeight }}
        >
          <Image
            src="/icons/document.svg"
            alt="Default Icon"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      )}

      {/* Bottom Half */}
      <div
        className="flex flex-col px-5 flex-shrink-0"
        style={{ height: bottomHeight }}
      >
        <div className="space-y-3 overflow-hidden">
          <h1 className="text-2xl font-semibold line-clamp-2">{title}</h1>

          <p className="text-md text-gray-600 leading-snug line-clamp-3">
            {description}
          </p>
        </div>

        {link && (
          <Link
            href={link}
            className="pt-5 text-sm font-medium text-pink-600 hover:underline"
          >
            Read More
          </Link>
        )}
      </div>
    </Card>
  );
}
