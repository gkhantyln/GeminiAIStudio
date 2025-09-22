import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { BackgroundIcon } from '../components/icons/BackgroundIcon';
import { changeBackground } from '../services/geminiService';

const BackgroundSwapView: React.FC = () => {
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!subjectImage || !backgroundImage) {
      setError('Lütfen hem özne hem de arka plan resmini yükleyin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await changeBackground(subjectImage, backgroundImage);
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
  }, [subjectImage, backgroundImage]);
  
  const handleReset = () => {
    setSubjectImage(null);
    setBackgroundImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader 
              label="Özne" 
              description="Arka plandan ayrılacak kişi veya nesne."
              image={subjectImage} 
              onImageUpload={setSubjectImage} 
            />
            <ImageUploader 
              label="Yeni Arka Plan" 
              description="Öznenin yerleştirileceği görüntü."
              image={backgroundImage} 
              onImageUpload={setBackgroundImage} 
            />
        </div>

        <div className="text-center my-8">
            <ActionButton 
              onClick={handleAction} 
              disabled={!subjectImage || !backgroundImage || loading} 
              loading={loading}
              text="Arka Planı Değiştir"
              loadingText="Değiştiriliyor..."
              icon={<BackgroundIcon className="w-6 h-6 mr-3" />}
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

export default BackgroundSwapView;
