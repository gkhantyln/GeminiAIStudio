
import React from 'react';
import { SwapIcon } from './icons/SwapIcon';
import { JewelIcon } from './icons/JewelIcon';
import { EnhanceIcon } from './icons/EnhanceIcon';
import { ColorizeIcon } from './icons/ColorizeIcon';
import { OutfitIcon } from './icons/OutfitIcon';
import { BackgroundIcon } from './icons/BackgroundIcon';
import { WandIcon } from './icons/WandIcon';
import { TransferIcon } from './icons/TransferIcon';
import { EraserIcon } from './icons/EraserIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { InteriorDesignerIcon } from './icons/InteriorDesignerIcon';
import { HeadshotIcon } from './icons/HeadshotIcon';
import { ProductIcon } from './icons/ProductIcon';
import { MixerIcon } from './icons/MixerIcon';
import { VideoIcon } from './icons/VideoIcon';
import { PromptIcon } from './icons/PromptIcon';
import { useTranslation } from '../context/LanguageContext';

export interface Tool {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const toolIcons: { [key: string]: React.ReactNode } = {
    'face-swap': <SwapIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'image-mixer': <MixerIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'virtual-try-on': <JewelIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'image-enhancer': <EnhanceIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'colorize-photo': <ColorizeIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'magic-eraser': <EraserIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'magic-expand': <ExpandIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'outfit-changer': <OutfitIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'outfit-transfer': <TransferIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'background-swap': <BackgroundIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'interior-designer': <InteriorDesignerIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'headshot-generator': <HeadshotIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'product-photographer': <ProductIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'custom-edit': <WandIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'prompt-generator': <PromptIcon className="w-10 h-10 mb-4 text-indigo-400" />,
    'video-generator': <VideoIcon className="w-10 h-10 mb-4 text-indigo-400" />,
};

const toolIds = [
    'face-swap', 'image-mixer', 'virtual-try-on', 'image-enhancer', 'colorize-photo', 'magic-eraser', 
    'magic-expand', 'outfit-changer', 'outfit-transfer', 'background-swap', 'interior-designer', 
    'headshot-generator', 'product-photographer', 'custom-edit', 'prompt-generator', 'video-generator'
];

interface CategorySelectorProps {
    onSelectTool: (tool: Tool) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectTool }) => {
    const { t } = useTranslation();

    const tools: Tool[] = toolIds.map(id => ({
        id: id,
        title: t(`categorySelector.tools.${id}.title`),
        description: t(`categorySelector.tools.${id}.description`),
        icon: toolIcons[id]
    }));

    return (
        <div className="w-full max-w-5xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{t('categorySelector.title')}</h2>
                <p className="mt-4 text-lg text-gray-400">{t('categorySelector.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.sort((a, b) => a.title.localeCompare(b.title)).map((tool) => (
                    <div
                        key={tool.id}
                        onClick={() => onSelectTool(tool)}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:bg-gray-800 hover:scale-105"
                    >
                        {tool.icon}
                        <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
                        <p className="text-gray-400">{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
