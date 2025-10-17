import { ArrowRight } from "lucide-react"
import Link from "next/link"
import FeatureCard from "../common/feature-card"
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useLatestAnnouncements } from "@/hooks/queries/use-announcements";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";

// Define the card type
type AnnouncementCard = {
  id: string;
  image: string;
  title: string;
  description: string;
  badgeLines: [string, string, string];
};

export const LatestAnnouncements = () => {
    const { user } = useAuth();
    const { data, isLoading, isError } = useLatestAnnouncements(user?.employeeId || 0, 5);
    const [cards, setCards] = useState<AnnouncementCard[]>([]);

    useEffect(() => {
        if (data?.announcements?.results) {
            const transformedCards = data.announcements.results.map(announcement => ({
                id: announcement.id.toString(),
                image: announcement.attachments.length > 0
                    ? announcement.attachments[0].file_url
                    : "/logos/profile-circle.svg",
                title: announcement.title,
                description: announcement.body.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
                badgeLines: [
                    new Date(announcement.created_at).getDate().toString(),
                    new Date(announcement.created_at).toLocaleString('default', { month: 'short' }),
                    new Date(announcement.created_at).getFullYear().toString()
                ] as [string, string, string],
            }));
            setCards(transformedCards);
        }
    }, [data]);

    // Show loading state
    if (isLoading) {
        return (
            <section className="bg-white rounded-2xl overflow-hidden p-[calc(var(--gap)*1.25)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[var(--gap)]">
                    <h2 className="font-semibold leading-tight text-2xl sm:text-xl md:text-2xl">
                        Latest Announcements
                    </h2>
                    <Link
                        href={ROUTES.DASHBOARD.COMPANY_HUB + "/?tab=announcements"}
                        className="flex items-center underline font-medium text-[#E5004E] text-sm sm:text-base md:text-md">
                        View More
                        <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-5" />
                    </Link>
                </div>
                <div className="mt-[var(--gap)] flex justify-center">
                    <div>Loading announcements...</div>
                </div>
            </section>
        );
    }

    // Show error state
    if (isError) {
        return (
            <section className="bg-white rounded-2xl overflow-hidden p-[calc(var(--gap)*1.25)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[var(--gap)]">
                    <h2 className="font-semibold leading-tight text-2xl sm:text-xl md:text-2xl">
                        Latest Announcements
                    </h2>
                    <Link
                        href={ROUTES.DASHBOARD.COMPANY_HUB + "/?tab=announcements"}
                        className="flex items-center underline font-medium text-[#E5004E] text-sm sm:text-base md:text-md">
                        View More
                        <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-5" />
                    </Link>
                </div>
                <div className="mt-[var(--gap)] flex justify-center">
                    <div>Error loading announcements</div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-2xl overflow-hidden p-[calc(var(--gap)*1.25)]">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[var(--gap)]">
                <h2 className="font-semibold leading-tight text-2xl sm:text-xl md:text-2xl">
                    Latest Announcements
                </h2>
                <Link
                    href={ROUTES.DASHBOARD.COMPANY_HUB + "/?tab=announcements"}
                    className="flex items-center underline font-medium text-[#E5004E] text-sm sm:text-base md:text-md">
                    View More
                    <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-5" />
                </Link>
            </div>


            <div className="mt-[var(--gap)] grid grid-cols-1 md:grid-cols-2 gap-[var(--gap)] lg:hidden">
                {cards.map((c, i) => (
                    <FeatureCard
                        key={`m-${i}`}
                        image={c.image}
                        title={c.title}
                        link={`/company-hub/${c.id}`}
                        description={c.description}
                        badgeLines={c.badgeLines}
                        className="w-full"
                    />
                ))}
            </div>

            <div className="mt-[var(--gap)] hidden lg:block">
                <ScrollArea className="w-full">
                    <div className="flex gap-[var(--gap)] py-1 snap-x snap-mandatory pr-[calc(var(--gap)*1.25)]">
                        {cards.map((c, i) => (
                            <div
                                key={`d-${i}`}
                                className="flex-shrink-0 snap-start w-[360px] xl:w-[380px]">
                                <FeatureCard
                                    image={c.image}
                                    title={c.title}
                                    link={`/company-hub/${c.id}`}
                                    description={c.description}
                                    badgeLines={c.badgeLines}
                                    className="w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="mt-[var(--gap)]" />
                </ScrollArea>
            </div>
        </section>
    )
}