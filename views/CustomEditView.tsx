import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { WandIcon } from '../components/icons/WandIcon';
import { customEdit } from '../services/geminiService';

const CustomEditView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!image || !prompt) {
      setError('Lütfen bir görüntü yükleyin ve bir talimat girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await customEdit(image, prompt);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka isteğinizi yerine getiremedi. Lütfen farklı bir şekilde açıklamayı deneyin.');
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
    setPrompt('');
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl">
        <div className="space-y-8">
            <ImageUploader 
                label="Görüntü Yükle" 
                description="Düzenlemek istediğiniz görüntüyü seçin."
                image={image} 
                onImageUpload={setImage} 
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">Talimatınız</label>
                <p className="text-sm text-gray-400 text-center mb-4">Görüntüde neyin değiştirilmesini istediğinizi detaylıca açıklayın.</p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örn: gökyüzünü bir gün batımına dönüştür ve bir tekne ekle"
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
              text="Düzenle"
              loadingText="Uygulanıyor..."
              icon={<WandIcon className="w-6 h-6 mr-3" />}
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

export default CustomEditView;
