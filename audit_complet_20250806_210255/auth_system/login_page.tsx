"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="gradient-bg flex items-center justify-center" style={{ padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px'}}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #3b82f6, #f97316)',
            borderRadius: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>🏗️</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ChantierPro
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Gestion de chantier ultra-moderne
          </p>
        </div>

        {/* Login Card */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Connexion
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Accédez à votre espace de gestion
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
              Se connecter
            </button>

            <div className="grid grid-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
              >
                Commercial
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
              >
                Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
