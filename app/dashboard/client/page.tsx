"use client";

import { useAuth } from "@/hooks/useAuth";
import { Building, MessageSquare, FileText, Calendar, MapPin, Clock, CheckCircle, AlertCircle, Camera, Eye } from "lucide-react";

export default function ClientPage() {
  const { user } = useAuth();

  const clientProjects = [
    {
      id: 1,
      nom: "Rénovation Maison Principale",
      adresse: "15 Rue des Oliviers, Lyon",
      statut: "EN_COURS",
      progression: 65,
      dateDebut: "15/06/2024",
      dateFin: "20/12/2024",
      budget: "180K€",
      responsable: "Marie Martin",
      description: "Rénovation complète avec extension cuisine",
      prochaine_etape: "Installation électrique - Semaine du 25/08",
      photos: 12,
      derniere_visite: "Hier 14:30"
    },
    {
      id: 2,
      nom: "Aménagement Bureau",
      adresse: "42 Avenue République, Lyon",
      statut: "PLANIFIE",
      progression: 0,
      dateDebut: "10/01/2025",
      dateFin: "30/04/2025",
      budget: "85K€",
      responsable: "Jean Dupont",
      description: "Aménagement moderne des espaces de travail",
      prochaine_etape: "Réunion de lancement - 15/01/2025",
      photos: 0,
      derniere_visite: null
    }
  ];

  const recentMessages = [
    { 
      expediteur: "Marie Martin", 
      message: "Photos de l'avancement des travaux envoyées - La cuisine prend forme !", 
      time: "Il y a 2h", 
      type: "update",
      urgent: false,
      lu: false
    },
    { 
      expediteur: "Équipe Plomberie", 
      message: "Installation terminée, validation requise pour la suite", 
      time: "Il y a 5h", 
      type: "task",
      urgent: true,
      lu: false
    },
    { 
      expediteur: "Jean Dupont", 
      message: "Devis complémentaire pour modification demandée", 
      time: "Hier", 
      type: "devis",
      urgent: false,
      lu: true
    },
    { 
      expediteur: "Marie Martin", 
      message: "Livraison des carrelages prévue vendredi matin", 
      time: "Avant-hier", 
      type: "planning",
      urgent: false,
      lu: true
    }
  ];

  const upcomingEvents = [
    { 
      event: "Visite d'inspection", 
      project: "Rénovation Maison", 
      date: "Demain 10:00", 
      type: "inspection",
      description: "Contrôle qualité des travaux électriques"
    },
    { 
      event: "Réunion avancement", 
      project: "Aménagement Bureau", 
      date: "Vendredi 14:00", 
      type: "meeting",
      description: "Point sur le planning et les prochaines étapes"
    },
    { 
      event: "Livraison matériaux", 
      project: "Rénovation Maison", 
      date: "Lundi 9:00", 
      type: "delivery",
      description: "Réception carrelage salle de bain"
    }
  ];

  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'EN_COURS': return 'bg-green-100 text-green-800 border-green-200';
      case 'PLANIFIE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'TERMINE': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch(statut) {
      case 'EN_COURS': return 'En cours';
      case 'PLANIFIE': return 'Planifié';
      case 'EN_ATTENTE': return 'En attente';
      case 'TERMINE': return 'Terminé';
      default: return statut;
    }
  };

  const getMessageIcon = (type: string) => {
    switch(type) {
      case 'update': return '📸';
      case 'task': return '✅';
      case 'devis': return '💰';
      case 'planning': return '📅';
      default: return '💬';
    }
  };

  const messagesNonLus = recentMessages.filter(m => !m.lu).length;

  return (
    <div className="space-y-8">
      {/* Header Client */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              🏡 Mes Projets
            </h1>
            <p className="text-xl text-blue-100">
              Bonjour <span className="font-semibold text-white">{user?.name}</span> ! 
              Suivez l'avancement de vos chantiers en temps réel
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <span className="text-sm text-blue-100 block">Projets actifs</span>
                <div className="text-2xl font-bold">{clientProjects.filter(p => p.statut === 'EN_COURS').length}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <span className="text-sm text-blue-100 block">Messages non lus</span>
                <div className="text-2xl font-bold text-yellow-300">{messagesNonLus}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <span className="text-sm text-blue-100 block">Événements</span>
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
              <Building size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Projets</h3>
              <p className="text-sm text-gray-600">{clientProjects.length} en cours</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard/chantiers'}
            className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors"
          >
            Voir tous mes chantiers →
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600">{messagesNonLus} non lus</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard/messages'}
            className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
          >
            Voir mes messages →
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Documents</h3>
              <p className="text-sm text-gray-600">Plans, photos, contrats</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard/documents'}
            className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors"
          >
            Mes documents →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mes projets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Building className="mr-2" size={24} />
                Mes Projets en Cours
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {clientProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{project.nom}</h4>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        {project.adresse}
                      </div>
                      {project.prochaine_etape && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <div className="text-sm font-medium text-blue-900">Prochaine étape :</div>
                          <div className="text-sm text-blue-700">{project.prochaine_etape}</div>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.statut)}`}>
                      {getStatusText(project.statut)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <div>
                        <div>Début: {project.dateDebut}</div>
                        <div>Fin: {project.dateFin}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      💰 Budget: {project.budget}
                    </div>
                    <div className="flex items-center text-gray-600">
                      👨‍💼 {project.responsable}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Camera size={16} className="mr-1" />
                      {project.photos} photos
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Avancement</span>
                      <span className="text-sm font-bold text-blue-600">{project.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${project.progression}%` }}
                      ></div>
                    </div>
                    {project.derniere_visite && (
                      <div className="text-xs text-gray-500">
                        Dernière visite: {project.derniere_visite}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/chantiers/${project.id}`;
                      }}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      Voir détails
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = '/dashboard/messages';
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} />
                      Messages
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          
          {/* Messages récents */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <MessageSquare className="mr-2" size={20} />
                  Messages Récents
                </h3>
                {messagesNonLus > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {messagesNonLus}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {recentMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                    !message.lu ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                  } ${message.urgent ? 'ring-2 ring-orange-200 bg-orange-50' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                    {getMessageIcon(message.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {message.expediteur}
                      </p>
                      {message.urgent && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">{message.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{message.time}</p>
                      {!message.lu && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => window.location.href = '/dashboard/messages'}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
              >
                Voir tous les messages →
              </button>
            </div>
          </div>

          {/* Prochains événements */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Calendar className="mr-2" size={20} />
                Prochains Événements
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="border-l-4 border-l-purple-500 bg-purple-50 p-4 rounded-r-lg hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{event.event}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      event.type === 'inspection' ? 'bg-red-100 text-red-800' :
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.type === 'inspection' ? '🔍' : 
                       event.type === 'meeting' ? '🤝' : '📦'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{event.project}</p>
                  <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock size={12} className="mr-1" />
                    {event.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aide et support */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Besoin d'aide ?</h3>
                <p className="text-blue-700 mb-4 text-sm">
                  Notre équipe est là pour répondre à toutes vos questions sur vos projets.
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={() => window.location.href = '/dashboard/messages'}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                  >
                    💬 Contacter mon équipe
                  </button>
                  <button 
                    onClick={() => window.location.href = '/dashboard/documents'}
                    className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm border border-blue-200"
                  >
                    📁 Mes documents
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Résumé financier */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          💰 Résumé Financier
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-2">265K€</div>
            <div className="text-sm text-green-700 font-medium">Budget total projets</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-2">117K€</div>
            <div className="text-sm text-blue-700 font-medium">Dépensé à ce jour</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-2">148K€</div>
            <div className="text-sm text-purple-700 font-medium">Restant à engager</div>
          </div>
        </div>
      </div>
    </div>
  );
}
