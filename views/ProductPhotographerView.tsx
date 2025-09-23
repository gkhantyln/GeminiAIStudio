import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { ProductIcon } from '../components/icons/ProductIcon';
import { generateProductPhoto } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const ProductPhotographerView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const { t, language } = useTranslation();
  const [prompt, setPrompt] = useState<string>(t('views.productPhotographer.promptPlaceholder'));
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update prompt placeholder when language changes
  React.useEffect(() => {
    setPrompt(t('views.productPhotographer.promptPlaceholder'));
  }, [language, t]);

  const handleAction = useCallback(async () => {
    if (!image || !prompt) {
      setError(t('views.productPhotographer.error'));
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await generateProductPhoto(image, prompt);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError(t('errors.gemini.productPhotoFailed'));
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
  }, [image, prompt, t]);
  
  const handleReset = () => {
    setImage(null);
    setPrompt(t('views.productPhotographer.promptPlaceholder'));
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  const handleUseImage = (imageUrl: string) => {
    setImage(imageUrl);
    setResultImage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-xl">
        <div className="space-y-8">
            <ImageUploader 
                label={t('views.productPhotographer.uploadLabel')} 
                description={t('views.productPhotographer.uploadDescription')}
                image={image} 
                onImageUpload={setImage} 
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">{t('views.productPhotographer.promptLabel')}</label>
                <p className="text-sm text-gray-400 text-center mb-4">{t('views.productPhotographer.promptDescription')}</p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('views.productPhotographer.promptPlaceholder')}
                    className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    disabled={loading}
                />
            </div>
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!image || !prompt || loading} 
              loading={loading}
              text={t('views.productPhotographer.buttonText')}
              loadingText={t('views.productPhotographer.buttonLoadingText')}
              icon={<ProductIcon className="w-6 h-6 mr-3" />}
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

export default ProductPhotographerView;