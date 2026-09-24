"use client";

import { useState, type ReactNode } from "react";
import { useAuth } from "@repo/core";
import { Button, Card } from "@repo/ui";
import { Clock } from "lucide-react";

/**
 * Chronatra learns who you are from the Hub's shared cookie, but Firestore only
 * accepts requests from an app that is itself signed in to Firebase Auth. This
 * gate asks for that sign-in once; Firebase keeps it for this app afterwards.
 * Children (and their Firestore queries) only mount once the session exists.
 */
export function FirebaseSessionGate({ children }: { children: ReactNode }) {
  const { user, hasFirebaseSession, firebaseResolved, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  // Nobody logged in at all: let the pages show their own logged-out state.
  if (!user) return <>{children}</>;
  if (hasFirebaseSession) return <>{children}</>;
  // Firebase restores a stored session within a moment; avoid flashing the prompt.
  if (!firebaseResolved) return null;

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-8 flex flex-col gap-4 text-center">
        <Clock className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden="true" />
        <h1 className="text-xl font-semibold">Connect Chronatra to your account</h1>
        <p className="text-sm text-muted-foreground">
          You are signed in via the Hub as {user.email ?? "your account"}. To read and save your
          time entries, Chronatra needs its own sign-in once. After that it stays signed in.
        </p>
        <Button onClick={handleSignIn} disabled={signingIn} className="h-11">
          {signingIn ? "Signing in..." : "Sign in with Google"}
        </Button>
      </Card>
    </main>
  );
}
