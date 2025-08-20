"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers le dashboard après 2 secondes pour montrer la page d'accueil
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="bg-gradient-page min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Logo animé */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl animate-pulse">
          🏗️
        </div>
        
        {/* Titre principal selon la charte */}
        <h1 className="text-h1 mb-4">
          ChantierPro
        </h1>
        
        {/* Sous-titre selon la charte */}
        <p className="text-xl text-secondary mb-2">
          Gestion intelligente de vos chantiers BTP
        </p>
        
        <p className="text-sm text-muted mb-8">
          Mode clair • Charte ChantierPro v2.0
        </p>
        
        {/* Indicateur de chargement */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <p className="text-sm text-secondary">
          Chargement du dashboard...
        </p>
        
        {/* Bouton d'accès direct (optionnel) */}
        <div className="mt-8">
          <Button 
            onClick={() => router.push("/dashboard")}
            variant="primary"
            className="animate-slide-up"
          >
            Accéder maintenant →
          </Button>
        </div>
      </div>
    </div>
  );
}