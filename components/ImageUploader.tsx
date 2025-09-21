
import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploaderProps {
  label: string;
  description: string;
  image: string | null;
  onImageUpload: (base64: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, description, image, onImageUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = ''; 
  };
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(null);
  };

  const onAreaClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
       <h3 className="text-xl font-semibold text-white">{label}</h3>
       <p className="text-sm text-gray-400 text-center mb-2">{description}</p>
      <div 
        onClick={onAreaClick}
        className="relative group w-full h-80 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:bg-gray-700"
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
                aria-label="Remove image"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="w-12 h-12 mx-auto mb-2"/>
            <p className="font-semibold">Click to upload</p>
            <p className="text-xs">PNG, JPG or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};
