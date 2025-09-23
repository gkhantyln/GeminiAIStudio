import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ExpandIcon } from '../components/icons/ExpandIcon';
import { magicExpand } from '../services/geminiService';
import { Spinner } from '../components/Spinner';
import { useTranslation } from '../context/LanguageContext';

const MagicExpandView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetRatio, setTargetRatio] = useState<string>('');
  const { t } = useTranslation();

  const handleAction = useCallback(async (ratio: string) => {
    if (!image) {
      setError(t('views.magicExpand.error'));
      return;
    }

    setLoading(true);
    setTargetRatio(ratio);
    setError(null);
    setResultImage(null);

    try {
      const result = await magicExpand(image, ratio);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError(t('errors.gemini.expandFailed'));
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
      setTargetRatio('');
    }
  }, [image, t]);
  
  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
    setTargetRatio('');
  }

  const handleUseImage = (imageUrl: string) => {
    setImage(imageUrl);
    setResultImage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-xl">
        <ImageUploader 
            label={t('views.magicExpand.uploadLabel')} 
            description={t('views.magicExpand.uploadDescription')}
            image={image} 
            onImageUpload={setImage} 
        />
        
        {image && !resultImage && (
             <div className="my-8">
                <p className="text-xl font-semibold text-white text-center mb-4">{t('views.magicExpand.targetRatio')}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {['16:9', '9:16', '4:3', '1:1'].map(ratio => {
                        const isLoadingThis = loading && targetRatio === ratio;
                        return (
                            <button
                                key={ratio}
                                onClick={() => handleAction(ratio)}
                                disabled={loading}
                                className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                            >
                                {isLoadingThis ? <Spinner className="w-5 h-5 mr-2" /> : <ExpandIcon className="w-5 h-5 mr-2" />}
                                {isLoadingThis ? t('views.magicExpand.buttonLoadingText') : t(`views.magicExpand.ratio.${ratio}` as any)}
                            </button>
                        );
                    })}
                </div>
             </div>
        )}

        <ResultDisplay
            resultUrl={resultImage}
            loading={loading && !!targetRatio}
            error={error}
            onReset={handleReset}
            onUseImage={handleUseImage}
        />
    </div>
  );
};

export default MagicExpandView;