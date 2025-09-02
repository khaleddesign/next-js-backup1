'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function PlanningPage() {
  const { user } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'semaine' | 'mois'>('semaine');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([
    {
      id: '1',
      titre: 'Réunion équipe chantier Villa Dupont',
      type: 'REUNION',
      dateDebut: '2025-08-25T09:00',
      dateFin: '2025-08-25T10:30',
      lieu: 'Bureau',
      statut: 'PLANIFIE'
    },
    {
      id: '2',
      titre: 'Livraison matériaux',
      type: 'LIVRAISON',
      dateDebut: '2025-08-26T14:00',
      dateFin: '2025-08-26T16:00',
      lieu: 'Chantier Rue de la Paix',
      statut: 'PLANIFIE'
    },
    {
      id: '3',
      titre: 'Inspection qualité',
      type: 'INSPECTION',
      dateDebut: '2025-08-27T11:00',
      dateFin: '2025-08-27T12:00',
      lieu: 'Chantier Centre-ville',
      statut: 'EN_COURS'
    }
  ]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'semaine') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getDateLabel = () => {
    if (view === 'semaine') {
      const startWeek = new Date(currentDate);
      startWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endWeek = new Date(startWeek);
      endWeek.setDate(startWeek.getDate() + 6);
      
      return `${startWeek.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - ${endWeek.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  };

  const getEventIcon = (type: string) => {
    const icons = {
      REUNION: '📋',
      LIVRAISON: '🚚',
      INSPECTION: '🔍',
      AUTRE: '📌'
    };
    return icons[type as keyof typeof icons] || '📌';
  };

  const getStatusColor = (statut: string) => {
    const colors = {
      PLANIFIE: 'bg-blue-100 text-blue-800',
      EN_COURS: 'bg-yellow-100 text-yellow-800',
      TERMINE: 'bg-green-100 text-green-800',
      ANNULE: 'bg-red-100 text-red-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.dateDebut);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEvents = getEventsForDate(date);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      days.push(
        <div
          key={i}
          className={`
            min-h-[100px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors
            ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
            ${isToday ? 'bg-blue-50 border-blue-300' : ''}
          `}
          onClick={() => {
            const newEvent = new Date(date);
            newEvent.setHours(9, 0, 0, 0);
            window.location.href = `/dashboard/planning/nouveau?date=${date.toISOString().split('T')[0]}&time=09:00`;
          }}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
            {date.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event: any) => (
              <div
                key={event.id}
                className={`
                  text-xs p-1 rounded text-white cursor-pointer truncate
                  ${event.type === 'REUNION' ? 'bg-blue-500' : 
                    event.type === 'LIVRAISON' ? 'bg-green-500' : 
                    event.type === 'INSPECTION' ? 'bg-orange-500' : 'bg-gray-500'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Détails: ${event.titre}`);
                }}
                title={event.titre}
              >
                {getEventIcon(event.type)} {event.titre}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayEvents.length - 2} autres
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="bg-gray-100 p-3 text-center font-medium text-sm border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const todayEvents = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.dateDebut);
    return eventDate.toDateString() === today.toDateString();
  });

  const thisWeekEvents = events.filter(event => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const eventDate = new Date(event.dateDebut);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  const filteredEvents = events.filter(event =>
    event.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-blue-600" />
              Planning
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos réunions, livraisons et inspections
            </p>
          </div>
          
          <Link
            href="/dashboard/planning/nouveau"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau planning</span>
          </Link>
        </div>

        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{todayEvents.length}</div>
          <div className="text-gray-600 text-sm">Aujourd'hui</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{thisWeekEvents.length}</div>
          <div className="text-gray-600 text-sm">Cette semaine</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {events.filter(e => e.statut === 'PLANIFIE').length}
          </div>
          <div className="text-gray-600 text-sm">À venir</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{events.length}</div>
          <div className="text-gray-600 text-sm">Total événements</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {getDateLabel()}
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('semaine')}
                className={`px-4 py-2 text-sm ${
                  view === 'semaine' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setView('mois')}
                className={`px-4 py-2 text-sm border-l ${
                  view === 'mois' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mois
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {view === 'mois' ? (
            renderCalendar()
          ) : (
            <div>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Aucun événement trouvé' : 'Aucun événement planifié'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Essayez de modifier votre recherche'
                      : 'Commencez par créer votre premier événement'
                    }
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/dashboard/planning/nouveau"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Créer un événement</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Événements ({filteredEvents.length})
                  </h3>
                  
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => alert(`Détails de l'événement: ${event.titre}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {event.titre}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(event.dateDebut).toLocaleDateString('fr-FR')} à {' '}
                                {new Date(event.dateDebut).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {event.lieu && (
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {event.lieu}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(event.statut)}`}>
                          {event.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
