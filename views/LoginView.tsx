import React, { useState } from 'react';
import { SparklesIcon } from '../components/icons/SparklesIcon';

interface LoginViewProps {
  onLogin: (apiKey: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Lütfen API anahtarınızı girin.');
      return;
    }
    setError('');
    onLogin(apiKey.trim());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800/50 border border-gray-700 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <SparklesIcon className="w-10 h-10 text-indigo-400 mr-3" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            AI Image Studio
          </h1>
        </div>
        <p className="text-gray-400 mb-8">Devam etmek için Google Gemini API Anahtarınızı girin.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="api-key" className="sr-only">Gemini API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Anahtarınızı Buraya Yapıştırın"
              className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              aria-label="Gemini API Key"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400 space-y-4">
            <div>
                <p className="mb-2">Bu uygulama, görüntü düzenleme için <strong>gemini-2.5-flash-image-preview</strong> modelini kullanır. Güncel ücretlendirme ve kullanım limitleri için lütfen resmi Gemini fiyatlandırma sayfasını kontrol edin.</p>
                <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">
                    Güncel Fiyatlandırmayı Görüntüle &rarr;
                </a>
            </div>
            <div>
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">
                    Gemini API Anahtarı Nasıl Alınır? &rarr;
                </a>
            </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
            <p>API Anahtarınız tarayıcınızda yerel olarak saklanır ve sunucularımıza gönderilmez.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;