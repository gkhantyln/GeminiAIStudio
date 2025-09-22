import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ExpandIcon } from '../components/icons/ExpandIcon';
import { magicExpand } from '../services/geminiService';
import { Spinner } from '../components/Spinner';

const MagicExpandView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetRatio, setTargetRatio] = useState<string>('');

  const handleAction = useCallback(async (ratio: string) => {
    if (!image) {
      setError('Lütfen genişletilecek bir resim yükleyin.');
      return;
    }

    setLoading(true);
    setTargetRatio(ratio);
    setError(null);
    setResultImage(null);

    try {
      const result = await magicExpand(image, ratio);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka resmi genişletemedi. Lütfen farklı bir resim deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
      setTargetRatio('');
    }
  }, [image]);
  
  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
    setTargetRatio('');
  }

  return (
    <div className="w-full max-w-xl">
        <ImageUploader 
            label="Görüntü Yükle" 
            description="Sınırlarını genişletmek istediğiniz görüntüyü seçin."
            image={image} 
            onImageUpload={setImage} 
        />
        
        {image && !resultImage && (
             <div className="my-8">
                <p className="text-xl font-semibold text-white text-center mb-4">Hedef Boyut Oranını Seçin</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {['16:9 (Yatay)', '9:16 (Dikey)', '4:3 (Yatay)', '1:1 (Kare)'].map(ratioStr => {
                        const ratio = ratioStr.split(' ')[0];
                        const isLoadingThis = loading && targetRatio === ratio;
                        return (
                            <button
                                key={ratio}
                                onClick={() => handleAction(ratio)}
                                disabled={loading}
                                className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                            >
                                {isLoadingThis ? <Spinner className="w-5 h-5 mr-2" /> : <ExpandIcon className="w-5 h-5 mr-2" />}
                                {isLoadingThis ? 'Genişletiliyor...' : ratioStr}
                            </button>
                        );
                    })}
                </div>
             </div>
        )}

        <ResultDisplay
            swappedImage={resultImage}
            loading={loading && !!targetRatio}
            error={error}
            onReset={handleReset}
        />
    </div>
  );
};

export default MagicExpandView;