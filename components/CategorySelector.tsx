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


export interface Tool {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const tools: Tool[] = [
    {
        id: 'face-swap',
        title: 'Yüz Değiştirme',
        description: 'İki görüntü arasında yüzleri sorunsuzca değiştirin.',
        icon: <SwapIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'image-mixer',
        title: 'Fotoğraf Birleştirici',
        description: 'Birden fazla fotoğrafı birleştirerek yeni bir sahne oluşturun.',
        icon: <MixerIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'virtual-try-on',
        title: 'Sanal Deneme',
        description: 'Bir takıyı veya aksesuarı bir model üzerinde deneyin.',
        icon: <JewelIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'image-enhancer',
        title: 'Görüntü İyileştirici',
        description: 'Fotoğraflarınızın çözünürlüğünü ve netliğini artırın.',
        icon: <EnhanceIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'colorize-photo',
        title: 'Fotoğraf Renklendirme',
        description: 'Siyah beyaz fotoğraflara canlı ve gerçekçi renkler ekleyin.',
        icon: <ColorizeIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'magic-eraser',
        title: 'Sihirli Silgi',
        description: 'Fotoğraflarınızdaki istenmeyen nesneleri silin.',
        icon: <EraserIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'magic-expand',
        title: 'Sihirli Genişletme',
        description: 'Fotoğraflarınızın sınırlarını yapay zeka ile genişletin.',
        icon: <ExpandIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'outfit-changer',
        title: 'Kıyafet Değiştirici',
        description: 'Metin açıklamasıyla bir kişinin kıyafetini değiştirin.',
        icon: <OutfitIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'outfit-transfer',
        title: 'Kıyafet Aktarma',
        description: 'Bir fotoğraftaki kıyafeti başka bir kişiye giydirin.',
        icon: <TransferIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'background-swap',
        title: 'Arka Plan Değiştirme',
        description: 'Bir özneyi yeni bir arka plana yerleştirin.',
        icon: <BackgroundIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'interior-designer',
        title: 'Yapay Zeka İç Mimar',
        description: 'Odanızın fotoğrafını yükleyin ve yeniden dekore edin.',
        icon: <InteriorDesignerIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'headshot-generator',
        title: 'Yapay Zeka Vesikalık',
        description: 'Selfie\'lerinizden profesyonel vesikalık fotoğraflar oluşturun.',
        icon: <HeadshotIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'product-photographer',
        title: 'Yapay Zeka Ürün Fotoğrafçısı',
        description: 'Ürünleriniz için stüdyo kalitesinde fotoğraflar üretin.',
        icon: <ProductIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
        id: 'custom-edit',
        title: 'Özel Düzenleme',
        description: 'Ne istediğinizi yazın, yapay zeka yapsın.',
        icon: <WandIcon className="w-10 h-10 mb-4 text-indigo-400" />
    },
];

interface CategorySelectorProps {
    onSelectTool: (tool: Tool) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectTool }) => {
    return (
        <div className="w-full max-w-5xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ne yapmak istersiniz?</h2>
                <p className="mt-4 text-lg text-gray-400">Bir araç seçerek başlayın</p>
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