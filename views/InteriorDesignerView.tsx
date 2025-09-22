import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { InteriorDesignerIcon } from '../components/icons/InteriorDesignerIcon';
import { redesignInterior } from '../services/geminiService';

const InteriorDesignerView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!image || !prompt) {
      setError('Lütfen bir oda fotoğrafı yükleyin ve bir talimat girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await redesignInterior(image, prompt);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka odayı yeniden tasarlayamadı. Lütfen farklı bir talimat deneyin.');
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
                label="Oda Fotoğrafı Yükle" 
                description="Yeniden dekore etmek istediğiniz odanın fotoğrafını seçin."
                image={image} 
                onImageUpload={setImage} 
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">Tasarım Talimatları</label>
                <p className="text-sm text-gray-400 text-center mb-4">Hayalinizdeki odayı detaylıca tarif edin.</p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örn: duvarları adaçayı yeşiline boya, modern bir deri kanepe ekle ve zemine ahşap parke döşe"
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
              text="Yeniden Tasarla"
              loadingText="Tasarım uygulanıyor..."
              icon={<InteriorDesignerIcon className="w-6 h-6 mr-3" />}
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

export default InteriorDesignerView;