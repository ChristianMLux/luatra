"use client";

import Image from "next/image";
import { useAuth } from "@repo/core";
import { Button } from "@repo/ui"; 
import styles from "./page.module.css";

export default function Home() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Luatra Hub</h1>
          {user ? (
            <div style={{ marginTop: '2rem' }}>
              <p>Logged in as: <strong>{user.email}</strong></p>
              <p>UID: {user.uid}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '2rem' }}>
              <p>Please log in to access the dashboard.</p>
              <Button onClick={() => signInWithGoogle()}>Login with Google</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
