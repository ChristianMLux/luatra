"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, ThemeToggle } from "@repo/ui";
import { ArrowLeft, LayoutDashboard, FileText, Sparkles, User } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="http://localhost:3000/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Hub
              </Button>
            </Link>
            
            <div className="hidden md:flex gap-1">
               <Link href="/">
                  <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
               </Link>
               <Link href="/cv-generator">
                  <Button variant={isActive("/cv-generator") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <FileText className="w-4 h-4" /> CV Generator
                  </Button>
               </Link>
               <Link href="/cover-letter">
                  <Button variant={isActive("/cover-letter") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <Sparkles className="w-4 h-4" /> Cover Letter
                  </Button>
               </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <Link href="/profile">
                  <Button variant={isActive("/profile") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <User className="w-4 h-4" /> Profile
                  </Button>
             </Link>
             <ThemeToggle size="sm" />
          </div>
        </div>
      </div>
    </nav>
  );
}
