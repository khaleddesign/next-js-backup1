"use client";

import React, { useState } from "react";

const mockStats = {
  chantiersActifs: 15,
  chiffreAffaireMois: 450000,
  evolutionCA: 12,
  equipesDisponibles: 8,
  retards: 3,
  messagesNonLus: 7,
  tachesUrgentes: 4,
  planningAujourdhui: 6
};

const sampleProjects = [
  { name: "Rénovation centre commercial", status: "active", progress: 75, dueDate: "15/11/2025", lead: { name: "Jean Dupont", avatar: "JD" }, budget: "850 000€", location: "Paris 15ème", priority: "high" },
  { name: "Construction résidence A", status: "planned", progress: 10, dueDate: "30/01/2026", lead: { name: "Julie Martin", avatar: "JM" }, budget: "2 400 000€", location: "Lyon", priority: "medium" },
  { name: "Réhabilitation pont historique", status: "delayed", progress: 45, dueDate: "05/10/2025", lead: { name: "Pierre Legrand", avatar: "PL" }, budget: "1 200 000€", location: "Marseille", priority: "urgent" },
  { name: "Extension bureaux SARL Dubois", status: "active", progress: 30, dueDate: "20/12/2025", lead: { name: "Marie Clément", avatar: "MC" }, budget: "650 000€", location: "Toulouse", priority: "medium" }
];

