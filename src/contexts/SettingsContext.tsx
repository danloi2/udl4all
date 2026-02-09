import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  showConsiderations: boolean;
  setShowConsiderations: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Retrieve initial value from localStorage or default to true
  const [showConsiderations, setShowConsiderationsState] = useState(() => {
    const storedValue = localStorage.getItem('udl_show_considerations');
    return storedValue === null ? true : storedValue === 'true';
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem('udl_show_considerations', showConsiderations.toString());
  }, [showConsiderations]);

  const setShowConsiderations = (show: boolean) => {
    setShowConsiderationsState(show);
  };

  return (
    <SettingsContext.Provider value={{ showConsiderations, setShowConsiderations }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
