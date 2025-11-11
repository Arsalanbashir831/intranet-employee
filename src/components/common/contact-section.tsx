"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {
  const socialLinks = [
    {
      id: 1,
      name: "Facebook",
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
      icon: "/logos/facebook.svg",
    },
    {
      id: 2,
      name: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
      icon: "/logos/instagram.svg",
    },
    {
      id: 3,
      name: "LinkedIn",
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
      icon: "/logos/linkedin-blue.svg",
    },
    {
      id: 4,
      name: "X",
      href: process.env.NEXT_PUBLIC_X_URL || "#",
      icon: "/logos/twitter.svg",
    },
    {
      id: 5,
      name: "Website",
      href: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "#",
      icon: "/logos/website.svg",
    },
  ];

  return (
    <Card className="w-full max-w-[390px] rounded-lg shadow-sm bg-[#F9FEFF] gap-0 p-3 sm:p-4">
      <CardContent className="p-0 flex flex-col items-center gap-3 sm:gap-4">
        {/* Heading */}
        <h2 className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">
          Connect With Us
        </h2>

        {/* Social Icons in one row */}
        <div
          className="
            flex items-center justify-center
            gap-4
            overflow-x-auto
          "
        >
          {socialLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                shrink-0 snap-start
                size-12 sm:size-12 flex items-center justify-center
                w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                rounded-full hover:opacity-80 transition
              "
            >
              <Image
                src={link.icon}
                alt={`${link.name} icon`}
                width={32}
                height={32}
                className="(max-width: 768px) 48px"
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
