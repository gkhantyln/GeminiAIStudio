import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { AgeIcon } from '../components/icons/AgeIcon';
import { transformAge } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

type TargetAge = 'Baby' | 'Child' | 'Teen' | 'Middle-Aged' | 'Senior' | 'Elderly';

const AgeYouthFilterView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [targetAge, setTargetAge] = useState<TargetAge | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAction = useCallback(async () => {
    if (!image || !targetAge) {
      setError(t('views.ageYouthFilter.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await transformAge(image, targetAge);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError(t('errors.gemini.ageTransformFailed'));
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
  }, [image, targetAge, t]);
  
  const handleReset = () => {
    setImage(null);
    setTargetAge(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  const handleUseImage = (imageUrl: string) => {
    setImage(imageUrl);
    setResultImage(null);
    setError(null);
    setTargetAge(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const ageTargets: TargetAge[] = ['Baby', 'Child', 'Teen', 'Middle-Aged', 'Senior', 'Elderly'];

  return (
    <div className="w-full max-w-xl">
        <ImageUploader 
            label={t('views.ageYouthFilter.uploadLabel')} 
            description={t('views.ageYouthFilter.uploadDescription')}
            image={image} 
            onImageUpload={setImage} 
        />
        
        {image && (
             <div className="my-8">
                <p className="text-xl font-semibold text-white text-center mb-4">{t('views.ageYouthFilter.targetAgeLabel')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {ageTargets.map(age => (
                        <button
                            key={age}
                            onClick={() => setTargetAge(age)}
                            disabled={loading}
                             className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 ${
                                targetAge === age
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                           {t(`views.ageYouthFilter.ages.${age}` as any)}
                        </button>
                    ))}
                </div>
             </div>
        )}

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!image || !targetAge || loading} 
              loading={loading}
              text={t('views.ageYouthFilter.buttonText')}
              loadingText={t('views.ageYouthFilter.buttonLoadingText')}
              icon={<AgeIcon className="w-6 h-6 mr-3" />}
            />
        </div>

        <ResultDisplay
            resultUrl={resultImage}
            loading={loading}
            error={error}
            onReset={handleReset}
            onUseImage={handleUseImage}
        />
    </div>
  );
};

export default AgeYouthFilterView;