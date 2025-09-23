import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { SwapIcon } from '../components/icons/SwapIcon';
import { swapFaces } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const FaceSwapView: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [swappedImage, setSwappedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAction = useCallback(async () => {
    if (!sourceImage || !targetImage) {
      setError(t('views.faceSwap.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setSwappedImage(null);

    try {
      const result = await swapFaces(sourceImage, targetImage);
      if (result) {
        setSwappedImage(`data:image/png;base64,${result}`);
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
      } else if (errorMessage === 'QUOTA_EXCEEDED') {
        setError(t('errors.gemini.quotaExceeded'));
      } else {
        setError(t('errors.gemini.generic'));
      }
    } finally {
      setLoading(false);
    }
  }, [sourceImage, targetImage, t]);
  
  const handleReset = () => {
    setSourceImage(null);
    setTargetImage(null);
    setSwappedImage(null);
    setError(null);
    setLoading(false);
  }

  const handleUseImage = (imageUrl: string) => {
    setSourceImage(imageUrl);
    setTargetImage(null);
    setSwappedImage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader 
              label={t('views.faceSwap.sourceLabel')}
              description={t('views.faceSwap.sourceDescription')}
              image={sourceImage} 
              onImageUpload={setSourceImage} 
            />
            <ImageUploader 
              label={t('views.faceSwap.targetLabel')}
              description={t('views.faceSwap.targetDescription')}
              image={targetImage} 
              onImageUpload={setTargetImage} 
            />
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!sourceImage || !targetImage || loading} 
              loading={loading}
              text={t('views.faceSwap.buttonText')}
              loadingText={t('views.faceSwap.buttonLoadingText')}
              icon={<SwapIcon className="w-6 h-6 mr-3" />}
            />
        </div>

        <ResultDisplay
            resultUrl={swappedImage}
            loading={loading}
            error={error}
            onReset={handleReset}
            onUseImage={handleUseImage}
        />
    </div>
  );
};

export default FaceSwapView;