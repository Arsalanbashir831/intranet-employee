"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	// DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useLogout } from "@/hooks/queries/use-auth";

export default function UserMenu() {
	const { mutate: logout } = useLogout();

	const handleLogout = () => {
		logout();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger id="dropdown-trigger-user-menu" asChild>
				<Button
					variant="ghost"
					className="h-9 gap-2 px-2 text-white hover:bg-transparent hover:text-white">
					<Avatar className="h-8 w-8">
						<AvatarImage src="/images/avatar.jpg" alt="User" />
						<AvatarFallback className="text-black">BK</AvatarFallback>
					</Avatar>
					<span className="hidden sm:inline-block text-sm">Brian F.</span>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem asChild>
					<Link href={ROUTES.DASHBOARD.PROFILE}>
						<User className="h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				{/* <DropdownMenuSeparator /> */}
				<DropdownMenuItem className="text-red-500" onClick={handleLogout}>
					<LogOut className="h-4 w-4 text-red-500" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}