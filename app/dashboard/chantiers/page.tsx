"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ChantierCard from "../../../components/chantiers/ChantierCard";
import SearchFilter from "../../../components/chantiers/SearchFilter";

interface Chantier {
  id: string;
  nom: string;
  description: string;
  adresse: string;
  statut: string;
  progression: number;
  dateDebut: string;
  dateFin: string;
  budget: number;
  photo?: string;
  client: {
    name: string;
    company?: string | undefined;
  };
  _count: {
    messages: number;
    comments: number;
  };
}

export default function ChantiersPage() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const mockChantiers: Chantier[] = [
    {
      id: "1",
      nom: "Rénovation Villa Moderne",
      description: "Rénovation complète d'une villa de 200m² avec extension moderne et piscine",
      adresse: "15 Avenue des Pins, 06400 Cannes",
      statut: "EN_COURS",
      progression: 65,
      dateDebut: "2024-03-15",
      dateFin: "2024-08-30",
      budget: 120000,
      photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      client: { name: "Marie Dubois", company: "Dubois Immobilier" },
      _count: { messages: 23, comments: 12 }
    },
    {
      id: "2",
      nom: "Construction Maison Écologique",
      description: "Construction d'une maison BBC avec matériaux biosourcés et panneaux solaires",
      adresse: "Lot 12 Les Jardins Verts, 34000 Montpellier",
      statut: "PLANIFIE",
      progression: 0,
      dateDebut: "2024-05-01",
      dateFin: "2024-12-15",
      budget: 280000,
      photo: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
      client: { name: "Pierre Martin", company: undefined },
      _count: { messages: 5, comments: 2 }
    },
    {
      id: "3",
      nom: "Réhabilitation Loft Industriel",
      description: "Transformation d'un ancien entrepôt en loft moderne avec mezzanine",
      adresse: "42 Rue de l'Industrie, 69007 Lyon",
      statut: "EN_COURS",
      progression: 35,
      dateDebut: "2024-02-01",
      dateFin: "2024-07-20",
      budget: 95000,
      photo: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop",
      client: { name: "Sophie Leroux", company: "Design Studio" },
      _count: { messages: 18, comments: 8 }
    },
    {
      id: "4",
      nom: "Extension Maison Familiale",
      description: "Extension de 40m² avec nouvelle cuisine et salle à manger ouverte",
      adresse: "8 Impasse des Roses, 31000 Toulouse",
      statut: "TERMINE",
      progression: 100,
      dateDebut: "2023-11-01",
      dateFin: "2024-02-28",
      budget: 65000,
      photo: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
      client: { name: "Jean Moreau", company: undefined },
      _count: { messages: 45, comments: 25 }
    },
    {
      id: "5",
      nom: "Rénovation Appartement Haussmannien",
      description: "Rénovation d'un 120m² avec préservation des éléments d'époque",
      adresse: "25 Boulevard Saint-Germain, 75005 Paris",
      statut: "EN_ATTENTE",
      progression: 20,
      dateDebut: "2024-01-15",
      dateFin: "2024-06-30",
      budget: 150000,
      photo: "https://images.unsplash.com/photo-1600607688960-e095c75bb04f?w=400&h=300&fit=crop",
      client: { name: "Catherine Blanc", company: "Patrimoine Parisien" },
      _count: { messages: 12, comments: 6 }
    },
    {
      id: "6",
      nom: "Construction Garage et Atelier",
      description: "Construction d'un garage double avec atelier de bricolage intégré",
      adresse: "3 Chemin des Artisans, 13100 Aix-en-Provence",
      statut: "PLANIFIE",
      progression: 0,
      dateDebut: "2024-06-01",
      dateFin: "2024-09-15",
      budget: 45000,
      client: { name: "Michel Rousseau", company: undefined },
      _count: { messages: 3, comments: 1 }
    }
  ];

  const fetchChantiers = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredChantiers = mockChantiers;
      
      if (search) {
        filteredChantiers = filteredChantiers.filter(c => 
          c.nom.toLowerCase().includes(search.toLowerCase()) ||
          c.client.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (statusFilter !== 'TOUS') {
        filteredChantiers = filteredChantiers.filter(c => c.statut === statusFilter);
      }
      
      setChantiers(filteredChantiers);
      setPagination({
        page: 1,
        limit: 12,
        total: filteredChantiers.length,
        pages: Math.ceil(filteredChantiers.length / 12)
      });
    } catch (error) {
      console.error('Erreur:', error);
      setChantiers(mockChantiers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChantiers();
  }, [search, statusFilter]);

  const LoadingSkeleton = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card" style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite',
            height: '100%',
            borderRadius: '1rem'
          }} />
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏗️</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
        {search || statusFilter !== 'TOUS' ? 'Aucun chantier trouvé' : 'Aucun chantier'}
      </h3>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        {search || statusFilter !== 'TOUS' 
          ? 'Essayez de modifier vos critères de recherche'
          : 'Commencez par créer votre premier chantier'
        }
      </p>
      {(!search && statusFilter === 'TOUS') && (
        <Link href="/dashboard/chantiers/nouveau" className="btn-primary">
          🏗️ Créer un chantier
        </Link>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1e293b', 
              margin: '0 0 0.5rem 0'
            }}>
              Mes Chantiers
            </h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Gérez et suivez tous vos projets de construction
            </p>
          </div>
          
          <Link href="/dashboard/chantiers/nouveau" className="btn-primary">
            🏗️ Nouveau chantier
          </Link>
        </div>

        <SearchFilter
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          searchValue={search}
          statusValue={statusFilter}
        />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#3b82f6', fontWeight: 'bold' }}>
              {mockChantiers.filter(c => c.statut === 'EN_COURS').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>En cours</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#f59e0b', fontWeight: 'bold' }}>
              {mockChantiers.filter(c => c.statut === 'PLANIFIE').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Planifiés</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#10b981', fontWeight: 'bold' }}>
              {mockChantiers.filter(c => c.statut === 'TERMINE').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Terminés</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#1e293b', fontWeight: 'bold' }}>
              {mockChantiers.reduce((sum, c) => sum + c.budget, 0).toLocaleString('fr-FR')}€
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Budget total</div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : chantiers.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {chantiers.map((chantier) => (
              <ChantierCard key={chantier.id} chantier={chantier} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
