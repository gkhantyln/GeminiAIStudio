import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { ActionButton } from '../components/ActionButton';
import { EraserIcon } from '../components/icons/EraserIcon';
import { magicErase } from '../services/geminiService';
import { TrashIcon } from '../components/icons/TrashIcon';
import { useTranslation } from '../context/LanguageContext';

const MagicEraserView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<number>(30);
  const { t } = useTranslation();

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  const resizeCanvas = useCallback((img: HTMLImageElement) => {
    const container = containerRef.current;
    const imageCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (!container || !imageCanvas || !maskCanvas) return;

    const maxWidth = container.clientWidth;
    const scale = Math.min(maxWidth / img.width, 1);
    const canvasWidth = img.width * scale;
    const canvasHeight = img.height * scale;

    imageCanvas.width = canvasWidth;
    imageCanvas.height = canvasHeight;
    maskCanvas.width = canvasWidth;
    maskCanvas.height = canvasHeight;

    const imageCtx = imageCanvas.getContext('2d');
    imageCtx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    const maskCtx = maskCanvas.getContext('2d');
    if(maskCtx) {
      maskCtx.fillStyle = 'rgba(0,0,0,0)'; // Transparent
      maskCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  }, []);

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => resizeCanvas(img);
    
    const handleResize = () => {
        if (img.complete) resizeCanvas(img);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [image, resizeCanvas]);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e.nativeEvent) {
      return {
        x: e.nativeEvent.touches[0].clientX - rect.left,
        y: e.nativeEvent.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const draw = useCallback((pos: { x: number; y: number }) => {
    const ctx = maskCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
    if (lastPos) {
      ctx.moveTo(lastPos.x, lastPos.y);
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastPos(pos);
  }, [brushSize, lastPos]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPointerPos(e);
    if (pos) {
      setIsDrawing(true);
      setLastPos(pos);
      draw(pos);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPointerPos(e);
    if (pos) {
      draw(pos);
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleClearMask = () => {
    const canvas = maskCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const handleAction = useCallback(async () => {
    if (!image || !maskCanvasRef.current) {
      setError(t('views.magicEraser.error'));
      return;
    }
    
    const originalImage = new Image();
    originalImage.src = image;
    originalImage.onload = async () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = originalImage.width;
        tempCanvas.height = originalImage.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCtx.drawImage(maskCanvasRef.current!, 0, 0, maskCanvasRef.current!.width, maskCanvasRef.current!.height, 0, 0, originalImage.width, originalImage.height);
        const maskBase64 = tempCanvas.toDataURL('image/png');

        setLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const result = await magicErase(image, maskBase64);
            if (result) {
                setResultImage(`data:image/png;base64,${result}`);
            } else {
                setError(t('errors.gemini.eraseFailed'));
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : t('errors.unknown');
            if (errorMessage.includes('API Key not valid')) {
                setError(t('errors.gemini.apiKeyInvalid'));
            } else if (errorMessage.includes('API Key not found')) {
                setError(t('errors.gemini.apiKeyMissing'));
            } else if (errorMessage === 'QUOTA_EXCEEDED') {
                setError(t('errors.gemini.quotaExceeded'));
            } else {
                setError(t('errors.gemini.generic'));
            }
        } finally {
            setLoading(false);
        }
    }
  }, [image, t]);
  
  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setError(null);
    setLoading(false);
    handleClearMask();
  };

  const handleUseImage = (imageUrl: string) => {
    setImage(imageUrl);
    setResultImage(null);
    setError(null);
    handleClearMask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (!image) {
    return (
        <div className="w-full max-w-xl">
             <ImageUploader 
                label={t('views.magicEraser.uploadLabel')}
                description={t('views.magicEraser.uploadDescription')}
                image={image} 
                onImageUpload={setImage} 
            />
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div ref={containerRef} className="w-full relative mb-4" style={{ touchAction: 'none' }}>
        <canvas ref={imageCanvasRef} className="rounded-lg w-full h-auto shadow-lg" />
        <canvas 
          ref={maskCanvasRef}
          className="absolute top-0 left-0 w-full h-auto cursor-crosshair rounded-lg"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>
      
      <div className="w-full max-w-lg bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <div className='flex items-center gap-2'>
            <label htmlFor="brush-size" className="text-sm font-medium text-white whitespace-nowrap">{t('views.magicEraser.brushSize')}</label>
            <input 
                id="brush-size"
                type="range" 
                min="5" 
                max="80" 
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-32 sm:w-40 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        <button 
            onClick={handleClearMask}
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-500 transition-colors"
        >
            <TrashIcon className='w-4 h-4 mr-2'/>
            {t('views.magicEraser.clear')}
        </button>
      </div>

      <div className="text-center my-4">
        <ActionButton 
          onClick={handleAction} 
          disabled={loading}
          loading={loading}
          text={t('views.magicEraser.buttonText')}
          loadingText={t('views.magicEraser.buttonLoadingText')}
          icon={<EraserIcon className="w-6 h-6 mr-3" />}
        />
      </div>

      <ResultDisplay
        resultUrl={resultImage}
        loading={loading}
        error={error}
        onReset={handleReset}
        onUseImage={handleUseImage}
      />
    </div>
  );
};

export default MagicEraserView;