'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface StatisticsResponse {
  totalBooks: number;
  totalGenres: number;
}

interface StatsContextType {
  stats: { books: number; categories: number };
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState({ books: 0, categories: 0 });

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch('/api/statistics');
      if (response.ok) {
        const data: StatisticsResponse = await response.json();
        setStats({
          books: data.totalBooks,
          categories: data.totalGenres
        });
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, []);

  // Carrega as estatísticas na inicialização
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <StatsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats deve ser usado dentro de um StatsProvider');
  }
  return context;
}

