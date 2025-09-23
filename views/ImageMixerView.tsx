
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { MixerIcon } from '../components/icons/MixerIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { mixImages } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

const MAX_IMAGES = 5;

const examplePromptKeys = [
    "beach", "superheroes", "picnic", "campfire", "festival", "library"
];

const ImageMixerView: React.FC = () => {
    const [images, setImages] = useState<(string | null)[]>([null, null]);
    const [prompt, setPrompt] = useState<string>('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleImageUpdate = (index: number, base64: string | null) => {
        const newImages = [...images];
        newImages[index] = base64;
        setImages(newImages);
    };

    const addImageSlot = () => {
        if (images.length < MAX_IMAGES) {
            setImages([...images, null]);
        }
    };

    const removeImageSlot = (index: number) => {
        if (images.length > 2) {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
        }
    };

    const handleAction = useCallback(async () => {
        const uploadedImages = images.filter((img): img is string => img !== null);
        if (uploadedImages.length < 2) {
            setError(t('views.imageMixer.errorImages'));
            return;
        }
        if (!prompt) {
            setError(t('views.imageMixer.errorPrompt'));
            return;
        }

        setLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const result = await mixImages(uploadedImages, prompt);
            if (result) {
                setResultImage(`data:image/png;base64,${result}`);
            } else {
                setError(t('errors.gemini.imageMixFailed'));
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
    }, [images, prompt, t]);

    const handleReset = () => {
        setImages([null, null]);
        setPrompt('');
        setResultImage(null);
        setError(null);
        setLoading(false);
    };

    const uploadedImageCount = images.filter(Boolean).length;

    return (
        <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <ImageUploader
                            label={t('views.imageMixer.imageLabel', { index: index + 1 })}
                            description={t('views.imageMixer.imageDescription')}
                            image={image}
                            onImageUpload={(base64) => handleImageUpdate(index, base64)}
                        />
                        {images.length > 2 && (
                            <button
                                onClick={() => removeImageSlot(index)}
                                className="absolute -top-2 -right-2 p-2 bg-red-600/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                aria-label={t('views.imageMixer.removeImage', { index: index + 1 })}
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
                 {images.length < MAX_IMAGES && (
                    <div className="flex items-center justify-center w-full h-64 sm:h-80 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl">
                        <button onClick={addImageSlot} className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span>{t('views.imageMixer.addImage')}</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-2xl mx-auto mt-10">
                 <div>
                    <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">{t('views.imageMixer.promptLabel')}</label>
                    <p className="text-sm text-gray-400 text-center mb-4">{t('views.imageMixer.promptDescription')}</p>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('views.imageMixer.promptPlaceholder')}
                        className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        disabled={loading}
                    />
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-400 text-center mb-3">{t('views.imageMixer.examplePrompt')}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {examplePromptKeys.map((key) => {
                            const promptText = t(`views.imageMixer.examplePrompts.${key}` as any);
                            return (
                                <button
                                    key={key}
                                    onClick={() => setPrompt(promptText)}
                                    disabled={loading}
                                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                                >
                                    {promptText}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="text-center my-8">
                <ActionButton
                    onClick={handleAction}
                    disabled={uploadedImageCount < 2 || !prompt || loading}
                    loading={loading}
                    text={t('views.imageMixer.buttonText')}
                    loadingText={t('views.imageMixer.buttonLoadingText')}
                    icon={<MixerIcon className="w-6 h-6 mr-3" />}
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

export default ImageMixerView;
