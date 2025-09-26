import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ActionButton } from '../components/ActionButton';
import { PromptIcon } from '../components/icons/PromptIcon';
import { Spinner } from '../components/Spinner';
import { generatePromptFromImage } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

type DetailLevel = 'Simple' | 'Medium' | 'Advanced';
type Result = { english: string; turkish: string; };

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-md hover:bg-gray-500 transition-colors"
        >
            {copied ? t('views.promptGenerator.copied') : t('views.promptGenerator.copy')}
        </button>
    );
};

const PromptGeneratorView: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [detailLevel, setDetailLevel] = useState<DetailLevel>('Medium');
    const [result, setResult] = useState<Result | null>(null);
    const [rawJson, setRawJson] = useState<string>('');
    const [showJson, setShowJson] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleAction = useCallback(async () => {
        if (!image) {
            setError(t('views.promptGenerator.error'));
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setRawJson('');

        try {
            const jsonString = await generatePromptFromImage(image, detailLevel);
            if (jsonString) {
                // Sometimes the model wraps the response in markdown
                const cleanedJsonString = jsonString.replace(/```json\n?|\n?```/g, '').trim();
                setRawJson(cleanedJsonString);
                try {
                    const parsedResult: Result = JSON.parse(cleanedJsonString);
                    setResult(parsedResult);
                } catch (parseError) {
                    console.error("JSON parsing error:", parseError);
                    setError(t('errors.gemini.promptGenFailed') + " (Invalid JSON)");
                }
            } else {
                setError(t('errors.gemini.promptGenFailed'));
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
                 setError(t('errors.gemini.promptGenFailed'));
            }
        } finally {
            setLoading(false);
        }
    }, [image, detailLevel, t]);

    const handleReset = () => {
        setImage(null);
        setResult(null);
        setRawJson('');
        setShowJson(false);
        setError(null);
        setLoading(false);
        setDetailLevel('Medium');
    };
    
    const detailLevels: DetailLevel[] = ['Simple', 'Medium', 'Advanced'];

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!result && !loading && (
                <>
                    <ImageUploader
                        label={t('views.promptGenerator.uploadLabel')}
                        description={t('views.promptGenerator.uploadDescription')}
                        image={image}
                        onImageUpload={setImage}
                    />

                    {image && (
                        <>
                            <div className="my-6">
                                <p className="text-xl font-semibold text-white text-center mb-4">{t('views.promptGenerator.detailLabel')}</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {detailLevels.map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setDetailLevel(level)}
                                            disabled={loading}
                                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 ${
                                                detailLevel === level
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        >
                                            {t(`views.promptGenerator.detail.${level}` as any)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <ActionButton
                                    onClick={handleAction}
                                    disabled={!image || loading}
                                    loading={loading}
                                    text={t('views.promptGenerator.buttonText')}
                                    loadingText={t('views.promptGenerator.buttonLoadingText')}
                                    icon={<PromptIcon className="w-6 h-6 mr-3" />}
                                />
                            </div>
                        </>
                    )}
                </>
            )}

            {(loading || error || result) && (
                <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 mt-8">
                    <h3 className="text-2xl font-bold text-center mb-6 text-white">{t('views.promptGenerator.resultTitle')}</h3>
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-40">
                            <Spinner />
                            <p className="text-indigo-400 mt-4 text-center animate-pulse">{t('resultDisplay.loading')}</p>
                        </div>
                    )}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
                                <p className="font-bold">{t('resultDisplay.errorTitle')}</p>
                                <p className="text-sm">{error}</p>
                            </div>
                             <button
                                onClick={handleReset}
                                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                            >
                                {t('resultDisplay.startOver')}
                            </button>
                        </div>
                    )}
                    {result && !loading &&(
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-full space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-lg font-semibold text-white">{t('views.promptGenerator.english')}</label>
                                        <CopyButton text={result.english} />
                                    </div>
                                    <textarea readOnly value={result.english} className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 resize-none" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-lg font-semibold text-white">{t('views.promptGenerator.turkish')}</label>
                                        <CopyButton text={result.turkish} />
                                    </div>
                                    <textarea readOnly value={result.turkish} className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 resize-none" />
                                </div>
                                <div>
                                    <button onClick={() => setShowJson(!showJson)} className="text-indigo-400 hover:underline text-sm mb-2">
                                        {showJson ? t('views.promptGenerator.hideJson') : t('views.promptGenerator.viewJson')}
                                    </button>
                                    {showJson && (
                                        <>
                                            <div className="flex justify-end items-center mb-2">
                                                <CopyButton text={rawJson} />
                                            </div>
                                            <textarea readOnly value={rawJson} className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 resize-none font-mono text-xs" />
                                        </>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                            >
                                {t('resultDisplay.startOver')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PromptGeneratorView;
