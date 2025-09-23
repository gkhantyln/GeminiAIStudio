import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CategorySelector, Tool } from './components/CategorySelector';
import FaceSwapView from './views/FaceSwapView';
import VirtualTryOnView from './views/VirtualTryOnView';
import ImageEnhancerView from './views/ImageEnhancerView';
import ColorizeView from './views/ColorizeView';
import OutfitChangeView from './views/OutfitChangeView';
import BackgroundSwapView from './views/BackgroundSwapView';
import CustomEditView from './views/CustomEditView';
import OutfitTransferView from './views/OutfitTransferView';
import MagicEraserView from './views/MagicEraserView';
import HeadshotGeneratorView from './views/HeadshotGeneratorView';
import ProductPhotographerView from './views/ProductPhotographerView';
import MagicExpandView from './views/MagicExpandView';
import InteriorDesignerView from './views/InteriorDesignerView';
import LoginView from './views/LoginView';
import ImageMixerView from './views/ImageMixerView';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    const storedUserId = localStorage.getItem('user-id');
    if (storedApiKey && storedUserId) {
      setApiKey(storedApiKey);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (newApiKey: string) => {
    const newUserId = `User-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('gemini-api-key', newApiKey);
    localStorage.setItem('user-id', newUserId);
    setApiKey(newApiKey);
    setUserId(newUserId);
  };

  const handleLogout = () => {
    localStorage.removeItem('gemini-api-key');
    localStorage.removeItem('user-id');
    setApiKey(null);
    setUserId(null);
    setActiveTool(null);
  };

  const renderTool = () => {
    if (!activeTool) {
      return <CategorySelector onSelectTool={setActiveTool} />;
    }

    switch (activeTool.id) {
      case 'face-swap':
        return <FaceSwapView />;
      case 'virtual-try-on':
        return <VirtualTryOnView />;
      case 'image-enhancer':
        return <ImageEnhancerView />;
      case 'colorize-photo':
        return <ColorizeView />;
      case 'magic-eraser':
        return <MagicEraserView />;
      case 'magic-expand':
        return <MagicExpandView />;
      case 'outfit-changer':
        return <OutfitChangeView />;
      case 'outfit-transfer':
        return <OutfitTransferView />;
      case 'background-swap':
        return <BackgroundSwapView />;
      case 'interior-designer':
        return <InteriorDesignerView />;
      case 'headshot-generator':
        return <HeadshotGeneratorView />;
      case 'product-photographer':
        return <ProductPhotographerView />;
      case 'custom-edit':
        return <CustomEditView />;
      case 'image-mixer':
        return <ImageMixerView />;
      default:
        return <CategorySelector onSelectTool={setActiveTool} />;
    }
  };
  
  if (!apiKey) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header
        title={activeTool ? activeTool.title : 'AI Image Studio'}
        onBackClick={activeTool ? () => setActiveTool(null) : undefined}
        userId={userId}
        onLogout={handleLogout}
      />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {renderTool()}
      </main>
      <Footer />
    </div>
  );
};

export default App;