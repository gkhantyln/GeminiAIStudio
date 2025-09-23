
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { ColorizeIcon } from '../components/icons/ColorizeIcon';
import { colorizeImage } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const ColorizeView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAction = useCallback(async () => {
    if (!image) {
      setError(t('views.colorize.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await colorizeImage(image);
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
  }, [image, t]);
  
  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl">
        <ImageUploader 
            label={t('views.colorize.label')} 
            description={t('views.colorize.description')}
            image={image} 
            onImageUpload={setImage} 
        />

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!image || loading} 
              loading={loading}
              text={t('views.colorize.buttonText')}
              loadingText={t('views.colorize.buttonLoadingText')}
              icon={<ColorizeIcon className="w-6 h-6 mr-3" />}
            />
        </div>

        <ResultDisplay
            resultUrl={resultImage}
            loading={loading}
            error={error}
            onReset={handleReset}
        />
    </div>
  );
};

export default ColorizeView;
