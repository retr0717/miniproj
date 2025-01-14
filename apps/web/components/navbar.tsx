"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Trophy, User } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/prompt");
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // Set `redirect: false` to prevent automatic redirection
      router.push("/auth/login"); // Redirect manually to the login page
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-2xl">
          Webly
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {session.user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
