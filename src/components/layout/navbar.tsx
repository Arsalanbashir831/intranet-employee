"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import UserMenu from "./user-menu";
import MobileMenu from "./mobile-menu";

export const navItems = [
    { href: ROUTES.DASHBOARD.HOME, label: "Home", icon: "/icons/home.svg" },
    { href: ROUTES.DASHBOARD.COMPANY_HUB, label: "Company Hub", icon: "/icons/building.svg" },
    { href: ROUTES.DASHBOARD.KNOWLEDGE_BASE, label: "Knowledge Base", icon: "/icons/note-blank.svg" },
    { href: ROUTES.DASHBOARD.TEAMS, label: "Teams", icon: "/icons/user-hierarchy.svg" },
    { href: ROUTES.DASHBOARD.TRAINING_CHECKLIST, label: "Training Checklist", icon: "/icons/training.svg" },
    { href: ROUTES.DASHBOARD.TASK_CHECKLIST, label: "Task Checklist", icon: "/icons/task.svg" },
];

function NavIcon({ src, className }: { src: string; className?: string }) {
    return (
        <span
            className={cn("inline-block h-4 w-4 shrink-0", className)}
            style={{
                maskImage: `url(${src})`,
                WebkitMaskImage: `url(${src})`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                backgroundColor: "currentColor",
            }}
        />
    );
}

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-primary text-white">
            <div className="mx-auto flex max-w-screen-2xl items-center gap-16 px-4 h-24 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link href={ROUTES.DASHBOARD.HOME} className="inline-flex items-center">
                        <Image src="/logo-white.svg" alt="Logo" width={150} height={46} priority />
                    </Link>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:hidden">
                    <UserMenu />
                    <MobileMenu />
                </div>

                <div className="hidden flex-1 items-center justify-between lg:flex">
                    <nav className="flex items-center">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-6">
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <Link href={item.href} legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={cn(
                                                    "px-2.5 py-1.5 text-md font-medium transition-colors rounded-[4px] inline-flex items-center flex-row gap-2",
                                                    "text-white/80 hover:text-black",
                                                    pathname === item.href && "bg-white text-black"
                                                )}
                                            >
                                                <NavIcon src={item.icon} className="text-current" />
                                                {item.label}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    <div className="flex items-center gap-3">
                        <UserMenu />
                    </div>
                </div>
            </div>
            <Separator className="bg-white/20" />
        </header>
    );
}




export default Navbar;


