
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { OutfitIcon } from '../components/icons/OutfitIcon';
import { TransferIcon } from '../components/icons/TransferIcon';
import { changeOutfit, transferOutfit } from '../services/geminiService';

const OutfitChangeView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!image) {
      setError('Lütfen bir kişi resmi yükleyin.');
      return;
    }
    if (!outfitImage && !prompt) {
        setError('Lütfen yeni bir kıyafet resmi yükleyin veya bir açıklama girin.');
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
        setError('Yapay zeka görüntüyü işleyemedi. Lütfen farklı bir tane deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [image, outfitImage, prompt]);
  
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
                label="Kişi" 
                description="Kıyafetini değiştirmek istediğiniz kişi."
                image={image} 
                onImageUpload={setImage} 
            />
            <ImageUploader 
                label="Yeni Kıyafet Resmi (İsteğe Bağlı)" 
                description="Modelin giymesi için bir kıyafet resmi yükleyin veya bir link yapıştırın."
                image={outfitImage} 
                onImageUpload={setOutfitImage}
                enableUrlFetch={true}
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">
                  {outfitImage ? 'Ek Talimatlar (İsteğe Bağlı)' : 'Yeni Kıyafet'}
                </label>
                <p className="text-sm text-gray-400 text-center mb-4">
                  {outfitImage ? 'Değişiklik için ek notlar ekleyin.' : 'Ne giymesini istediğinizi açıklayın.'}
                </p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={outfitImage ? "Örn: rengini kırmızı yap" : "Örn: siyah deri ceket ve mavi kot pantolon"}
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
              text="Kıyafeti Değiştir"
              loadingText="Değiştiriliyor..."
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
