import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { VideoIcon } from '../components/icons/VideoIcon';
import { generateVideo } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const VideoGeneratorView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const loadingMessages = useMemo(() => [
    t('views.videoGenerator.loading.message1'),
    t('views.videoGenerator.loading.message2'),
    t('views.videoGenerator.loading.message3'),
    t('views.videoGenerator.loading.message4'),
    t('views.videoGenerator.loading.message5'),
  ], [t]);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    // FIX: Refactored to correctly handle interval in browser environment, fixing NodeJS.Timeout error and improving dependency management.
    if (loading) {
      setCurrentLoadingMessage(loadingMessages[0]);
      const interval = setInterval(() => {
        setCurrentLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 7000); // Change message every 7 seconds
      return () => clearInterval(interval);
    }
  }, [loading, loadingMessages]);


  const handleAction = useCallback(async () => {
    if (!prompt) {
      setError(t('views.videoGenerator.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const result = await generateVideo(prompt, image, aspectRatio);
      if (result) {
        setResultUrl(result);
      } else {
        setError(t('errors.gemini.videoGenFailed'));
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : t('errors.unknown');
      if (errorMessage.includes('API Key not valid')) {
        setError(t('errors.gemini.apiKeyInvalid'));
      } else if (errorMessage.includes('API Key not found')) {
        setError(t('errors.gemini.apiKeyMissing'));
      } else if (errorMessage === 'QUOTA_EXCEEDED') {
        setError(t('errors.gemini.quotaExceeded'));
      } else {
        setError(t('errors.gemini.generic'));
      }
    } finally {
      setLoading(false);
    }
  }, [image, prompt, t, aspectRatio]);
  
  const handleReset = () => {
    setImage(null);
    setPrompt('');
    setAspectRatio('16:9');
    if(resultUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl);
    }
    setResultUrl(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl">
        <div className="space-y-8">
            <ImageUploader 
                label={t('views.videoGenerator.uploadLabel')} 
                description={t('views.videoGenerator.uploadDescription')}
                image={image} 
                onImageUpload={setImage} 
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">{t('views.videoGenerator.promptLabel')}</label>
                <p className="text-sm text-gray-400 text-center mb-4">{t('views.videoGenerator.promptDescription')}</p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('views.videoGenerator.promptPlaceholder')}
                    className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    disabled={loading}
                />
            </div>
             <div className="my-6">
                <p className="text-xl font-semibold text-white text-center mb-4">{t('views.videoGenerator.aspectRatioLabel')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {['16:9', '9:16', '1:1', '4:3'].map(ratio => (
                        <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            disabled={loading}
                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 ${
                                aspectRatio === ratio
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {t(`views.videoGenerator.ratios.${ratio}` as any)}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!prompt || loading} 
              loading={loading}
              text={t('views.videoGenerator.buttonText')}
              loadingText={t('views.videoGenerator.buttonLoadingText')}
              icon={<VideoIcon className="w-6 h-6 mr-3" />}
            />
        </div>

        <ResultDisplay
            resultUrl={resultUrl}
            loading={loading}
            error={error}
            onReset={handleReset}
            loadingMessage={currentLoadingMessage}
        />
    </div>
  );
};

export default VideoGeneratorView;