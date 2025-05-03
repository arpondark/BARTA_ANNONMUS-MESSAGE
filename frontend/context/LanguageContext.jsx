import React, { createContext, useContext, useState, useEffect } from 'react';

// Define our translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    messages: 'Messages',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    about: 'About',
    
    // Messages
    sendMessage: 'Send Message',
    sendAnonymousMessage: 'Send Anonymous Message',
    noMessagesYet: 'No Messages Yet',
    shareYourLink: 'Share your link with friends to get anonymous messages!',
    messageSent: 'Message Sent!',
    messageSentSuccess: 'Your anonymous message has been delivered.',
    sendAnother: 'Send Another Message',
    markRead: 'Mark as Read',
    saveImage: 'Save as Image',
    
    // Profile
    editProfile: 'Edit Profile',
    bio: 'Bio',
    writeBio: 'Write a short bio...',
    save: 'Save',
    cancel: 'Cancel',
    shareLink: 'Share your link',
    copy: 'Copy',
    chooseCardTemplate: 'Choose Your Card Template',
    cardTemplateDesc: 'Select a card design that others will see when they send you messages.',
    
    // Card Template
    chooseCardStyle: 'Choose Card Style',
    
    // About
    aboutUs: 'About Us',
    developer: 'Developer',
    contactUs: 'Contact Us',
    
    // Auth
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    default: 'Default',
    gradient1: 'Gradient 1',
    gradient2: 'Gradient 2',
    gradient3: 'Gradient 3',
    gradient4: 'Gradient 4',
    gradient5: 'Gradient 5',
    pattern1: 'Pattern 1',
    pattern2: 'Pattern 2',
    pattern3: 'Pattern 3',
    pattern4: 'Pattern 4',
    pattern5: 'Pattern 5',
    special1: 'Special 1',
    special2: 'Special 2',
    special3: 'Special 3',
    special4: 'Special 4',
    special5: 'Special 5',
    premium1: 'Premium 1',
    premium2: 'Premium 2',
    premium3: 'Premium 3',
    premium4: 'Premium 4',
    premium5: 'Premium 5',
  },
  bn: {
    // Navigation
    home: 'হোম',
    messages: 'বার্তাসমূহ',
    profile: 'প্রোফাইল',
    login: 'লগইন',
    register: 'নিবন্ধন',
    logout: 'লগআউট',
    about: 'সম্পর্কে',
    
    // Messages
    sendMessage: 'বার্তা পাঠান',
    sendAnonymousMessage: 'বেনামী বার্তা পাঠান',
    noMessagesYet: 'এখনও কোনো বার্তা নেই',
    shareYourLink: 'বেনামী বার্তা পেতে আপনার লিঙ্ক বন্ধুদের সাথে শেয়ার করুন!',
    messageSent: 'বার্তা পাঠানো হয়েছে!',
    messageSentSuccess: 'আপনার বেনামী বার্তা পৌঁছে দেওয়া হয়েছে।',
    sendAnother: 'আরেকটি বার্তা পাঠান',
    markRead: 'পঠিত হিসেবে চিহ্নিত করুন',
    saveImage: 'ছবি হিসেবে সংরক্ষণ করুন',
    
    // Profile
    editProfile: 'প্রোফাইল সম্পাদনা করুন',
    bio: 'পরিচিতি',
    writeBio: 'একটি সংক্ষিপ্ত পরিচিতি লিখুন...',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    shareLink: 'আপনার লিঙ্ক শেয়ার করুন',
    copy: 'কপি করুন',
    chooseCardTemplate: 'আপনার কার্ড টেমপ্লেট বেছে নিন',
    cardTemplateDesc: 'একটি কার্ড ডিজাইন নির্বাচন করুন যা অন্যরা দেখবে যখন তারা আপনাকে বার্তা পাঠাবে।',
    
    // Card Template
    chooseCardStyle: 'কার্ড স্টাইল নির্বাচন করুন',
    
    // About
    aboutUs: 'আমাদের সম্পর্কে',
    developer: 'ডেভেলপার',
    contactUs: 'যোগাযোগ করুন',
    
    // Auth
    username: 'ব্যবহারকারীর নাম',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    alreadyHaveAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    dontHaveAccount: 'অ্যাকাউন্ট নেই?',
    default: 'ডিফল্ট',
    gradient1: 'গ্রেডিয়েন্ট ১',
    gradient2: 'গ্রেডিয়েন্ট ২',
    gradient3: 'গ্রেডিয়েন্ট ৩',
    gradient4: 'গ্রেডিয়েন্ট ৪',
    gradient5: 'গ্রেডিয়েন্ট ৫',
    pattern1: 'প্যাটার্ন ১',
    pattern2: 'প্যাটার্ন ২',
    pattern3: 'প্যাটার্ন ৩',
    pattern4: 'প্যাটার্ন ৪',
    pattern5: 'প্যাটার্ন ৫',
    special1: 'বিশেষ ১',
    special2: 'বিশেষ ২',
    special3: 'বিশেষ ৩',
    special4: 'বিশেষ ৪',
    special5: 'বিশেষ ৫',
    premium1: 'প্রিমিয়াম ১',
    premium2: 'প্রিমিয়াম ২',
    premium3: 'প্রিমিয়াম ৩',
    premium4: 'প্রিমিয়াম ৪',
    premium5: 'প্রিমিয়াম ৫',
  }
};

// Create the Language Context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 