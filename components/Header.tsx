import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { BackIcon } from './icons/BackIcon';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBackClick }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 py-4 px-4 sm:px-8 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-center relative">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="absolute left-0 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <BackIcon className="w-6 h-6" />
          </button>
        )}
        <div className="flex items-center">
          <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 text-center">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};
