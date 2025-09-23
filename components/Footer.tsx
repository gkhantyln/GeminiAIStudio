
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  
  const handleLanguageChange = (lang: 'en' | 'tr') => {
    setLanguage(lang);
  };

  return (
    <footer className="w-full py-4 px-8 mt-12 border-t border-gray-700/50">
      <div className="text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center gap-4 mb-2">
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`font-semibold transition-colors ${language === 'en' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              English
            </button>
            <div className="border-l h-4 border-gray-600"></div>
            <button 
              onClick={() => handleLanguageChange('tr')}
              className={`font-semibold transition-colors ${language === 'tr' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Türkçe
            </button>
        </div>
        <p>{t('footer.poweredBy')}</p>
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
};
