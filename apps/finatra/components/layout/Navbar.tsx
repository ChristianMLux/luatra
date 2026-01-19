"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, ThemeToggle } from "@repo/ui";
import { LayoutDashboard, Wallet, Wrench, Settings, ArrowLeft } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="http://localhost:3000/">
               <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
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
               <Link href="/expenses">
                  <Button variant={isActive("/expenses") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <Wallet className="w-4 h-4" /> Expenses
                  </Button>
               </Link>
               <Link href="/tools">
                  <Button variant={isActive("/tools") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <Wrench className="w-4 h-4" /> Tools
                  </Button>
               </Link>
               <Link href="/settings">
                  <Button variant={isActive("/settings") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <Settings className="w-4 h-4" /> Settings
                  </Button>
               </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <ThemeToggle size="sm" />
          </div>
        </div>
      </div>
    </nav>
  );
}
