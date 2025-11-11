"use client";

import React from "react";
import Image from "next/image";
import type { AnnouncementDetailCardProps } from "@/types/announcements";

export default function AnnouncementDetailCard({
  announcement,
}: AnnouncementDetailCardProps) {
  // Use the first attachment as the hero image, or a default image
  const heroImage =
    announcement.attachments.length > 0
      ? announcement.attachments[0].file_url
      : "/images/office-work.png";

  // Check if the image is an external URL
  const isExternalImage = heroImage.startsWith("http://") || heroImage.startsWith("https://");

  // Format the date
  const formattedDate = new Date(announcement.created_at).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-5">
        <div
          className="
            w-full relative overflow-hidden rounded-md mb-6
            h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]
            min-[1920px]:h-[600px] min-[2560px]:h-[700px] min-[3840px]:h-[800px]
          "
        >
          <Image
            src={heroImage}
            alt={announcement.title}
            fill
            priority={false}
            loading="lazy"
            className="object-cover"
            unoptimized={isExternalImage}
          />
        </div>

        {/* Meta Row */}
        <div className="border-t border-b border-[#CDD0D5]">
          <div className="flex items-center py-3 gap-3">
            {/* Logo */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <Image
                src="/images/logo-circle.png"
                alt="Company Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>

            <div>
              <h2
                className="
                  font-extrabold
                  text-sm sm:text-base md:text-lg lg:text-xl
                  min-[1920px]:text-2xl text-[#202124]
                "
              >
                CARTWRIGHT KING
              </h2>
              <div
                className="
                  flex items-center gap-1
                  text-xs sm:text-sm md:text-base font-extralight text-[#202124]
                "
              >
                <Image
                  src="/icons/date-calendar.svg"
                  width={20}
                  height={20}
                  alt="Date"
                />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badge */}
        {/* <div className="border-b border-[#CDD0D5] py-3">
					<Badge
						className="
              bg-neutral font-extralight text-[#000000]
              text-xs sm:text-sm md:text-base
            ">
						{hashTags}
					</Badge>
				</div> */}

        {/* Title */}
        <div className="border-b border-[#CDD0D5] py-6 mb-6">
          <h1
            className="
              font-medium text-[#202124]
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              min-[1920px]:text-6xl min-[2560px]:text-7xl
            "
          >
            {announcement.title}
          </h1>
        </div>

        {/* Content */}
        <div
          className="
            text-[#202124] leading-relaxed space-y-4
            text-sm sm:text-base md:text-lg font-extralight
            [&_p]:leading-relaxed [&_p]:mb-4
            [&_p_strong]:font-semibold [&_p_strong]:text-base [&_p_strong]:sm:text-lg [&_p_strong]:md:text-xl
            [&_p:only-child_strong]:block [&_p:only-child_strong]:mb-2
            [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:space-y-2 [&_ol]:ml-4 [&_ol]:sm:ml-6 [&_ol]:md:ml-8 [&_ol]:mb-4 [&_ol]:mt-2
            [&_ol.list-decimal]:list-decimal [&_ol.list-inside]:list-outside [&_ol.list-inside]:pl-4
            [&_ol_li]:mb-3 [&_ol_li]:pl-2 [&_ol_li]:list-item [&_ol_li]:min-h-[1.5rem]
            [&_ol_li_p]:mb-0 [&_ol_li_p]:inline-block
            [&_ol_li_p_strong]:font-semibold
            [&_ol_li.list-item]:list-item
            [&_ul]:list-disc [&_ul]:list-outside [&_ul]:space-y-2 [&_ul]:ml-4 [&_ul]:sm:ml-6 [&_ul]:md:ml-8 [&_ul]:mb-4 [&_ul]:mt-2
            [&_ul.list-disc]:list-disc [&_ul.list-inside]:list-outside [&_ul.list-inside]:pl-4
            [&_ul_li]:mb-2 [&_ul_li]:pl-2 [&_ul_li]:list-item [&_ul_li]:min-h-[1.5rem]
            [&_ul_li_p]:mb-0
            [&_ul_li.list-item]:list-item
            [&_ol_li_ul]:list-disc [&_ol_li_ul]:list-outside [&_ol_li_ul]:ml-6 [&_ol_li_ul]:sm:ml-8 [&_ol_li_ul]:md:ml-10 [&_ol_li_ul]:mt-2 [&_ol_li_ul]:mb-2
            [&_ol_li_ul_li]:mb-1 [&_ol_li_ul_li]:pl-2
            [&_ol_li_ul_li_p]:mb-0
          "
          dangerouslySetInnerHTML={{ __html: announcement.body }}
        />
      </div>
    </div>
  );
}
