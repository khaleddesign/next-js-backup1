export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMERCIAL' | 'OUVRIER' | 'CLIENT';
  phone?: string;
  company?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chantier {
  id: string;
  nom: string;
  description?: string;
  adresse: string;
  client: User;
  clientId: string;
  assignedTo?: User;
  assignedToId?: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'EN_ATTENTE' | 'TERMINE' | 'ANNULE';
  progression: number;
  budgetPrevisionnel?: number;
  budget?: number;
  superficie?: string;
  photo?: string;
  photos?: string[];
  dateDebut: string;
  dateFin?: string;
  lat?: number;
  lng?: number;
  assignees?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  expediteur: User;
  expediteurId: string;
  destinataireId?: string;
  chantierId?: string;
  message: string;
  photos: string[];
  files?: string[];
  typeMessage: 'DIRECT' | 'CHANTIER' | 'GROUPE';
  parentId?: string;
  threadId?: string;
  lu: boolean;
  reactions?: any[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Conversation {
  id: string;
  nom: string;
  type: 'chantier' | 'direct' | 'groupe';
  participants: User[];
  lastMessage?: {
    id?: string;
    text: string;
    time: string;
    expediteur: string;
  };
  unreadCount: number;
  photo?: string;
  updatedAt: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface SearchResult {
  type: 'message' | 'contact' | 'file';
  id: string;
  title: string;
  content: string;
  timestamp: string;
  relevanceScore: number;
  context?: any;
  metadata: {
    expediteur?: {
      id: string;
      name: string;
      role: string;
    };
    chantier?: {
      id: string;
      nom: string;
    };
    fileUrl?: string;
    fileType?: string;
    fileSize?: number;
  };
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'message' | 'chantier' | 'user' | 'system';
  user?: string;
  userId?: string;
  chantierId?: string;
  icon?: string;
  href?: string;
}

export interface Planning {
  id: string;
  titre: string;
  description?: string;
  type: 'REUNION' | 'LIVRAISON' | 'INSPECTION' | 'AUTRE';
  dateDebut: string;
  dateFin: string;
  recurrence?: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  notes?: string;
  lieu?: string;
  chantier?: {
    id: string;
    nom: string;
  };
  organisateur: {
    id: string;
    name: string;
    role: string;
  };
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanningFormData {
  titre: string;
  description?: string;
  type: 'REUNION' | 'LIVRAISON' | 'INSPECTION' | 'AUTRE';
  dateDebut: string;
  dateFin: string;
  chantierId?: string;
  participantIds: string[];
  notes?: string;
  lieu?: string;
  recurrence?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  color?: string;
  chantier?: {
    id: string;
    nom: string;
  };
}

export interface PlanningConflict {
  eventId: string;
  conflictWith: {
    id: string;
    titre: string;
    dateDebut: string;
    dateFin: string;
  };
  participants: User[];
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}