const quickActions = [
  { title: "Nouveau Chantier", icon: "fas fa-plus", color: "primary" },
  { title: "Créer Devis", icon: "fas fa-file-invoice", color: "green" },
  { title: "Ajouter Équipe", icon: "fas fa-user-plus", color: "primary-light" },
  { title: "Upload Document", icon: "fas fa-upload", color: "orange" },
  { title: "Planifier Tâche", icon: "fas fa-calendar-plus", color: "yellow" },
  { title: "Envoyer Message", icon: "fas fa-paper-plane", color: "red" }
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");

  const filteredProjects = sampleProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Tous les statuts" || 
                         project.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'En cours';
      case 'planned': return 'Planifié';
      case 'delayed': return 'En retard';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'var(--red)';
      case 'high': return 'var(--orange)';
      case 'medium': return 'var(--primary)';
      case 'low': return 'var(--green)';
      default: return 'var(--gray-400)';
    }
  };

  return (
    <>
      {/* En-tête avec salutation - Charte ChantierPro */}
      <div style={{ 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', 
        padding: '2rem', 
        borderRadius: 'var(--radius-xl)', 
        color: 'var(--white)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--white)' }}>
              Bonjour Jean ! 👋
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: '0.9' }}>
              Vous avez {mockStats.tachesUrgentes} tâches urgentes et {mockStats.messagesNonLus} messages non lus
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>Météo Paris</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>☀️ 22°C</div>
          </div>
        </div>
      </div>

      {/* Actions rapides - Charte ChantierPro */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-900)' }}>
          ⚡ Actions Rapides
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {quickActions.map((action, index) => (
            <div key={index} className="stat-card" style={{ 
              padding: '1.5rem', 
              cursor: 'pointer', 
              borderLeft: `4px solid var(--${action.color})`,
              background: 'var(--white)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '2.5rem', 
                  height: '2.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: `var(--${action.color})`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--white)',
                  fontSize: '1.25rem'
                }}>
                  <i className={action.icon}></i>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{action.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Cliquez pour créer</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques - Charte ChantierPro */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card featured">
          <div className="stat-header">
            <div className="stat-title">Chiffre d'Affaires</div>
            <div className="stat-icon" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
              <i className="fas fa-euro-sign"></i>
            </div>
          </div>
          <div className="stat-value">450K€</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +12% ce mois
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Chantiers Actifs</div>
            <div className="stat-icon" style={{background: 'var(--primary)'}}>
              <i className="fas fa-building"></i>
            </div>
          </div>
          <div className="stat-value">15</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +3 nouveau
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Messages</div>
            <div className="stat-icon" style={{background: 'var(--orange)'}}>
              <i className="fas fa-envelope"></i>
            </div>
          </div>
          <div className="stat-value">{mockStats.messagesNonLus}</div>
          <div className="stat-change negative">
            <i className="fas fa-exclamation"></i>
            Non lus
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Planning Aujourd'hui</div>
            <div className="stat-icon" style={{background: 'var(--green)'}}>
              <i className="fas fa-calendar-day"></i>
            </div>
          </div>
          <div className="stat-value">{mockStats.planningAujourdhui}</div>
          <div className="stat-change positive">
            <i className="fas fa-clock"></i>
            Événements
          </div>
        </div>
      </div>

      {/* Section centrale avec 3 colonnes - Charte ChantierPro */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Tâches du jour */}
        <div className="table-section">
          <div className="table-header">
            <h3 className="table-title">📅 Aujourd'hui</h3>
          </div>
          <div style={{ padding: '1rem' }}>
            {[
              { task: "Visite chantier Lyon", time: "09:00", status: "pending", priority: "high" },
              { task: "Réunion équipe Paris", time: "14:30", status: "pending", priority: "medium" },
              { task: "Validation devis Marseille", time: "16:00", status: "completed", priority: "high" },
              { task: "Appel client Toulouse", time: "17:00", status: "pending", priority: "low" }
            ].map((task, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.75rem', 
                marginBottom: '0.5rem',
                borderRadius: 'var(--radius)',
                background: task.status === 'completed' ? '#F0FDF4' : 'var(--gray-50)',
                borderLeft: `3px solid ${getPriorityColor(task.priority)}`
              }}>
                <div style={{ 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  borderRadius: '50%', 
                  background: task.status === 'completed' ? 'var(--green)' : 'var(--orange)' 
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{task.task}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{task.time}</div>
                </div>
                {task.status === 'completed' && (
                  <i className="fas fa-check-circle" style={{ color: 'var(--green)' }}></i>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activités récentes */}
        <div className="table-section">
          <div className="table-header">
            <h3 className="table-title">🔔 Activités Récentes</h3>
          </div>
          <div style={{ padding: '1rem' }}>
            {[
              { message: "Chantier 'Rénovation centre commercial' mis à jour", time: "Il y a 5 min", icon: "fas fa-building" },
              { message: "Nouveau message de Pierre Legrand", time: "Il y a 12 min", icon: "fas fa-envelope" },
              { message: "Réunion chantier programmée pour demain", time: "Il y a 1h", icon: "fas fa-calendar" },
              { message: "Retard signalé sur pont historique", time: "Il y a 2h", icon: "fas fa-exclamation-triangle" }
            ].map((activity, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem', 
                padding: '0.75rem', 
                marginBottom: '0.5rem',
                borderRadius: 'var(--radius)',
                background: 'var(--gray-50)'
              }}>
                <div style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--white)',
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  <i className={activity.icon}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {activity.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        <div className="table-section">
          <div className="table-header">
            <h3 className="table-title">⚠️ Alertes</h3>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              marginBottom: '1rem',
              borderRadius: 'var(--radius)',
              background: '#FEF2F2',
              border: `1px solid var(--red-light)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: 'var(--red)' }}></i>
                <span style={{ fontWeight: '600', color: '#B91C1C' }}>Retard critique</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#7F1D1D' }}>
                Le pont historique accumule 5 jours de retard
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              marginBottom: '1rem',
              borderRadius: 'var(--radius)',
              background: '#FFFBEB',
              border: `1px solid var(--yellow-light)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-tools" style={{ color: 'var(--yellow)' }}></i>
                <span style={{ fontWeight: '600', color: '#92400E' }}>Matériaux</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#78350F' }}>
                Commande urgente de béton pour Lyon
              </p>
            </div>

            <div style={{ 
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: '#F0F9FF',
              border: `1px solid var(--primary-light)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-info-circle" style={{ color: 'var(--primary)' }}></i>
                <span style={{ fontWeight: '600', color: '#1E40AF' }}>Information</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1E3A8A' }}>
                Nouvelle réglementation BTP en vigueur
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des chantiers - Charte ChantierPro */}
      <div className="table-section">
        <div className="table-header">
          <h2 className="table-title">🏗️ Tous les Chantiers</h2>
          <div className="table-controls">
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Tous les statuts</option>
              <option>En cours</option>
              <option>Planifié</option>
              <option>En retard</option>
              <option>Terminé</option>
            </select>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Rechercher un chantier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Priorité</th>
                <th>Projet</th>
                <th>Localisation</th>
                <th>Statut</th>
                <th>Progrès</th>
                <th>Budget</th>
                <th>Échéance</th>
                <th>Responsable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ 
                      width: '0.75rem', 
                      height: '0.75rem', 
                      borderRadius: '50%', 
                      background: getPriorityColor(project.priority) 
                    }}></div>
                  </td>
                  <td>
                    <div className="project-name">{project.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      Dernière activité: il y a 2h
                    </div>
                  </td>
                  <td>
                    <div className="location">{project.location}</div>
                  </td>
                  <td>
                    <div className={`status ${project.status}`}>
                      <div className="status-dot"></div>
                      {getStatusText(project.status)}
                    </div>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${project.progress}%`}}></div>
                      </div>
                      <div className="progress-text">{project.progress}%</div>
                    </div>
                  </td>
                  <td>
                    <div className="budget">{project.budget}</div>
                  </td>
                  <td>
                    <div className={`date ${project.status === 'delayed' ? 'warning' : ''}`}>
                      {project.dueDate}
                    </div>
                  </td>
                  <td>
                    <div className="responsible">{project.lead.name}</div>
                    <div className="team">
                      <div className="avatar">{project.lead.avatar}</div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="action-btn" title="Voir détails">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn" title="Messages">
                        <i className="fas fa-comments"></i>
                      </button>
                      <button className="action-btn" title="Planning">
                        <i className="fas fa-calendar"></i>
                      </button>
                      <button className="action-btn" title="Plus">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
