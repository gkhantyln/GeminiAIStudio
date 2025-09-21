
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-8 mt-12 border-t border-gray-700/50">
      <div className="text-center text-gray-500 text-sm">
        <p>Powered by Google Gemini API</p>
        <p>&copy; {new Date().getFullYear()} Face Swap AI. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
