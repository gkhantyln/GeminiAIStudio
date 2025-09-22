import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { SwapIcon } from '../components/icons/SwapIcon';
import { swapFaces } from '../services/geminiService';

const FaceSwapView: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [swappedImage, setSwappedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!sourceImage || !targetImage) {
      setError('Lütfen hem bir kaynak hem de bir hedef resmi yükleyin.');
      return;
    }

    setLoading(true);
    setError(null);
    setSwappedImage(null);

    try {
      const result = await swapFaces(sourceImage, targetImage);
      if (result) {
        setSwappedImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka görüntüleri işleyemedi. Lütfen farklı olanları deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [sourceImage, targetImage]);
  
  const handleReset = () => {
    setSourceImage(null);
    setTargetImage(null);
    setSwappedImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader 
              label="Kaynak Görüntü" 
              description="Ana fotoğraf. Yüz burada değiştirilecek."
              image={sourceImage} 
              onImageUpload={setSourceImage} 
            />
            <ImageUploader 
              label="Hedef Yüz" 
              description="Kaynak görüntüye eklenecek yüz."
              image={targetImage} 
              onImageUpload={setTargetImage} 
            />
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!sourceImage || !targetImage || loading} 
              loading={loading}
              text="Yüzleri Değiştir"
              loadingText="Değiştiriliyor..."
              icon={<SwapIcon className="w-6 h-6 mr-3" />}
            />
        </div>

        <ResultDisplay
            swappedImage={swappedImage}
            loading={loading}
            error={error}
            onReset={handleReset}
        />
    </div>
  );
};

export default FaceSwapView;
