import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { MixerIcon } from '../components/icons/MixerIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { mixImages } from '../services/geminiService';

const MAX_IMAGES = 5;

const examplePrompts = [
    "A group of friends posing for a selfie on a sunny beach.",
    "A team of superheroes standing together in a futuristic city.",
    "A family having a picnic in a beautiful park.",
    "Friends gathered around a campfire at night, telling stories.",
    "People celebrating at a vibrant music festival.",
    "A formal group portrait in a classic, elegant library.",
];

const ImageMixerView: React.FC = () => {
    const [images, setImages] = useState<(string | null)[]>([null, null]);
    const [prompt, setPrompt] = useState<string>('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
            setError('Lütfen en az 2 resim yükleyin.');
            return;
        }
        if (!prompt) {
            setError('Lütfen resimleri birleştirmek için bir senaryo yazın.');
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
                setError('Yapay zeka görüntüleri birleştiremedi. Lütfen farklı olanları deneyin.');
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [images, prompt]);

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
                            label={`Resim ${index + 1}`}
                            description="Sahneye bir kişi ekleyin."
                            image={image}
                            onImageUpload={(base64) => handleImageUpdate(index, base64)}
                        />
                        {images.length > 2 && (
                            <button
                                onClick={() => removeImageSlot(index)}
                                className="absolute -top-2 -right-2 p-2 bg-red-600/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                aria-label={`Remove image ${index + 1}`}
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
                            <span>Resim Ekle</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-2xl mx-auto mt-10">
                 <div>
                    <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">Sahne Senaryosu</label>
                    <p className="text-sm text-gray-400 text-center mb-4">Yüklediğiniz kişilerin nerede ve ne yaptığını açıklayın.</p>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Örn: arkadaşlar kumsalda birlikte kameraya poz veriyorlar"
                        className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        disabled={loading}
                    />
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-400 text-center mb-3">Veya bir örnek seçin:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {examplePrompts.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPrompt(p)}
                                disabled={loading}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center my-8">
                <ActionButton
                    onClick={handleAction}
                    disabled={uploadedImageCount < 2 || !prompt || loading}
                    loading={loading}
                    text="Fotoğrafları Birleştir"
                    loadingText="Birleştiriliyor..."
                    icon={<MixerIcon className="w-6 h-6 mr-3" />}
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

export default ImageMixerView;
