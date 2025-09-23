
import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';
import { useTranslation } from '../context/LanguageContext';

interface ResultDisplayProps {
  resultUrl: string | null;
  loading: boolean;
  error: string | null;
  onReset: () => void;
  loadingMessage?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultUrl, loading, error, onReset, loadingMessage }) => {
  const { t } = useTranslation();

  if (!resultUrl && !loading && !error) {
    return null;
  }

  const handleDownload = () => {
    if (!resultUrl) return;
    const isVideo = resultUrl.startsWith('blob:');
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = isVideo ? 'ai-studio-result.mp4' : 'ai-studio-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const isVideo = resultUrl?.startsWith('blob:');

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 mt-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-white">{t('resultDisplay.title')}</h3>
      {loading && (
        <div className="flex flex-col items-center justify-center h-80">
          <Spinner />
          <p className="text-indigo-400 mt-4 text-center animate-pulse">{loadingMessage || t('resultDisplay.loading')}</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                <p className="font-bold">{t('resultDisplay.errorTitle')}</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
      )}
      {resultUrl && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-lg">
             {isVideo ? (
              <video 
                src={resultUrl} 
                controls 
                autoPlay 
                loop 
                muted 
                className="rounded-lg shadow-2xl w-full h-auto object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={resultUrl} alt="AI Result" className="rounded-lg shadow-2xl w-full h-auto object-contain" />
            )}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              {t('resultDisplay.download')}
            </button>
            <button 
              onClick={onReset}
              className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
              {t('resultDisplay.startOver')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
