
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SwapButton } from './components/SwapButton';
import { ArrowIcon } from './components/icons/ArrowIcon';
import { swapFaces } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [swappedImage, setSwappedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = useCallback(async () => {
    if (!sourceImage || !targetImage) {
      setError('Please upload both a source and a target image.');
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
        setError('The AI could not process the images. Please try different ones.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            {/* Image Uploaders */}
            <ImageUploader 
              label="Source Image" 
              description="The main photo. The face will be replaced here."
              image={sourceImage} 
              onImageUpload={setSourceImage} 
            />
            <div className="hidden lg:flex justify-center items-center">
                <ArrowIcon className="w-16 h-16 text-slate-500 transform rotate-90 md:rotate-0" />
            </div>
            <ImageUploader 
              label="Target Face" 
              description="The face to swap into the source image."
              image={targetImage} 
              onImageUpload={setTargetImage} 
            />
          </div>

          <div className="text-center my-8">
            <SwapButton 
              onClick={handleSwap} 
              disabled={!sourceImage || !targetImage || loading} 
              loading={loading}
            />
          </div>

          <ResultDisplay
            swappedImage={swappedImage}
            loading={loading}
            error={error}
            onReset={handleReset}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
