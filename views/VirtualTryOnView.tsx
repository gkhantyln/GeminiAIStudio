
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { JewelIcon } from '../components/icons/JewelIcon';
import { virtualTryOn } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const VirtualTryOnView: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAction = useCallback(async () => {
    if (!personImage || !itemImage) {
      setError(t('views.virtualTryOn.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await virtualTryOn(personImage, itemImage);
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
  }, [personImage, itemImage, t]);
  
  const handleReset = () => {
    setPersonImage(null);
    setItemImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader 
              label={t('views.virtualTryOn.personLabel')} 
              description={t('views.virtualTryOn.personDescription')}
              image={personImage} 
              onImageUpload={setPersonImage} 
            />
            <ImageUploader 
              label={t('views.virtualTryOn.itemLabel')} 
              description={t('views.virtualTryOn.itemDescription')}
              image={itemImage} 
              onImageUpload={setItemImage} 
            />
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!personImage || !itemImage || loading} 
              loading={loading}
              text={t('views.virtualTryOn.buttonText')}
              loadingText={t('views.virtualTryOn.buttonLoadingText')}
              icon={<JewelIcon className="w-6 h-6 mr-3" />}
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

export default VirtualTryOnView;
