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

          const res = await fetch(`${API_URL}/users/me`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          
          if (res.ok) {
              const data = await res.json();
              setUserData(data);
          }
      } catch (e) {
          console.error("Failed to fetch user profile", e);
      }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      console.log("Auth: State changed", firebaseUser ? firebaseUser.uid : "No Firebase user");
      
      if (firebaseUser) {
        // 1. Firebase is Active
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        
        try {
            const t = await firebaseUser.getIdToken();
            setToken(t);
            // Sync to Cookie for other apps on localhost
            Cookies.set("site-auth", t, { domain: 'localhost', expires: 1 }); // 1 day
            await fetchUserProfile(t);
        } catch (err) {
            console.error("Auth: Error getting token", err);
        }
      } else {
        // 2. Firebase is inactive, check Cookie (Shared Auth)
        const cookieToken = Cookies.get("site-auth");
        if (cookieToken) {
           console.log("Auth: Found cookie token, attempting hydrate...");
           try {
             // Decode JWT to get basic user info without needing Firebase SDK to be hydrated (which requires re-login)
             const decoded: any = jwtDecode(cookieToken);
             // Basic check if expired
             if (decoded.exp * 1000 > Date.now()) {
                setUser({
                    uid: decoded.user_id || decoded.sub,
                    email: decoded.email,
                    displayName: decoded.name,
                    photoURL: decoded.picture
                });
                setToken(cookieToken);
                // We don't fetch full profile here to avoid complexity, but we could
             } else {
                console.log("Auth: Cookie token expired");
                setToken(null);
                setUser(null);
                Cookies.remove("site-auth", { domain: 'localhost' });
             }
           } catch(e) {
             console.error("Auth: Invalid cookie token", e);
             setToken(null);
             setUser(null);
           }
        } else {
          setToken(null);
          setUser(null);
          setUserData(null);
        }
      }
      setLoading(false);
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
      Cookies.remove("site-auth", { domain: 'localhost' });
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
