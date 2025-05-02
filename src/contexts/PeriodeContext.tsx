
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentPeriode, checkIsWithinRABPeriod, checkIsWithinLPJPeriod } from '../services/periode.service';
import { Periode } from '../types/periode.types';

interface PeriodeContextType {
  currentPeriode: Periode | null;
  loading: boolean;
  error: string | null;
  isRABSubmissionTime: boolean;
  isLPJSubmissionTime: boolean;
  refreshPeriode: () => Promise<void>;
}

const PeriodeContext = createContext<PeriodeContextType>({
  currentPeriode: null,
  loading: true,
  error: null,
  isRABSubmissionTime: false,
  isLPJSubmissionTime: false,
  refreshPeriode: async () => {}
});

export const usePeriode = () => useContext(PeriodeContext);

export const PeriodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPeriode, setCurrentPeriode] = useState<Periode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRABSubmissionTime, setIsRABSubmissionTime] = useState(false);
  const [isLPJSubmissionTime, setIsLPJSubmissionTime] = useState(false);

  const refreshPeriode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current period
      const periode = await getCurrentPeriode();
      setCurrentPeriode(periode);
      
      if (periode) {
        // Check submission windows
        const [rabSubmissionTime, lpjSubmissionTime] = await Promise.all([
          checkIsWithinRABPeriod(periode.id),
          checkIsWithinLPJPeriod(periode.id)
        ]);
        
        setIsRABSubmissionTime(rabSubmissionTime);
        setIsLPJSubmissionTime(lpjSubmissionTime);
      }
    } catch (error) {
      console.error("Error fetching current periode:", error);
      setError("Failed to load period data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshPeriode();
  }, []);

  const value = {
    currentPeriode,
    loading,
    error,
    isRABSubmissionTime,
    isLPJSubmissionTime,
    refreshPeriode
  };

  return (
    <PeriodeContext.Provider value={value}>
      {children}
    </PeriodeContext.Provider>
  );
};
