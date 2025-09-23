
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { BackIcon } from './icons/BackIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { useTranslation } from '../context/LanguageContext';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  userId?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBackClick, userId, onLogout }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 py-4 px-4 sm:px-8 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors mr-2"
              aria-label={t('header.goBack')}
            >
              <BackIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 text-center whitespace-nowrap">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center justify-end flex-1">
          {userId && onLogout && (
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-gray-400">{t('header.welcome', { userId })}</span>
              <button
                onClick={onLogout}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                aria-label={t('header.logout')}
              >
                <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
