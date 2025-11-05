// Navbar.tsx
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
  {
    href: ROUTES.DASHBOARD.COMPANY_HUB,
    label: "Company Hub",
    icon: "/icons/building.svg",
  },
  {
    href: ROUTES.DASHBOARD.KNOWLEDGE_BASE,
    label: "Knowledge Base",
    icon: "/icons/note-blank.svg",
  },
  {
    href: ROUTES.DASHBOARD.ORG_CHAT_DIRECTORY,
    label: "People Directory",
    icon: "/icons/user-hierarchy.svg",
  },
  // {
  // 	href: ROUTES.DASHBOARD.EXECUTIVES,
  // 	label: "Executives",
  // 	icon: "/icons/users.svg",
  // },
  {
    href: ROUTES.DASHBOARD.TRAINING_CHECKLIST,
    label: "Training Checklist",
    icon: "/icons/training.svg",
  },
  // {
  // 	href: ROUTES.DASHBOARD.TASK_CHECKLIST,
  // 	label: "Task Checklist",
  // 	icon: "/icons/task.svg",
  // },
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

  // Active rule:
  // - Home only on exact match
  // - Others active on exact or any subpath (slug), e.g. /knowledge-base/*.
  const isActive = (href: string) => {
    if (!href) return false;
    const isHome = href === ROUTES.DASHBOARD.HOME;
    if (isHome) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary text-white">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-4 sm:gap-6 lg:gap-8 px-4 h-24 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.DASHBOARD.HOME}
            className="inline-flex items-center"
          >
            <Image
              src="/logo-white.svg"
              alt="Logo"
              width={120}
              height={36}
              priority
            />
          </Link>
        </div>

        {/* mobile right side */}
        <div className="ml-auto flex justify-end items-center gap-2 lg:hidden">
          <MobileMenu />
          <UserMenu />
        </div>

        {/* desktop */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <nav className="flex items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                {navItems.map((item) => {
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "px-2.5 py-1.5 text-xs font-medium transition-colors rounded-[4px] inline-flex items-center flex-row gap-2",
                            "text-white/80 hover:text-black",
                            isActive(item.href) && "bg-white text-black"
                          )}
                        >
                          {" "}
                          <NavIcon
                            src={item.icon}
                            className="text-current"
                          />{" "}
                          {item.label}{" "}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
      <Separator className="bg-white/20" />
    </header>
  );
}

export default Navbar;
