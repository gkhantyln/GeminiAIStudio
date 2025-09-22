import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { EnhanceIcon } from '../components/icons/EnhanceIcon';
import { enhanceImage } from '../services/geminiService';

const ImageEnhancerView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!image) {
      setError('Lütfen iyileştirilecek bir görüntü yükleyin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await enhanceImage(image);
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
  }, [image]);
  
  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl">
        <ImageUploader 
            label="Görüntü Yükle" 
            description="Netliği, çözünürlüğü ve renkleri iyileştirin."
            image={image} 
            onImageUpload={setImage} 
        />

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!image || loading} 
              loading={loading}
              text="Görüntüyü İyileştir"
              loadingText="İyileştiriliyor..."
              icon={<EnhanceIcon className="w-6 h-6 mr-3" />}
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

export default ImageEnhancerView;
