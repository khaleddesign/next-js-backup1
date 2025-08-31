import { User } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

// Types métier BTP
export interface DevisCalculation {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  retenueGarantie?: number;
}

export interface TaskWithDependencies {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
  dependances: string[];
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';
}

export interface ClientMetrics {
  totalDevis: number;
  tauxConversion: number;
  chiffreAffaires: number;
}

// Extension NextAuth
declare module 'next-auth' {
  interface Session {
    user: User & {
      role: 'ADMIN' | 'MANAGER' | 'ARTISAN' | 'CLIENT';
    };
  }
}

export {};
