"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navItems } from "./navbar";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="secondary" className="text-primary !bg-white">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
                <div className="bg-primary px-4 py-4 text-white">
                    <Image src="/logo-white.svg" alt="Logo" width={118} height={46} />
                </div>
                <nav className="px-2 py-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                pathname === item.href
                                    ? "flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-primary text-white"
                                    : "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                            }
                        >
                            <span
                                className="inline-block h-4 w-4"
                                style={{
                                    maskImage: `url(${item.icon})`,
                                    WebkitMaskImage: `url(${item.icon})`,
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                    backgroundColor: "currentColor",
                                }}
                            />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}