
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { en } from '../locales/en';
import { tr } from '../locales/tr';

const translations = { en, tr };

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('app-language') as Language;
    const browserLang = navigator.language.split('-')[0] as Language;
    if (storedLang && translations[storedLang]) {
      setLanguageState(storedLang);
    } else if (translations[browserLang]) {
      setLanguageState(browserLang);
    } else {
        setLanguageState('en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('app-language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    const lang_dict = translations[language];
    let text: any = key.split('.').reduce((obj, k) => obj && obj[k], lang_dict);

    if (typeof text !== 'string') {
        console.warn(`Translation key not found: ${key}`);
        return key;
    }

    if (options) {
      text = text.replace(/\{\{(\w+)\}\}/g, (_, k) => {
        return options[k]?.toString() || k;
      });
    }

    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
