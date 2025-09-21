import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  swappedImage: string | null;
  loading: boolean;
  error: string | null;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ swappedImage, loading, error, onReset }) => {
  if (!swappedImage && !loading && !error) {
    return null;
  }

  const handleDownload = () => {
    if (!swappedImage) return;
    const link = document.createElement('a');
    link.href = swappedImage;
    link.download = 'face-swap-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 mt-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-white">Result</h3>
      {loading && (
        <div className="flex flex-col items-center justify-center h-80">
          <Spinner />
          <p className="text-indigo-400 mt-4 animate-pulse">AI is working its magic... this may take a moment.</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                <p className="font-bold">An Error Occurred</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
      )}
      {swappedImage && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-lg">
            <img src={swappedImage} alt="Face Swapped Result" className="rounded-lg shadow-2xl w-full h-auto object-contain" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download
            </button>
            <button 
              onClick={onReset}
              className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};