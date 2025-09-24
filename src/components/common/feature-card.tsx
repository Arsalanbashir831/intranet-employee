"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type BadgeItem =
  | string
  | number
  | { front: string | number; back?: string | number };
// 👆 allows either a simple line or "front/back" stacked together

interface PolicyCardProps {
  image?: string;
  title: string;
  description: string;
  link?: string;
  width?: number | string;
  height?: number | string;
  badgeLines?: BadgeItem[];
}

export default function PolicyCard({
  image,
  title,
  description,
  link = "#",
  width = 320,
  height = 450,
  badgeLines,
}: PolicyCardProps) {
  // split heights proportionally (default 247 / 203)
  const topHeight = Math.floor((247 / 450) * Number(height));
  const bottomHeight = Number(height) - topHeight;

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
      {/* Badge (multi-line w/ front/back support) */}
      {badgeLines && badgeLines.length > 0 && (
        <div
          className="absolute top-2 left-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-md flex flex-col items-center justify-center"
          style={{ width: 52, height: 102 }}
        >
            {badgeLines?.map((line, idx) => {
              if (typeof line === "object") {
                if (line.front === "V" && line.back === "202") {
                  // Special case: V centered on zero
                  return (
                    <div
                      key={idx}
                      className="relative flex items-center justify-center"
                      style={{
                        width: 26,
                        height: 88,
                        fontSize: 22,
                        lineHeight: "100%",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      <span className="text-gray-500">{line.back}</span>
                      <span
                        className="absolute font-bold"
                        style={{ left: "50%", transform: "translateX(-50%)" }}
                      >
                        {line.front}
                      </span>
                    </div>
                  );
                }

                // General case (front overlays back)
                return (
                  <div
                    key={idx}
                    className="relative flex items-center justify-center"
                    style={{
                      width: 26,
                      height: 88,
                      fontSize: 22,
                      lineHeight: "100%",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-gray-500">
                      {line.back}
                    </span>
                    <span className="relative z-10 font-bold">{line.front}</span>
                  </div>
                );
              }

              // Pure string case
              return (
                <span
                  key={idx}
                  style={{
                    width: 26,
                    height: 88,
                    fontSize: 22,
                    lineHeight: "100%",
                    letterSpacing: "-0.03em",
                  }}
                  className="flex items-center justify-center font-bold"
                >
                  {line}
                </span>
              );
            })}
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
