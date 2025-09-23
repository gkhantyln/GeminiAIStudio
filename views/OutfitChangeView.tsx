
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { OutfitIcon } from '../components/icons/OutfitIcon';
import { TransferIcon } from '../components/icons/TransferIcon';
import { changeOutfit, transferOutfit } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const OutfitChangeView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAction = useCallback(async () => {
    if (!image) {
      setError(t('views.outfitChange.error'));
      return;
    }
    if (!outfitImage && !prompt) {
        setError(t('views.outfitChange.errorPrompt'));
        return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      let result: string | null = null;
      if (outfitImage) {
        result = await transferOutfit(image, outfitImage, prompt);
      } else {
        result = await changeOutfit(image, prompt);
      }
      
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
  }, [image, outfitImage, prompt, t]);
  
  const handleReset = () => {
    setImage(null);
    setOutfitImage(null);
    setPrompt('');
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
        <div className="space-y-8">
            <ImageUploader 
                label={t('views.outfitChange.personLabel')} 
                description={t('views.outfitChange.personDescription')}
                image={image} 
                onImageUpload={setImage} 
            />
            <ImageUploader 
                label={t('views.outfitChange.newOutfitLabel')} 
                description={t('views.outfitChange.newOutfitDescription')}
                image={outfitImage} 
                onImageUpload={setOutfitImage}
                enableUrlFetch={true}
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">
                  {outfitImage ? t('views.outfitChange.promptLabel') : t('views.outfitChange.promptLabelRequired')}
                </label>
                <p className="text-sm text-gray-400 text-center mb-4">
                  {outfitImage ? t('views.outfitChange.promptDescription') : t('views.outfitChange.promptDescriptionRequired')}
                </p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={outfitImage ? t('views.outfitChange.promptPlaceholder') : t('views.outfitChange.promptPlaceholderRequired')}
                    className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    disabled={loading}
                />
            </div>
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!image || (!outfitImage && !prompt) || loading} 
              loading={loading}
              text={t('views.outfitChange.buttonText')}
              loadingText={t('views.outfitChange.buttonLoadingText')}
              icon={outfitImage ? <TransferIcon className="w-6 h-6 mr-3" /> : <OutfitIcon className="w-6 h-6 mr-3" />}
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

export default OutfitChangeView;
