--- app/dashboard/page.tsx ---
"use client";

import { useState, useEffect } from "react";
import StatsCardEnhanced from "../../components/dashboard/StatsCardEnhanced";
import QuickActions from "../../components/dashboard/QuickActions";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import { useToast, showInfoToast } from "@/components/ui/Toast";

// Mock data réalistes
const mockStats = {
  chantiersActifs: 12,
  messagesNonLus: 7,
  equipesDisponibles: 4,
  chiffreAffaireMois: 245000,
  evolutionCA: 15.3,
  tauxRealisation: 87,
};

const mockChartData = [
  { mois: "Jan", chantiers: 8, ca: 180000 },
  { mois: "Fév", chantiers: 12, ca: 220000 },
  { mois: "Mar", chantiers: 15, ca: 195000 },
  { mois: "Avr", chantiers: 18, ca: 245000 },
  { mois: "Mai", chantiers: 16, ca: 270000 },
  { mois: "Jun", chantiers: 14, ca: 245000 },
];

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState({
    name: "Jean Dupont",
    role: "Admin",
    avatar: "JD"
  });

  const [timeOfDay, setTimeOfDay] = useState("");
  const { addToast } = useToast();
  const infoToast = showInfoToast(addToast);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Bonjour");
    else if (hour < 18) setTimeOfDay("Bon après-midi");
    else setTimeOfDay("Bonsoir");

    // Message de bienvenue avec les nouvelles fonctionnalités
    setTimeout(() => {
      infoToast(
        "Nouvelles fonctionnalités disponibles !",
        "Notifications temps réel, chat intégré et bien plus...",
        {
          label: "Découvrir",
          onClick: () => window.open("/test", "_blank")
        }
      );
    }, 2000);
  }, [infoToast]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        padding: "1rem 2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              background: "linear-gradient(135deg, #3b82f6, #f97316)",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold"
            }}>
              🏗️
            </div>
            <div>
              <h1 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #3b82f6, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0
              }}>
                ChantierPro
              </h1>
              <p style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "#64748b"
              }}>
                v2.0 - Notifications temps réel
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>
                {timeOfDay}, {currentUser.name}
              </p>
              <p style={{ margin: 0, color: "#3b82f6", fontSize: "0.75rem", fontWeight: "500" }}>
                {currentUser.role}
              </p>
            </div>
            <div style={{
              background: "#f1f5f9",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#1e293b"
            }}>
              {currentUser.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", margin: "0 0 0.5rem 0" }}>
            Dashboard
          </h2>
          <p style={{ color: "#64748b", margin: 0 }}>
            Vue d'ensemble de vos chantiers et activités du {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Stats Grid - Utilisation des nouvelles StatsCardEnhanced */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <StatsCardEnhanced
            title="Chantiers Actifs"
            value={mockStats.chantiersActifs}
            icon="🏗️"
            color="blue"
            change="+3 ce mois"
            href="/dashboard/chantiers"
          />
          <StatsCardEnhanced
            title="Messages"
            value={mockStats.messagesNonLus}
            icon="💬"
            color="orange"
            change="2 urgents"
            type="messages"
            href="/dashboard/messages"
          />
          <StatsCardEnhanced
            title="Équipes Actives"
            value={mockStats.equipesDisponibles}
            icon="👥"
            color="green"
            change="100% disponible"
            type="tasks"
            href="/dashboard/equipes"
          />
          <StatsCardEnhanced
            title="CA du Mois"
            value={`${(mockStats.chiffreAffaireMois / 1000).toFixed(0)}k€`}
            icon="💰"
            color="purple"
            change={`+${mockStats.evolutionCA}%`}
            type="alerts"
          />
        </div>

        {/* Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {/* Chart Section */}
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                Évolution des Chantiers
              </h3>
              <button
                className="btn-ghost"
                onClick={() => infoToast("Graphique", "Données simulées pour la démonstration")}
                style={{ fontSize: '0.875rem', padding: '0.5rem' }}
              >
                ℹ️ Info
              </button>
            </div>
            <div style={{ height: "200px", display: "flex", alignItems: "end", gap: "1rem", padding: "1rem 0" }}>
              {mockChartData.map((data, index) => (
                <div key={data.mois} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    height: `${(data.chantiers / 20) * 160}px`,
                    background: "linear-gradient(135deg, #3b82f6, #f97316)",
                    borderRadius: "0.25rem",
                    marginBottom: "0.5rem",
                    transition: "all 0.3s ease"
                  }} />
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{data.mois}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Debug Section */}
        <div className="card" style={{ marginTop: "2rem", background: "#fef3c7", border: "1px solid #fbbf24" }}>
          <h3 style={{ color: "#92400e", marginBottom: "1rem" }}>
            🧪 Zone de Test
          </h3>
          <p style={{ color: "#92400e", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Testez les nouvelles fonctionnalités de notifications et de messagerie.
          </p>
          <a
            href="/test"
            target="_blank"
            className="btn-primary"
            style={{ fontSize: "0.875rem" }}
          >
            🧪 Accéder aux tests
          </a>
        </div>
      </main>
    </div>
  );
}
