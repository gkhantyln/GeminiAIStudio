import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { ProductIcon } from '../components/icons/ProductIcon';
import { generateProductPhoto } from '../services/geminiService';

const ProductPhotographerView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('on a clean, white marble countertop with soft, natural lighting');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!image || !prompt) {
      setError('Lütfen bir ürün resmi yükleyin ve bir sahne açıklaması girin.');
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
        setError('Yapay zeka ürün fotoğrafı oluşturamadı. Lütfen farklı bir resim veya sahne deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [image, prompt]);
  
  const handleReset = () => {
    setImage(null);
    setPrompt('on a clean, white marble countertop with soft, natural lighting');
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl">
        <div className="space-y-8">
            <ImageUploader 
                label="Ürün Fotoğrafı Yükle" 
                description="Mümkünse sade bir arka plan üzerinde çekilmiş ürün fotoğrafı yükleyin."
                image={image} 
                onImageUpload={setImage} 
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">Sahneyi Tanımlayın</label>
                <p className="text-sm text-gray-400 text-center mb-4">Ürününüzün hangi ortamda ve nasıl görünmesini istediğinizi belirtin.</p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örn: temiz, beyaz mermer bir tezgahın üzerinde, yumuşak doğal ışıkla"
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
              text="Fotoğraf Oluştur"
              loadingText="Oluşturuluyor..."
              icon={<ProductIcon className="w-6 h-6 mr-3" />}
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

export default ProductPhotographerView;