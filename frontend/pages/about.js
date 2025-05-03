import React from 'react';
import DeveloperProfile from '../components/DeveloperProfile';
import { useLanguage } from '../context/LanguageContext';
import Head from 'next/head';

const AboutPage = () => {
  const { language } = useLanguage();

  return (
    <>
      <Head>
        <title>{language === 'bn' ? 'সম্পর্কে | বার্তা' : 'About | Barta'}</title>
      </Head>
      
      <div className="max-w-4xl mx-auto pb-12">
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'বার্তা সম্পর্কে' : 'About Barta'}
          </h1>
          <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' 
              ? 'বার্তা হল একটি অনন্য বার্তা প্ল্যাটফর্ম যা আপনাকে বন্ধুদের কাছ থেকে বেনামী বার্তা পেতে সাহায্য করে। সুন্দর কার্ড টেমপ্লেট দিয়ে বার্তাগুলি দেখুন এবং সংরক্ষণ করুন।'
              : 'Barta is a unique messaging platform that helps you receive anonymous messages from friends. View and save messages with beautiful card templates.'}
          </p>
        </div>
        
        <div className="mb-12">
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'বার্তার বৈশিষ্ট্যসমূহ' : 'Features of Barta'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💬</div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'বেনামী বার্তা' : 'Anonymous Messages'}
              </h3>
              <p className={`text-gray-600 dark:text-gray-400 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn'
                  ? 'প্রেরক কে তা না জেনেই সৎ মতামত এবং বার্তা গ্রহণ করুন।'
                  : 'Receive honest feedback and messages without knowing the sender.'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'কাস্টম টেমপ্লেট' : 'Custom Templates'}
              </h3>
              <p className={`text-gray-600 dark:text-gray-400 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn'
                  ? '২০+ সুন্দর কার্ড নকশা থেকে বেছে নিন, যা আপনার ব্যক্তিত্বকে প্রতিফলিত করে।'
                  : 'Choose from 20+ beautiful card designs that reflect your personality.'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'দ্বিভাষিক সমর্থন' : 'Bilingual Support'}
              </h3>
              <p className={`text-gray-600 dark:text-gray-400 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn'
                  ? 'বাংলা এবং ইংরেজি উভয় ভাষাতেই অ্যাপ্লিকেশন ব্যবহার করুন।'
                  : 'Use the application in both Bengali and English languages.'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'ডেভেলপার' : 'Developer'}
          </h2>
          
          <DeveloperProfile />
        </div>
        
        <div>
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
          </h2>
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md text-center">
            <p className={`text-gray-600 dark:text-gray-400 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn'
                ? 'আমাদের দলের সাথে যোগাযোগ করতে বা সমস্যা রিপোর্ট করতে, নিচের ঠিকানায় যোগাযোগ করুন।'
                : 'To get in touch with our team or report an issue, contact us at the address below.'}
            </p>
            
            <a 
              href="mailto:contact@barta-app.com" 
              className="text-indigo-600 font-semibold text-lg hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              contact@barta-app.com
            </a>
            
            <div className="mt-8 flex justify-center space-x-6">
              <a 
                href="https://github.com/arpondark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/arpon11241" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/md-shazan-mahmud-arpon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage; 