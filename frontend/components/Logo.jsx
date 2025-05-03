import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const Logo = ({ size = 'medium' }) => {
  const { language } = useLanguage();
  
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  };
  
  return (
    <Link href="/" className="flex items-center">
      <span className={`font-bold ${sizeClasses[size] || sizeClasses.medium} bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text`}>
        বার্তা
      </span>
      
      <span className={`ml-1 text-gray-600 dark:text-gray-400 ${
        size === 'small' ? 'text-sm' : 
        size === 'large' ? 'text-xl' : 
        'text-base'
      }`}>
        {language === 'bn' ? 'বেনামী বার্তা' : 'Anonymous Messages'}
      </span>
    </Link>
  );
};

export default Logo; 