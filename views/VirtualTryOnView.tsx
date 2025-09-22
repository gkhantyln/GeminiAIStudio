import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { JewelIcon } from '../components/icons/JewelIcon';
import { virtualTryOn } from '../services/geminiService';

const VirtualTryOnView: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!personImage || !itemImage) {
      setError('Lütfen hem kişi hem de ürün resmini yükleyin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await virtualTryOn(personImage, itemImage);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka görüntüleri işleyemedi. Lütfen farklı olanları deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [personImage, itemImage]);
  
  const handleReset = () => {
    setPersonImage(null);
    setItemImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader 
              label="Kişi" 
              description="Ürünün deneneceği kişi."
              image={personImage} 
              onImageUpload={setPersonImage} 
            />
            <ImageUploader 
              label="Ürün" 
              description="Takı, gözlük, şapka vb."
              image={itemImage} 
              onImageUpload={setItemImage} 
            />
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!personImage || !itemImage || loading} 
              loading={loading}
              text="Sanal Dene"
              loadingText="Deneniyor..."
              icon={<JewelIcon className="w-6 h-6 mr-3" />}
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

export default VirtualTryOnView;
