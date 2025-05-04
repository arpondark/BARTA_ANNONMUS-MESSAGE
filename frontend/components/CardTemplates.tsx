import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface CardTemplate {
  id: string;
  name: string;
  background: string;
  textColor: string;
  fontFamily?: string;
  gradient?: string;
  border?: string;
  shadow?: string;
  pattern?: string;
  emoji?: string;
  isCustom?: boolean;
}

export const cardTemplates: CardTemplate[] = [
  {
    id: 'default',
    name: 'Default',
    background: 'bg-white dark:bg-dark-card',
    textColor: 'text-gray-800 dark:text-white',
    shadow: 'shadow-md'
  },
  {
    id: 'gradient-purple',
    name: 'Purple Gradient',
    background: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white',
    shadow: 'shadow-lg'
  },
  {
    id: 'gradient-blue',
    name: 'Blue Ocean',
    background: 'bg-gradient-to-r from-blue-400 to-teal-500',
    textColor: 'text-white',
    shadow: 'shadow-lg'
  },
  {
    id: 'sunshine',
    name: 'Sunshine',
    background: 'bg-gradient-to-r from-yellow-300 to-amber-500',
    textColor: 'text-gray-900',
    emoji: '☀️'
  },
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    background: 'bg-gray-900',
    textColor: 'text-white',
    border: 'border-2 border-purple-500',
    shadow: 'shadow-xl'
  },
  {
    id: 'nature',
    name: 'Nature',
    background: 'bg-gradient-to-r from-green-400 to-emerald-500',
    textColor: 'text-white',
    emoji: '🌿'
  },
  {
    id: 'pastel-pink',
    name: 'Pastel Pink',
    background: 'bg-pink-200',
    textColor: 'text-pink-800',
    border: 'border border-pink-300'
  },
  {
    id: 'vibrant-coral',
    name: 'Vibrant Coral',
    background: 'bg-gradient-to-r from-orange-400 to-pink-500',
    textColor: 'text-white',
    shadow: 'shadow-lg'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    background: 'bg-gradient-to-r from-blue-900 to-indigo-900',
    textColor: 'text-blue-100',
    shadow: 'shadow-lg'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    background: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-800 dark:text-gray-100',
    border: 'border border-gray-200 dark:border-gray-700'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    background: 'bg-gradient-to-r from-red-500 to-yellow-500',
    textColor: 'text-white',
    emoji: '🌅'
  },
  {
    id: 'neon',
    name: 'Neon',
    background: 'bg-black',
    textColor: 'text-green-400',
    border: 'border-2 border-green-400',
    shadow: 'shadow-lg shadow-green-400/50'
  },
  {
    id: 'sky',
    name: 'Sky',
    background: 'bg-gradient-to-b from-blue-300 to-blue-500',
    textColor: 'text-white',
    emoji: '☁️'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    background: 'bg-amber-100',
    textColor: 'text-amber-900',
    border: 'border-2 border-amber-800',
    fontFamily: 'font-serif'
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    background: 'bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900',
    textColor: 'text-white',
    shadow: 'shadow-lg',
    emoji: '✨'
  },
  {
    id: 'forest',
    name: 'Forest',
    background: 'bg-gradient-to-r from-green-800 to-emerald-900',
    textColor: 'text-green-100',
    emoji: '🌲'
  },
  {
    id: 'beach',
    name: 'Beach',
    background: 'bg-gradient-to-r from-blue-400 to-yellow-300',
    textColor: 'text-gray-800',
    emoji: '🏖️'
  },
  {
    id: 'fire',
    name: 'Fire',
    background: 'bg-gradient-to-r from-red-600 to-yellow-600',
    textColor: 'text-white',
    emoji: '🔥'
  },
  {
    id: 'ice',
    name: 'Ice',
    background: 'bg-gradient-to-r from-blue-100 to-blue-300',
    textColor: 'text-blue-900',
    emoji: '❄️'
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    background: 'bg-gray-900',
    textColor: 'text-gray-100',
    border: 'border border-gray-700'
  }
];

export function getCardTemplate(id: string): CardTemplate {
  return cardTemplates.find(template => template.id === id) || cardTemplates[0];
}

export function MessageCard({ 
  message, 
  templateId = 'default',
  className = '',
  showEmoji = true,
  style = {},
  publicView = false
}: { 
  message: string; 
  templateId?: string;
  className?: string;
  showEmoji?: boolean;
  style?: React.CSSProperties;
  publicView?: boolean;
}) {
  const template = getCardTemplate(templateId);

  return (
    <div 
      className={`rounded-xl p-6 ${template.background} ${template.textColor} ${template.border || ''} ${template.shadow || ''} ${className}`}
      style={style}
    >
      <div className="relative">
        {showEmoji && template.emoji && (
          <div className="absolute -top-3 -right-3 text-xl">{template.emoji}</div>
        )}
        <p className={`${template.fontFamily || 'font-sans'} whitespace-pre-wrap`}>{message}</p>
      </div>
    </div>
  );
}

