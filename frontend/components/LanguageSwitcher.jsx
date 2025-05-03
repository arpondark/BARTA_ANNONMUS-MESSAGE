import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
          language === 'en' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('bn')}
        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
          language === 'bn' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        aria-label="Switch to Bengali"
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageSwitcher; 