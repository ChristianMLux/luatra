"use client";

import Image from "next/image";
import { useAuth } from "@repo/core";
import styles from "./page.module.css";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Luatra Joatra</h1>
          <p>Journaling Agent App</p>
          
          {user ? (
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
               <h3 style={{ color: 'green' }}>Authenticated via SSO</h3>
               <p>User: <strong>{user.email}</strong></p>
               <p>UID: {user.uid}</p>
            </div>
          ) : (
             <div style={{ marginTop: '2rem', color: 'red' }}>
               <p>Not Authenticated. Please login via Hub.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
