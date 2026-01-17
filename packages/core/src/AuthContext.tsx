"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onIdTokenChanged 
} from "firebase/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

// Use env var or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Custom User Type that supports both Firebase User and Decoded Cookie User
export interface SharedUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: SharedUser | null;
  userData: Record<string, unknown> | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  token: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SharedUser | null>(null);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (token: string) => {
      try {
          if (!API_URL) return;

          // Add timeout to prevent hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const res = await fetch(`${API_URL}/users/me`, {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (res.ok) {
              const data = await res.json();
              setUserData(data);
          }
      } catch (e) {
          console.error("Failed to fetch user profile", e);
      }
  };

  useEffect(() => {
    // FAST PATH: Check cookie first for instant hydration when navigating between apps
    // This runs synchronously before Firebase auth initializes
    const cookieToken = Cookies.get("site-auth");
    if (cookieToken) {
      try {
        const decoded = jwtDecode<SharedUser & { exp: number; user_id?: string; sub?: string; name?: string; picture?: string }>(cookieToken);
        // Check if token is still valid
        // Check if token is still valid
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            uid: decoded.user_id || decoded.sub || "",
            email: decoded.email,
            displayName: decoded.name,
            photoURL: decoded.picture
          });
          setToken(cookieToken);
          setLoading(false); // Unblock UI immediately!
        }
      } catch (e) {
        // Invalid cookie, will fall through to Firebase
      }
    }

    // NORMAL PATH: Firebase listener for full auth sync
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase is active - update with fresh data
        const newUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };
        
        setUser(prev => {
           if (prev && prev.uid === newUser.uid && prev.email === newUser.email) return prev;
           return newUser;
        });
        
        try {
            const t = await firebaseUser.getIdToken();
            setToken(t);
            // Sync to Cookie for other apps on localhost
            // Sync to Cookie for other apps on localhost - strict sameSite for security
            Cookies.set("site-auth", t, { expires: 1, sameSite: 'strict' });
            setLoading(false);
            
            // Fetch profile in background
            fetchUserProfile(t).catch(e => console.error("Background profile fetch failed", e));
        } catch (err) {
            console.error("Auth: Error getting token", err);
            setLoading(false);
        }
      } else {
        // Firebase says no user - check if we have cookie fallback (already handled above)
        // If we get here and loading is still true, there's no valid session
        if (!Cookies.get("site-auth")) {
          setToken(null);
          setUser(null);
          setUserData(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
      if (token) {
          await fetchUserProfile(token);
      }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/"); 
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      Cookies.remove("site-auth");
      setToken(null);
      setUserData(null);
      setUser(null);
      router.push("/login?state=signed_out"); 
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, token, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
