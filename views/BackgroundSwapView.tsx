
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { BackgroundIcon } from '../components/icons/BackgroundIcon';
import { changeBackground } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const BackgroundSwapView: React.FC = () => {
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAction = useCallback(async () => {
    if (!subjectImage || !backgroundImage) {
      setError(t('views.backgroundSwap.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await changeBackground(subjectImage, backgroundImage);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError(t('errors.gemini.processFailed'));
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : t('errors.unknown');
      if (errorMessage.includes('API Key not valid')) {
        setError(t('errors.gemini.apiKeyInvalid'));
      } else if (errorMessage.includes('API Key not found')) {
        setError(t('errors.gemini.apiKeyMissing'));
      } else {
        setError(t('errors.gemini.generic'));
      }
    } finally {
      setLoading(false);
    }
  }, [subjectImage, backgroundImage, t]);
  
  const handleReset = () => {
    setSubjectImage(null);
    setBackgroundImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader 
              label={t('views.backgroundSwap.subjectLabel')} 
              description={t('views.backgroundSwap.subjectDescription')}
              image={subjectImage} 
              onImageUpload={setSubjectImage} 
            />
            <ImageUploader 
              label={t('views.backgroundSwap.backgroundLabel')}
              description={t('views.backgroundSwap.backgroundDescription')}
              image={backgroundImage} 
              onImageUpload={setBackgroundImage} 
            />
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!subjectImage || !backgroundImage || loading} 
              loading={loading}
              text={t('views.backgroundSwap.buttonText')}
              loadingText={t('views.backgroundSwap.buttonLoadingText')}
              icon={<BackgroundIcon className="w-6 h-6 mr-3" />}
            />
        </div>

        <ResultDisplay
            swappedImage={resultImage}
            loading={loading}
            error={error}
            onReset={handleReset}
        />
    </div>
  );
};

export default BackgroundSwapView;
