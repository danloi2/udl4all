import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Language, MultilingualText } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (obj: MultilingualText | undefined) => string;
  tl: (obj: MultilingualText | undefined) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  // Helper function to get text in current language
  const t = (obj: MultilingualText | undefined): string => {
    if (!obj) return '';
    const val = obj[language] ?? obj['en'] ?? '';
    return Array.isArray(val) ? val.join('\n') : val;
  };

  // Translate to list of strings (for multiple paragraphs)
  const tl = (obj: MultilingualText | undefined): string[] => {
    if (!obj) return [];
    const val = obj[language] ?? obj['en'] ?? [];
    return Array.isArray(val) ? val : [val];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
