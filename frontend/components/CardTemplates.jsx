import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Helper: fancy font families
const fancyFonts = [
  '"Pacifico", cursive',
  '"Lobster", cursive',
  '"Bebas Neue", sans-serif',
  '"Dancing Script", cursive',
  '"Indie Flower", cursive',
  '"Shadows Into Light", cursive',
  '"Orbitron", sans-serif',
  '"Monoton", cursive',
  '"Bangers", cursive',
  '"Fira Code", monospace',
  '"Satisfy", cursive',
  '"Abril Fatface", cursive',
  '"Fredoka One", cursive',
  '"Luckiest Guy", cursive',
  '"Permanent Marker", cursive',
  '"Russo One", sans-serif',
  '"Amatic SC", cursive',
  '"Caveat", cursive',
  '"Quicksand", sans-serif',
  '"Baloo 2", cursive',
];

// Helper: get font for template
const getFont = (id, publicView) => {
  if (publicView) {
    return fancyFonts[(id.length * 3) % fancyFonts.length];
  }
  return '"Inter", "Segoe UI", Arial, sans-serif';
};

// Helper: get background for template (now with images and overlays)
const getBackground = (id) => {
  switch (id) {
    case 'img1':
      return 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80) center/cover no-repeat';
    case 'img2':
      return 'url(https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80) center/cover no-repeat';
    case 'img3':
      return 'url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80) center/cover no-repeat';
    case 'img4':
      return 'url(https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80) center/cover no-repeat';
    case 'img5':
      return 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80) center/cover no-repeat';
    case 'gradient1':
      return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
    case 'gradient2':
      return 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)';
    case 'gradient3':
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    case 'gradient4':
      return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    case 'gradient5':
      return 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)';
    case 'pattern1':
      return 'repeating-linear-gradient(45deg, #f5f7fa, #f5f7fa 10px, #c3cfe2 10px, #c3cfe2 20px)';
    case 'pattern2':
      return 'radial-gradient(circle, #fff1eb 0%, #ace0f9 100%)';
    case 'pattern3':
      return 'repeating-linear-gradient(135deg, #f8ffae, #f8ffae 15px, #43cea2 15px, #43cea2 30px)';
    case 'pattern4':
      return 'radial-gradient(circle, #fbc2eb 0%, #a6c1ee 100%)';
    case 'pattern5':
      return 'repeating-linear-gradient(90deg, #f5f7fa, #f5f7fa 20px, #c3cfe2 20px, #c3cfe2 40px)';
    case 'special1':
      return 'linear-gradient(120deg, #f6d365 0%, #fd6e6a 100%)';
    case 'special2':
      return 'linear-gradient(120deg, #96fbc4 0%, #f9f586 100%)';
    case 'special3':
      return 'linear-gradient(120deg, #c471f5 0%, #fa71cd 100%)';
    case 'special4':
      return 'linear-gradient(120deg, #48c6ef 0%, #6f86d6 100%)';
    case 'special5':
      return 'linear-gradient(120deg, #fe8c00 0%, #f83600 100%)';
    case 'premium1':
      return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
    case 'premium2':
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    case 'premium3':
      return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    case 'premium4':
      return 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)';
    case 'premium5':
      return 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)';
    default:
      return 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)';
  }
};

// Helper: get overlay for image templates
const getOverlay = (id) => {
  if (id.startsWith('img')) {
    return 'linear-gradient(120deg,rgba(0,0,0,0.25),rgba(0,0,0,0.15))';
  }
  return '';
};

const CardTemplates = {
  default: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  gradient1: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  gradient2: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  gradient3: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  gradient4: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  gradient5: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  pattern1: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-dashed border-indigo-500 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  pattern2: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-dotted border-pink-500 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  pattern3: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-double border-green-500 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  pattern4: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-solid border-yellow-500 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  pattern5: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-dashed border-purple-500 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  special1: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transform rotate-1 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  special2: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transform -rotate-1 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  special3: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transform scale-105 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  special4: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transform -scale-105 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  special5: ({ message, className = '' }) => (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transform skew-x-1 ${className}`}>
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  ),
  
  premium1: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  premium2: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  premium3: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  premium4: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  ),
  
  premium5: ({ message, className = '' }) => (
    <div className={`p-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-lg shadow-md ${className}`}>
      <p className="text-white">{message}</p>
    </div>
  )
};

export function MessageCard({ message, templateId = 'default', className = '', publicView = false, style = {} }) {
  const { language } = useLanguage();
  const Template = CardTemplates[templateId] || CardTemplates.default;
  const fontFamily = getFont(templateId, publicView);
  const background = getBackground(templateId);
  const overlay = getOverlay(templateId);
  // 16:9 aspect ratio (default)
  const aspectRatio = 16 / 9;
  const width = 400;
  const height = Math.round(width / aspectRatio);

  return (
    <div
      className={`relative rounded-2xl shadow-xl flex items-center justify-center text-center overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: background,
        fontFamily,
        fontSize: publicView ? '1.3rem' : '1.1rem',
        color: '#fff',
        ...style,
      }}
    >
      {/* Overlay for image templates */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlay,
            zIndex: 1,
          }}
        />
      )}
      <div
        className="w-full px-6 py-4 z-10 flex items-center justify-center"
        style={{
          textShadow: '0 2px 8px rgba(0,0,0,0.18)',
          fontWeight: 600,
          letterSpacing: '0.01em',
        }}
      >
        {message}
      </div>
    </div>
  );
}

export function getCardTemplate(id) {
  return {
    background: getBackground(id),
    fontFamily: getFont(id, false),
  };
}

export default CardTemplates; 