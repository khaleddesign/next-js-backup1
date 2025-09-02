// Système de logging conditionnel pour la production
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  
  // Pour les logs de performance
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

// Fonction utilitaire pour les logs d'API
export const apiLogger = {
  request: (method: string, url: string, data?: any) => {
    logger.debug(`🚀 ${method} ${url}`, data ? { data } : '');
  },
  
  response: (status: number, data?: any) => {
    logger.debug(`📤 Response ${status}`, data ? { data } : '');
  },
  
  error: (error: any, context?: string) => {
    logger.error(`❌ ${context || 'API Error'}:`, error);
  }
};

