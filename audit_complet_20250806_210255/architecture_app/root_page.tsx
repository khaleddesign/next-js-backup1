"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers le dashboard
    router.push("/dashboard");
  }, [router]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #ea580c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ 
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'spin 2s linear infinite' 
        }}>
          🏗️
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ChantierPro</h1>
        <p>Chargement du dashboard...</p>
      </div>
    </div>
  );
}
