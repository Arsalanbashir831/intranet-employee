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
import { useAuth } from "@/contexts/auth-context";

export default function UserMenu() {
	const { user } = useAuth();
	const { mutate: logout } = useLogout();

	const handleLogout = () => {
		logout();
	};

	console.log(user);

	// Get user's initials for avatar fallback
	const getUserInitials = () => {
		if (!user) return "U";
		return user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger id="dropdown-trigger-user-menu" asChild>
				<Button
					variant="ghost"
					className="h-9 gap-2 px-2 text-white hover:bg-transparent hover:text-white">
					<Avatar className="h-8 w-8">
						<AvatarImage 
							src={user?.profilePicture || "/images/avatar.jpg"} 
							alt={user?.name || "User"} 
						/>
						<AvatarFallback className="text-black">
							{getUserInitials()}
						</AvatarFallback>
					</Avatar>
					<span className="hidden sm:inline-block text-sm">
						{user?.name || "User"}
					</span>
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