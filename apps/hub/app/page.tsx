"use client";

import { useAuth } from "@repo/core";
import { Button } from "@repo/ui"; 
import { HubGrid } from "../components/dashboard/HubGrid";
import styles from "./page.module.css";

export default function Home() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="animate-pulse">Connecting to Neural Link...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyber-cyan/30">
      
      {/* Navbar Placeholder (To be componentized) */}
      <nav className="border-b border-glass-border bg-glass-low backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter">Luatra<span className="text-cyber-neon">.OS</span></div>
          {user && (
             <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground hidden sm:block">Logged in as {user.email}</span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>Disconnect</Button>
             </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {user ? (
          <HubGrid />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Luatra<span className="text-cyber-neon">.Hub</span>
            </h1>
            <p className="text-muted-foreground text-center max-w-md">
              Central Intelligence Gateway. Please authenticate to access the neural network of apps.
            </p>
            <div className="mt-8">
              <Button onClick={() => signInWithGoogle()} className="px-8 py-6 text-lg shadow-cyber-neon/20 shadow-lg">
                 Initialize Session with Google
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
