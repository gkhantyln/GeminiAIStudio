
import React, { useRef, useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LinkIcon } from './icons/LinkIcon';
import { Spinner } from './Spinner';
import { useTranslation } from '../context/LanguageContext';

interface ImageUploaderProps {
  label: string;
  description: string;
  image: string | null;
  onImageUpload: (base64: string | null) => void;
  enableUrlFetch?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, description, image, onImageUpload, enableUrlFetch = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; 
  };
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(null);
  };

  const onAreaClick = useCallback(() => {
    if (!image) {
        inputRef.current?.click();
    }
  }, [image]);

  const handleFetchUrl = async () => {
    if (!url.startsWith('http')) {
        setFetchError(t('imageUploader.error.invalidUrl'));
        return;
    }
    setIsFetchingUrl(true);
    setFetchError(null);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(t('imageUploader.error.fetchPage', { status: response.status }));
      const html = await response.text();

      const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
      const imageUrl = ogImageMatch?.[1];
      if (!imageUrl) throw new Error(t('imageUploader.error.noImage'));

      const imageProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
      const imageResponse = await fetch(imageProxyUrl);
      if (!imageResponse.ok) throw new Error(t('imageUploader.error.fetchImage', { status: imageResponse.status }));
      
      const blob = await imageResponse.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
        setUrl('');
      };
      reader.onerror = () => {
        throw new Error(t('imageUploader.error.readImage'));
      };
      reader.readAsDataURL(blob);

    } catch (e: any) {
      console.error(e);
      setFetchError(e.message || t('imageUploader.error.unknown'));
    } finally {
      setIsFetchingUrl(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center gap-2">
       <h3 className="text-xl font-semibold text-white">{label}</h3>
       <p className="text-sm text-gray-400 text-center mb-2">{description}</p>
      <div 
        onClick={onAreaClick}
        className={`relative group w-full h-64 sm:h-80 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center transition-all duration-300 ${!image ? 'cursor-pointer hover:border-indigo-500 hover:bg-gray-700' : ''}`}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden" 
        />
        {image ? (
          <>
            <img src={image} alt={label} className="w-full h-full object-contain rounded-xl p-2" />
            <button 
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                aria-label={t('imageUploader.removeImage')}
            >
                <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="w-12 h-12 mx-auto mb-2"/>
            <p className="font-semibold">{t('imageUploader.clickToUpload')}</p>
            <p className="text-xs">{t('imageUploader.fileTypes')}</p>
          </div>
        )}
      </div>
       {enableUrlFetch && (
        <div className="w-full mt-4">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">{t('imageUploader.orFetch')}</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('imageUploader.urlPlaceholder')}
              className="flex-grow p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isFetchingUrl}
              aria-label="Product URL"
            />
            <button
              onClick={handleFetchUrl}
              disabled={!url || isFetchingUrl}
              className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              aria-label={t('imageUploader.fetchImage')}
            >
              {isFetchingUrl ? <Spinner className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
            </button>
          </div>
          {fetchError && <p className="text-red-400 text-xs mt-2 text-center">{fetchError}</p>}
        </div>
      )}
    </div>
  );
};
