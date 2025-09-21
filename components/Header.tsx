
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 py-4 px-8 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        <SparklesIcon className="w-8 h-8 text-indigo-400 mr-3" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Face Swap AI
        </h1>
      </div>
    </header>
  );
};
