import React from 'react';
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
  showEmoji = true
}: { 
  message: string; 
  templateId?: string;
  className?: string;
  showEmoji?: boolean;
}) {
  const template = getCardTemplate(templateId);
  
  return (
    <div className={`rounded-xl p-6 ${template.background} ${template.textColor} ${template.border || ''} ${template.shadow || ''} ${className}`}>
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

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 dark:text-dark-text">{t('chooseCardStyle')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
      </div>
    </div>
  );
} 