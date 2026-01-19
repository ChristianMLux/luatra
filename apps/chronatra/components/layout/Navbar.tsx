"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, ThemeToggle } from "@repo/ui";
import { ArrowLeft, Clock, FolderKanban, FileBarChart, Focus } from "lucide-react";

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
                     <Clock className="w-4 h-4" /> Timer
                  </Button>
               </Link>
               <Link href="/projects">
                  <Button variant={isActive("/projects") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <FolderKanban className="w-4 h-4" /> Projects
                  </Button>
               </Link>
               <Link href="/reports">
                  <Button variant={isActive("/reports") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <FileBarChart className="w-4 h-4" /> Reports
                  </Button>
               </Link>
               <Link href="/focus">
                  <Button variant={isActive("/focus") ? "secondary" : "ghost"} size="sm" className="gap-2">
                     <Focus className="w-4 h-4" /> Focus Mode
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
