"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/queries/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { mutate: login, isPending } = useLogin();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login(
			{ username: email, password },
			{
				onError: (error) => {
					console.error(error);
					toast.error(error instanceof AxiosError ? error?.response?.data?.detail : "Login failed. Please try again.");
				}
			}
		);
	};

	return (
		<div className="flex-1 flex items-center justify-center px-6 sm:px-8">
			<div className="w-full max-w-md lg:w-[400px] lg:h-[428px]">
				<h1 className="text-4xl sm:text-5xl font-semibold text-center text-gray-900 mb-8">
					Login
				</h1>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm text-gray-600 mb-2">
							Company Email *
						</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 text-gray-900 bg-gray-50"
							placeholder="hello@uwiki.co"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="text-sm text-gray-600 mb-2">
							Password
						</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="Password"
								className="h-12 pr-10 border-gray-200 focus:border-pink-500 focus:ring-pink-500 bg-gray-50"
							/>
							<Button
								variant="ghost"
								type="button"
								className="absolute top-1/2 right-1 -translate-y-1/2 p-0 h-auto"
								onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? (
									<EyeOff className="h-5 w-5 text-gray-400" />
								) : (
									<Eye className="h-5 w-5 text-gray-400" />
								)}
							</Button>
						</div>
					</div>

					<div className="text-right mt-3 mb-5">
						<Link href="/forgot-password">
							<Button
								variant="link"
								className="text-sm text-teal-500 hover:underline"
								type="button">
								Forgot password ?
							</Button>
						</Link>
					</div>

					<Button 
						type="submit" 
						disabled={isPending}
						className="w-full h-12 bg-[#E5004E] hover:bg-pink-400 text-white rounded-full font-medium text-base">
						{isPending ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</div>
		</div>
	);
}