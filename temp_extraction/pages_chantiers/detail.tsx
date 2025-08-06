--- app/dashboard/chantiers/[id]/page.tsx ---
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChantierHero from "../../../../components/chantiers/ChantierHero";
import ChantierTabs from "../../../../components/chantiers/ChantierTabs";
import StatusBadge from "../../../../components/chantiers/StatusBadge";

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
  superficie: string;
  photo?: string;
  photos: string[];
  lat?: number;
  lng?: number;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
  };
  assignees: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  }>;
  timeline: Array<{
    id: string;
    titre: string;
    description: string;
    date: string;
    type: string;
    createdBy: {
      name: string;
      role: string;
    };
  }>;
  comments: Array<{
    id: string;
    message: string;
    photos: string[];
    createdAt: string;
    auteur: {
      name: string;
      role: string;
    };
  }>;
  messages: Array<{
    id: string;
    message: string;
    photos: string[];
    createdAt: string;
    expediteur: {
      name: string;
      role: string;
    };
  }>;
  _count: {
    timeline: number;
    comments: number;
    messages: number;
    devis: number;
  };
}

export default function ChantierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [chantier, setChantier] = useState<Chantier | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("informations");
  const [newMessage, setNewMessage] = useState("");

  const mockChantier: Chantier = {
    id: "1",
    nom: "Rénovation Villa Moderne",
    description: "Rénovation complète d'une villa de 200m² avec extension moderne, nouvelle cuisine équipée, salle de bain avec spa, terrasse avec piscine et aménagement paysager. Isolation thermique renforcée et installation de panneaux solaires pour une approche éco-responsable.",
    adresse: "15 Avenue des Pins, 06400 Cannes",
    statut: "EN_COURS",
    progression: 65,
    dateDebut: "2024-03-15",
    dateFin: "2024-08-30",
    budget: 120000,
    superficie: "200m²",
    photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=400&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607688960-e095c75bb04f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop"
    ],
    lat: 43.5528,
    lng: 7.0174,
    client: {
      id: "client-1",
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      phone: "+33 6 12 34 56 78",
      company: "Dubois Immobilier",
      address: "12 Rue de la République, 06400 Cannes"
    },
    assignees: [
      {
        id: "user-1",
        name: "Pierre Maçon",
        email: "pierre.macon@chantierpro.fr",
        role: "OUVRIER",
        phone: "+33 6 87 65 43 21"
      },
      {
        id: "user-2",
        name: "Julie Électricienne",
        email: "julie.elec@chantierpro.fr",
        role: "OUVRIER",
        phone: "+33 6 11 22 33 44"
      }
    ],
    timeline: [
      {
        id: "1",
        titre: "Démolition terminée",
        description: "Démolition de l'ancienne cuisine et de la salle de bain principales. Évacuation des gravats effectuée.",
        date: "2024-04-15T10:30:00Z",
        type: "ETAPE",
        createdBy: { name: "Pierre Maçon", role: "OUVRIER" }
      },
      {
        id: "2",
        titre: "Début des travaux de plomberie",
        description: "Installation des nouvelles canalisations pour la cuisine et les salles de bain. Raccordement en cours.",
        date: "2024-04-10T14:00:00Z",
        type: "ETAPE",
        createdBy: { name: "Marie Dupont", role: "COMMERCIAL" }
      },
      {
        id: "3",
        titre: "Chantier démarré",
        description: "Le chantier de rénovation a officiellement commencé. Livraison des matériaux effectuée.",
        date: "2024-03-15T08:00:00Z",
        type: "DEBUT",
        createdBy: { name: "Jean Superviseur", role: "ADMIN" }
      }
    ],
    comments: [
      {
        id: "1",
        message: "Très satisfaite des travaux jusqu'à présent. L'équipe est professionnelle et respecte les délais.",
        photos: [],
        createdAt: "2024-04-12T16:30:00Z",
        auteur: { name: "Marie Dubois", role: "CLIENT" }
      },
      {
        id: "2",
        message: "Photo du mur porteur avant démolition pour validation. Tout est conforme au plan.",
        photos: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop"],
        createdAt: "2024-04-08T11:15:00Z",
        auteur: { name: "Pierre Maçon", role: "OUVRIER" }
      }
    ],
    messages: [
      {
        id: "1",
        message: "Bonjour Marie, les carrelages que vous avez choisis sont arrivés. Nous pouvons commencer la pose dès demain si vous confirmez.",
        photos: [],
        createdAt: "2024-04-16T09:15:00Z",
        expediteur: { name: "Pierre Maçon", role: "OUVRIER" }
      },
      {
        id: "2",
        message: "Parfait ! Vous pouvez y aller. J'ai hâte de voir le résultat 😊",
        photos: [],
        createdAt: "2024-04-16T09:45:00Z",
        expediteur: { name: "Marie Dubois", role: "CLIENT" }
      }
    ],
    _count: {
      timeline: 3,
      comments: 2,
      messages: 15,
      devis: 1
    }
  };

  const fetchChantier = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChantier(mockChantier);
    } catch (error) {
      console.error('Erreur:', error);
      setChantier(mockChantier);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchChantier();
    }
  }, [params.id]);

  const tabs = [
    { id: "informations", label: "Informations", icon: "📋" },
    { id: "timeline", label: "Timeline", icon: "📅", count: chantier?._count.timeline },
    { id: "photos", label: "Photos", icon: "📸", count: chantier?.photos.length },
    { id: "messages", label: "Messages", icon: "💬", count: chantier?._count.messages },
    { id: "equipe", label: "Équipe", icon: "👥", count: chantier?.assignees.length }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    console.log("Envoi message:", newMessage);
    setNewMessage("");
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Chargement du chantier...</p>
      </div>
    );
  }

  if (!chantier) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h2>Chantier introuvable</h2>
        <Link href="/dashboard/chantiers" className="btn-primary" style={{ marginTop: '1rem' }}>
          Retour aux chantiers
        </Link>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "informations":
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div>
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
                  Description du projet
                </h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {chantier.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                      Date de début
                    </label>
                    <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>
                      {new Date(chantier.dateDebut).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                      Date de fin prévue
                    </label>
                    <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>
                      {new Date(chantier.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                      Budget total
                    </label>
                    <p style={{ color: '#059669', fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>
                      {chantier.budget.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  <div>
                    <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                      Superficie
                    </label>
                    <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>
                      {chantier.superficie}
                    </p>
                  </div>
                </div>
              </div>

              {chantier.lat && chantier.lng && (
                <div className="card">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
                    Localisation
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                    📍 {chantier.adresse}
                  </p>
                  <div style={{
                    height: '200px',
                    background: '#f1f5f9',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}>
                    🗺️ Carte interactive (Lat: {chantier.lat}, Lng: {chantier.lng})
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
                  Informations client
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    {chantier.client.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>
                      {chantier.client.name}
                    </p>
                    {chantier.client.company && (
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                        {chantier.client.company}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ gap: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                      Email
                    </label>
                    <a href={`mailto:${chantier.client.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {chantier.client.email}
                    </a>
                  </div>

                  {chantier.client.phone && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                        Téléphone
                      </label>
                      <a href={`tel:${chantier.client.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        {chantier.client.phone}
                      </a>
                    </div>
                  )}

                  {chantier.client.address && (
                    <div>
                      <label style={{ color: '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                        Adresse
                      </label>
                      <p style={{ color: '#1e293b', margin: 0, fontSize: '0.875rem' }}>
                        {chantier.client.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div style={{ maxWidth: '800px' }}>
            {chantier.timeline.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <p style={{ color: '#64748b' }}>Aucun événement dans la timeline</p>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: '#e2e8f0'
                }} />

                {chantier.timeline.map((event, index) => (
                  <div key={event.id} style={{ position: 'relative', paddingLeft: '3rem', marginBottom: '2rem' }}>
                    <div style={{
                      position: 'absolute',
                      left: '0.25rem',
                      top: '0.5rem',
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      background: event.type === 'DEBUT' ? '#10b981' : 
                                 event.type === 'FIN' ? '#ef4444' :
                                 event.type === 'PROBLEME' ? '#f59e0b' : '#3b82f6',
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px #e2e8f0'
                    }} />

                    <div className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ color: '#1e293b', fontWeight: '600', margin: 0 }}>
                          {event.titre}
                        </h4>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p style={{ color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {event.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {event.createdBy.name.charAt(0)}
                        </div>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {event.createdBy.name} • {event.createdBy.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "photos":
        return (
          <div>
            {chantier.photos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <p style={{ color: '#64748b' }}>Aucune photo disponible</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {chantier.photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {index + 1}/{chantier.photos.length}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "messages":
        return (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem', maxHeight: '400px', overflowY: 'auto', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
              {chantier.messages.map((message) => (
                <div key={message.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {message.expediteur.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' }}>
                          {message.expediteur.name}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <div style={{
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <p style={{ margin: 0, color: '#1e293b', lineHeight: 1.5 }}>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="btn-primary"
                style={{
                  opacity: !newMessage.trim() ? 0.5 : 1,
                  cursor: !newMessage.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        );

      case "equipe":
        return (
          <div style={{ maxWidth: '600px' }}>
            {chantier.assignees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <p style={{ color: '#64748b' }}>Aucun membre d'équipe assigné</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chantier.assignees.map((member) => (
                  <div key={member.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: 'bold'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                          {member.name}
                        </h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                          {member.role === 'OUVRIER' ? 'Ouvrier' : 
                           member.role === 'COMMERCIAL' ? 'Commercial' :
                           member.role === 'ADMIN' ? 'Administrateur' : member.role}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <a 
                          href={`mailto:${member.email}`} 
                          style={{ 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            display: 'block',
                            marginBottom: '0.25rem'
                          }}
                        >
                          📧 {member.email}
                        </a>
                        {member.phone && (
                          <a 
                            href={`tel:${member.phone}`} 
                            style={{ 
                              color: '#3b82f6', 
                              textDecoration: 'none',
                              fontSize: '0.875rem'
                            }}
                          >
                            📞 {member.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span>›</span>
            <Link href="/dashboard/chantiers" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Chantiers
            </Link>
            <span>›</span>
            <span style={{ color: '#1e293b', fontWeight: '500' }}>
              {chantier.nom}
            </span>
          </div>
        </nav>

        <ChantierHero 
          chantier={chantier}
          onEdit={() => console.log('Modifier')}
          onShare={() => console.log('Partager')}
          onArchive={() => console.log('Archiver')}
        />

        <ChantierTabs
          tabs={tabs}
          activeTab={activeTab}
          onTab
onTabChange={setActiveTab}
       >
         {renderTabContent()}
       </ChantierTabs>
     </div>
   </div>
 );
}
