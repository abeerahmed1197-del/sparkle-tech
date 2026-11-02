import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { addCompareId } from '@/lib/compare';

const STORAGE_KEY = 'emobiles-compare';

interface CompareContextType {
  ids: string[];
  isInCompare: (id: string) => boolean;
  toggleCompare: (id: string, name?: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const readStoredIds = (): string[] => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<string[]>(readStoredIds);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage unavailable (private mode/quota) — selection stays in memory only.
    }
  }, [ids]);

  const toggleCompare = (id: string, name?: string) => {
    setIds(prev => {
      const { ids: next, error } = addCompareId(prev, id);
      if (error) {
        toast.error(error);
        return prev;
      }
      if (next.length < prev.length) toast.success(`${name || 'Product'} removed from compare`);
      else toast.success(`${name || 'Product'} added to compare`);
      return next;
    });
  };

  const removeCompare = (id: string) => setIds(prev => prev.filter(x => x !== id));
  const clearCompare = () => setIds([]);
  const isInCompare = (id: string) => ids.includes(id);

  return (
    <CompareContext.Provider value={{ ids, isInCompare, toggleCompare, removeCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
