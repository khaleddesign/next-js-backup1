"use client";

import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, Users, FileText, Target, Phone, Calendar, DollarSign, Award, Plus } from "lucide-react";

export default function CommercialPage() {
  const { user } = useAuth();

  const stats = {
    objectifMensuel: 500000,
    realise: 387000,
    devisEnAttente: 15,
    clientsActifs: 23,
    rendezVous: 8,
    tauxConversion: 78
  };

  const recentDevis = [
    { client: "Société Immobilière A", montant: "450K€", statut: "EN_ATTENTE", date: "20/08/2024" },
    { client: "Construction Marcel", montant: "280K€", statut: "ACCEPTE", date: "18/08/2024" },
    { client: "Rénovation Plus", montant: "125K€", statut: "BROUILLON", date: "15/08/2024" }
  ];

  const nextMeetings = [
    { client: "Villa Moderne SARL", time: "10:00", type: "Présentation devis", lieu: "Bureau" },
    { client: "Famille Dubois", time: "14:30", type: "Visite terrain", lieu: "Lyon" },
    { client: "Tech Startup", time: "16:00", type: "Négociation", lieu: "Visio" }
  ];

  const progressPercentage = Math.round((stats.realise / stats.objectifMensuel) * 100);

  return (
    <div className="space-y-8">
      {/* Header Commercial */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              💼 Espace Commercial
            </h1>
            <p className="text-xl text-green-100">
              Bonjour <span className="font-semibold text-white">{user?.name}</span> ! 
              Voici votre activité commerciale
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <span className="text-sm text-green-100 block">Objectif mensuel</span>
                <div className="text-2xl font-bold">{(stats.objectifMensuel / 1000).toFixed(0)}K€</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <span className="text-sm text-green-100 block">Réalisé</span>
                <div className="text-2xl font-bold text-yellow-300">{(stats.realise / 1000).toFixed(0)}K€</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <span className="text-sm text-green-100 block">Progression</span>
                <div className="text-2xl font-bold">{progressPercentage}%</div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-100">Progression vers l'objectif</span>
                <span className="text-sm font-semibold text-white">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Devis en Attente",
            value: stats.devisEnAttente,
            icon: FileText,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            change: "+3 cette semaine",
            trend: "up"
          },
          {
            title: "Clients Actifs",
            value: stats.clientsActifs,
            icon: Users,
            color: "from-blue-500 to-blue-600", 
            bgColor: "bg-blue-50",
            change: "+2 ce mois",
            trend: "up"
          },
          {
            title: "RDV Programmés",
            value: stats.rendezVous,
            icon: Calendar,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            change: "Cette semaine",
            trend: "stable"
          },
          {
            title: "Taux Conversion",
            value: `${stats.tauxConversion}%`,
            icon: Award,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            change: "+5% vs mois dernier",
            trend: "up"
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                {stat.trend === 'up' && <div className="text-green-500 text-sm">↗️</div>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{stat.title}</h3>
              <p className="text-sm text-green-600 font-medium">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides commerciales */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="mr-2 text-green-600" />
          Actions Commerciales Rapides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Nouveau Devis", icon: "💰", color: "from-green-500 to-green-600", href: "/dashboard/devis/nouveau?type=DEVIS" },
            { title: "Programmer RDV", icon: "📅", color: "from-blue-500 to-blue-600", href: "/dashboard/planning/nouveau" },
            { title: "Relancer Client", icon: "📞", color: "from-orange-500 to-orange-600", href: "/dashboard/messages" },
            { title: "Rapport Activité", icon: "📊", color: "from-purple-500 to-purple-600", href: "/dashboard/commercial/reports" }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => window.location.href = action.href}
              className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer group"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Devis récents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-2" size={24} />
                Devis Récents
              </h3>
              <button 
                onClick={() => window.location.href = '/dashboard/devis/nouveau?type=DEVIS'}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
                Créer un devis
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentDevis.map((devis, index) => (
              <div
                key={index}
                className="bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">{devis.client}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    devis.statut === 'ACCEPTE' ? 'bg-green-100 text-green-800' :
                    devis.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {devis.statut.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-semibold text-lg text-green-600">{devis.montant}</span>
                  <span>{devis.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rendez-vous aujourd'hui */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Calendar className="mr-2" size={20} />
              Rendez-vous Aujourd'hui
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {nextMeetings.map((meeting, index) => (
              <div
                key={index}
                className="border-l-4 border-l-blue-500 bg-blue-50 p-4 rounded-r-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{meeting.client}</h4>
                    <p className="text-xs text-gray-600 mb-2">{meeting.type}</p>
                    <div className="flex items-center text-xs text-gray-600 space-x-3">
                      <span className="flex items-center">
                        <Phone size={12} className="mr-1" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center">
                        📍 {meeting.lieu}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline commercial */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="mr-2 text-green-600" />
          Pipeline Commercial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { stage: "Prospects", count: 12, color: "bg-gray-100 text-gray-800" },
            { stage: "Devis envoyés", count: 8, color: "bg-blue-100 text-blue-800" },
            { stage: "Négociation", count: 5, color: "bg-yellow-100 text-yellow-800" },
            { stage: "Signés", count: 3, color: "bg-green-100 text-green-800" }
          ].map((stage, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stage.color} text-sm font-bold mb-2`}>
                {stage.count}
              </div>
              <div className="text-sm font-medium text-gray-900">{stage.stage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
