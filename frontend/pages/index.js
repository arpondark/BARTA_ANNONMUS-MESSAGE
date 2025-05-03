import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const features = [
    {
      icon: '💬',
      titleEn: 'Anonymous Messages',
      titleBn: 'বেনামী বার্তা',
      descriptionEn: 'Receive honest feedback and messages from your friends without knowing who sent them.',
      descriptionBn: 'কে পাঠিয়েছে তা না জেনেই আপনার বন্ধুদের কাছ থেকে সৎ মতামত এবং বার্তা পান।'
    },
    {
      icon: '🎭',
      titleEn: 'Stylish Cards',
      titleBn: 'স্টাইলিশ কার্ড',
      descriptionEn: 'Choose from over 20 beautiful card designs to customize how your messages look.',
      descriptionBn: 'আপনার বার্তা কেমন দেখাবে তা কাস্টমাইজ করতে ২০টিরও বেশি সুন্দর কার্ড ডিজাইন থেকে বেছে নিন।'
    },
    {
      icon: '🖼️',
      titleEn: 'Save as Images',
      titleBn: 'ছবি হিসাবে সংরক্ষণ',
      descriptionEn: 'Export your favorite messages as beautiful images to share or keep.',
      descriptionBn: 'আপনার প্রিয় বার্তাগুলি সুন্দর ছবি হিসাবে রপ্তানি করুন যা শেয়ার করতে বা রাখতে পারেন।'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-16 pb-20">
          <div className="text-center">
            <div className="mx-auto mb-6">
              <Logo size="large" linkToHome={false} />
            </div>
            <h1 className={`text-4xl font-bold text-gray-900 dark:text-dark-text mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 
                'বন্ধুদের কাছ থেকে বেনামী বার্তা পান' : 
                'Get Anonymous Messages from Friends'
              }
            </h1>
            <p className={`max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 
                'বার্তা হল সহজেই আপনার বন্ধুদের কাছে বেনামী বার্তা পাঠাতে এবং পেতে একটি মজাদার উপায়।' : 
                'Barta is a fun way to easily send and receive anonymous messages from your friends.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link 
                  href="/profile" 
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                >
                  {language === 'bn' ? 'আপনার প্রোফাইল দেখুন' : 'View Your Profile'}
                </Link>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    {language === 'bn' ? 'এখনই যোগ দিন' : 'Join Now'}
                  </Link>
                  <Link 
                    href="/login" 
                    className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  >
                    {language === 'bn' ? 'লগইন করুন' : 'Login'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="pb-20">
          <h2 className={`text-3xl font-bold text-center text-gray-900 dark:text-dark-text mb-12 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'বার্তা এর বৈশিষ্ট্য' : 'Features of Barta'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold text-gray-900 dark:text-dark-text mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? feature.titleBn : feature.titleEn}
                </h3>
                <p className={`text-gray-600 dark:text-gray-300 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? feature.descriptionBn : feature.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="pb-20">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 text-center">
            <h2 className={`text-3xl font-bold text-white mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 'আজই বার্তা ব্যবহার শুরু করুন!' : 'Start Using Barta Today!'}
            </h2>
            <p className={`text-white text-opacity-90 mb-8 max-w-2xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' 
                ? 'আপনার বন্ধুদের কাছ থেকে সৎ এবং বেনামী প্রতিক্রিয়া পেতে, এবং স্টাইলিশ কার্ড টেমপ্লেট সহ সেগুলি সংরক্ষণ করতে আমাদের সাথে যোগ দিন।' 
                : 'Join us to get honest and anonymous feedback from your friends, and save them with stylish card templates.'
              }
            </p>
            
            {isAuthenticated ? (
              <Link 
                href="/messages" 
                className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors inline-block"
              >
                {language === 'bn' ? 'আপনার বার্তাগুলি দেখুন' : 'View Your Messages'}
              </Link>
            ) : (
              <Link 
                href="/register" 
                className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors inline-block"
              >
                {language === 'bn' ? 'ফ্রি তে সাইন আপ করুন' : 'Sign Up for Free'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 