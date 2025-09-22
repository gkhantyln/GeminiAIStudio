import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { TransferIcon } from '../components/icons/TransferIcon';
import { transferOutfit } from '../services/geminiService';

const OutfitTransferView: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!personImage || !outfitImage) {
      setError('Lütfen hem model hem de kıyafet kaynağı resimlerini yükleyin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await transferOutfit(personImage, outfitImage, prompt);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka kıyafeti aktaramadı. Lütfen farklı görseller deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [personImage, outfitImage, prompt]);
  
  const handleReset = () => {
    setPersonImage(null);
    setOutfitImage(null);
    setPrompt('');
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <ImageUploader 
          label="Model" 
          description="Yeni kıyafeti giyecek kişi."
          image={personImage} 
          onImageUpload={setPersonImage} 
        />
        <ImageUploader 
          label="Kıyafet Kaynağı" 
          description="Kıyafetin alınacağı fotoğraf."
          image={outfitImage} 
          onImageUpload={setOutfitImage} 
        />
      </div>

      <div className="w-full max-w-xl mx-auto mt-8">
        <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">Ek Talimatlar (İsteğe Bağlı)</label>
        <p className="text-sm text-gray-400 text-center mb-4">Örn: "sadece ceketi kullan" veya "rengini mavi yap".</p>
        <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ekstra talimatlarınızı buraya yazın..."
            className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={loading}
        />
      </div>

      <div className="text-center my-8">
        <ActionButton 
          onClick={handleAction} 
          disabled={!personImage || !outfitImage || loading} 
          loading={loading}
          text="Kıyafeti Aktar"
          loadingText="Aktarılıyor..."
          icon={<TransferIcon className="w-6 h-6 mr-3" />}
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

export default OutfitTransferView;