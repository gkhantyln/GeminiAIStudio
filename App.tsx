import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

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
      case 'outfit-changer':
        return <OutfitChangeView />;
      case 'outfit-transfer':
        return <OutfitTransferView />;
      case 'background-swap':
        return <BackgroundSwapView />;
      case 'custom-edit':
        return <CustomEditView />;
      default:
        return <CategorySelector onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header
        title={activeTool ? activeTool.title : 'AI Image Studio'}
        onBackClick={activeTool ? () => setActiveTool(null) : undefined}
      />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {renderTool()}
      </main>
      <Footer />
    </div>
  );
};

export default App;