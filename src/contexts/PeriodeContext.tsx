
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Periode } from '../types/periode.types';
import { getCurrentPeriode } from '../services/periode.service';

interface PeriodeContextType {
  currentPeriode: Periode | null;
  isRABSubmissionTime: boolean;
  isLPJSubmissionTime: boolean;
  isLoading: boolean;
  error: string | null;
  refreshPeriode: () => Promise<void>;
}

const PeriodeContext = createContext<PeriodeContextType | undefined>(undefined);

export function PeriodeProvider({ children }: { children: ReactNode }) {
  const [currentPeriode, setCurrentPeriode] = useState<Periode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentPeriode();
  }, []);

  async function loadCurrentPeriode() {
    setIsLoading(true);
    setError(null);
    
    try {
      const periode = await getCurrentPeriode();
      setCurrentPeriode(periode);
    } catch (error) {
      console.error("Error loading current period:", error);
      setError("Could not load current period information");
    } finally {
      setIsLoading(false);
    }
  }

  // Determine if within RAB submission timeframe
  const isRABSubmissionTime = (() => {
    if (!currentPeriode) return false;
    
    const now = new Date();
    const startDate = new Date(currentPeriode.rab_start);
    const endDate = new Date(currentPeriode.rab_end);
    endDate.setHours(23, 59, 59, 999); // End of day
    
    return now >= startDate && now <= endDate;
  })();

  // Determine if within LPJ submission timeframe
  const isLPJSubmissionTime = (() => {
    if (!currentPeriode) return false;
    
    const now = new Date();
    const startDate = new Date(currentPeriode.lpj_start);
    const endDate = new Date(currentPeriode.lpj_end);
    endDate.setHours(23, 59, 59, 999); // End of day
    
    return now >= startDate && now <= endDate;
  })();

  async function refreshPeriode() {
    await loadCurrentPeriode();
  }

  const value = {
    currentPeriode,
    isRABSubmissionTime,
    isLPJSubmissionTime,
    isLoading,
    error,
    refreshPeriode
  };

  return (
    <PeriodeContext.Provider value={value}>
      {children}
    </PeriodeContext.Provider>
  );
}

export function usePeriode() {
  const context = useContext(PeriodeContext);
  if (context === undefined) {
    throw new Error('usePeriode must be used within a PeriodeProvider');
  }
  return context;
}
