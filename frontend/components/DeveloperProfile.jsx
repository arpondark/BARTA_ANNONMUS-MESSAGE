import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';

const DeveloperProfile = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-32 md:h-48"></div>
      
      <div className="relative px-6 pb-6">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative -mt-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-dark-card bg-white">
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-600 text-4xl font-bold">
              MA
            </div>
          </div>
          
          {/* Developer Info */}
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            MD SHAZAN MAHMUD ARPON
          </h2>
          
          <p className={`text-gray-600 dark:text-gray-400 mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'ফুলস্ট্যাক ডেভেলপার | বাংলাদেশ' : 'Fullstack Developer | Bangladesh'}
          </p>
          
          <div className="mt-5 flex flex-wrap justify-center gap-3 w-full">
            <a 
              href="https://github.com/arpondark" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            
            <a 
              href="https://www.facebook.com/arpon11241" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </a>
            
            <a 
              href="https://www.linkedin.com/in/md-shazan-mahmud-arpon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
          
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 w-full">
            <div className={`text-gray-800 dark:text-gray-200 ${language === 'bn' ? 'font-bengali' : ''}`}>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'bn' ? 'সম্পর্কে' : 'About'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'bn' 
                  ? 'কম্পিউটার সায়েন্সের শিক্ষার্থী এবং বাংলাদেশ থেকে একজন আগ্রহী ফুলস্ট্যাক ডেভেলপার। ওয়েবসাইট, মোবাইল অ্যাপ এবং আইওটি প্রজেক্ট তৈরি করি।'
                  : 'Computer Science student and passionate Fullstack Developer from Bangladesh. I build websites, mobile apps, and IoT projects.'
                }
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className={`font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'দক্ষতা' : 'Skills'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
                  Node.js
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
                  MongoDB
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
                  Next.js
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm">
                  Arduino
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href="mailto:contact@barta-app.com" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Me'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile; 