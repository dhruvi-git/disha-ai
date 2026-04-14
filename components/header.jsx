import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Bot, // Added Bot icon import here!
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();

  return (
    <header className="fixed top-0 w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-slate-950/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Updated Logo and App Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={"/favicon.ico"}
            alt="Disha AI Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-xl text-white">Disha AI</span>
        </Link>

        {/* Action Buttons & Navigation Menu */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Button
              asChild
              variant="outline"
              className="hidden md:inline-flex items-center gap-2 border-white/10 hover:bg-white/5 text-white"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Link>
            </Button>
            <Button asChild variant="ghost" className="md:hidden w-10 h-10 p-0 text-white hover:bg-white/5">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </Button>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 border-white/10 hover:bg-white/5 text-white" variant="outline">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-950 border-white/10 text-white">
                <DropdownMenuItem asChild className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer">
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer">
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer">
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer">
                  <Link href="/chat" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                      Chat with Disha
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl border border-white/10 bg-slate-950",
                  userPreviewMainIdentifier: "font-semibold text-white",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}