import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { HeadshotIcon } from '../components/icons/HeadshotIcon';
import { generateHeadshot } from '../services/geminiService';

const HeadshotGeneratorView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('corporate headshot, blue background, wearing a professional suit');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(async () => {
    if (!image || !prompt) {
      setError('Lütfen bir resim yükleyin ve bir stil açıklaması girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await generateHeadshot(image, prompt);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError('Yapay zeka vesikalık fotoğraf oluşturamadı. Lütfen farklı bir resim veya stil deneyin.');
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
    setPrompt('corporate headshot, blue background, wearing a professional suit');
    setResultImage(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl">
        <div className="space-y-8">
            <ImageUploader 
                label="Fotoğrafınızı Yükleyin" 
                description="Yüksek kaliteli, yüzünüzün net göründüğü bir fotoğraf seçin."
                image={image} 
                onImageUpload={setImage} 
            />
            <div>
                <label htmlFor="prompt" className="block text-xl font-semibold text-white text-center mb-2">Vesikalık Stilini Tanımlayın</label>
                <p className="text-sm text-gray-400 text-center mb-4">İstediğiniz arka planı, kıyafeti ve genel stili belirtin.</p>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örn: kurumsal vesikalık, mavi arka plan, profesyonel takım elbise"
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
              text="Vesikalık Oluştur"
              loadingText="Oluşturuluyor..."
              icon={<HeadshotIcon className="w-6 h-6 mr-3" />}
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

export default HeadshotGeneratorView;