export interface Devis {
  id: string;
  numero: string;
  type: 'DEVIS' | 'FACTURE';
  statut: 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'PAYE' | 'ANNULE';
  objet: string;
  dateCreation: string;
  dateValidite?: string;
  dateEnvoi?: string;
  dateAcceptation?: string;
  datePaiement?: string;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes?: string;
  conditionsVente?: string;
  client: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  chantier?: {
    id: string;
    nom: string;
    adresse: string;
  };
  lignes: LigneDevis[];
  _count?: {
    lignes: number;
  };
}

export interface LigneDevis {
  id?: string;
  designation: string;
  quantite: string | number;
  prixUnitaire: string | number;
  tva: string | number;
  total: number;
  ordre?: number;
}

export interface DevisFormData {
  type: 'DEVIS' | 'FACTURE';
  clientId: string;
  chantierId?: string;
  objet: string;
  dateValidite?: string;
  notes?: string;
  conditionsVente?: string;
  lignes: LigneDevis[];
}

export interface DevisStats {
  totalDevis: number;
  totalFactures: number;
  montantTotal: number;
  enAttente: number;
  payes: number;
  enRetard: number;
}