export function CardTemplateSelector({ 
  selectedTemplate, 
  onSelect 
}: { 
  selectedTemplate: string; 
  onSelect: (id: string) => void;
}) {
  const { t, language } = useLanguage();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<CardTemplate[]>([]);

  // Custom templates are stored in memory only, not cached

  const handleAddCustomTemplate = (template: CardTemplate) => {
    const updatedTemplates = [...customTemplates, template];
    setCustomTemplates(updatedTemplates);
    // No longer storing in localStorage, only in memory
    onSelect(template.id);
    setShowCustomizer(false);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 dark:text-dark-text">{t('chooseCardStyle')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {/* Default templates */}
        {cardTemplates.map(template => (
          <div 
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`
              cursor-pointer rounded-lg p-3 text-center transition-all
              ${template.background} ${template.textColor} ${template.border || ''} ${template.shadow || ''}
              ${selectedTemplate === template.id 
                ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 scale-105 transform' 
                : 'hover:scale-105'
              }
            `}
          >
            <span className={template.fontFamily || 'font-sans'}>
              {template.emoji && `${template.emoji} `}
              {template.name}
            </span>
          </div>
        ))}

        {/* Custom templates */}
        {customTemplates.map(template => (
          <div 
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`
              cursor-pointer rounded-lg p-3 text-center transition-all
              ${template.background} ${template.textColor} ${template.border || ''} ${template.shadow || ''}
              ${selectedTemplate === template.id 
                ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 scale-105 transform' 
                : 'hover:scale-105'
              }
            `}
          >
            <span className={template.fontFamily || 'font-sans'}>
              {template.emoji && `${template.emoji} `}
              {template.name}
            </span>
          </div>
        ))}

        {/* Add custom template button */}
        <div 
          onClick={() => setShowCustomizer(true)}
          className="cursor-pointer rounded-lg p-3 text-center transition-all border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 flex items-center justify-center"
        >
          <span className="text-gray-600 dark:text-gray-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {language === 'bn' ? 'কাস্টম টেমপ্লেট' : 'Custom Template'}
          </span>
        </div>
      </div>

      {/* Custom Template Creator Modal */}
      {showCustomizer && (
        <CustomTemplateCreator 
          onSave={handleAddCustomTemplate} 
          onCancel={() => setShowCustomizer(false)} 
        />
      )}
    </div>
  );
} 

// Custom Template Creator Component
export function CustomTemplateCreator({ 
  onSave, 
  onCancel 
}: { 
  onSave: (template: CardTemplate) => void; 
  onCancel: () => void;
}) {
  const { language } = useLanguage();
  const [name, setName] = useState('My Custom Template');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [emoji, setEmoji] = useState('');
  const [borderColor, setBorderColor] = useState('');
  const [hasBorder, setHasBorder] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  const fontOptions = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-mono', label: 'Monospace' },
    { value: 'font-cursive', label: 'Cursive' }
  ];

  const handleSave = () => {
    const template: CardTemplate = {
      id: `custom-${Date.now()}`,
      name,
      background: `bg-[${backgroundColor}]`,
      textColor: `text-[${textColor}]`,
      fontFamily,
      emoji: emoji || undefined,
      border: hasBorder ? `border-2 border-[${borderColor || textColor}]` : undefined,
      shadow: hasShadow ? 'shadow-lg' : undefined,
      isCustom: true
    };
    onSave(template);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">
          {language === 'bn' ? 'কাস্টম টেমপ্লেট তৈরি করুন' : 'Create Custom Template'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'bn' ? 'টেমপ্লেট নাম' : 'Template Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'bn' ? 'পটভূমির রঙ' : 'Background Color'}
            </label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-10 p-1 border rounded-md dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'bn' ? 'টেক্সট রঙ' : 'Text Color'}
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 p-1 border rounded-md dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'bn' ? 'ফন্ট স্টাইল' : 'Font Style'}
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'bn' ? 'ইমোজি (ঐচ্ছিক)' : 'Emoji (Optional)'}
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="e.g. 🌟, 💖, 🎉"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasBorder"
              checked={hasBorder}
              onChange={(e) => setHasBorder(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hasBorder" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {language === 'bn' ? 'বর্ডার যোগ করুন' : 'Add Border'}
            </label>
          </div>

          {hasBorder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'bn' ? 'বর্ডার রঙ' : 'Border Color'}
              </label>
              <input
                type="color"
                value={borderColor || textColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-full h-10 p-1 border rounded-md dark:border-gray-700"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasShadow"
              checked={hasShadow}
              onChange={(e) => setHasShadow(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hasShadow" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {language === 'bn' ? 'ছায়া যোগ করুন' : 'Add Shadow'}
            </label>
          </div>

          {/* Preview */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'bn' ? 'প্রিভিউ' : 'Preview'}
            </label>
            <div 
              className={`rounded-xl p-6 ${hasBorder ? `border-2 border-[${borderColor || textColor}]` : ''} ${hasShadow ? 'shadow-lg' : ''}`}
              style={{ backgroundColor, color: textColor }}
            >
              <div className="relative">
                {emoji && (
                  <div className="absolute -top-3 -right-3 text-xl">{emoji}</div>
                )}
                <p className={fontFamily}>
                  {language === 'bn' 
                    ? 'এটি আপনার কাস্টম টেমপ্লেট। এটি কেমন দেখাচ্ছে?' 
                    : 'This is your custom template. How does it look?'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
