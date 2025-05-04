import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import DarkModeToggle from './DarkModeToggle';
import Notification from './Notification';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [pathname, setPathname] = React.useState('');
  const [isMounted, setIsMounted] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = isMounted ? useRouter() : null;

  React.useEffect(() => {
    setIsMounted(true);
    setPathname(window.location.pathname);
  }, []);

  const handleLogout = () => {
    logout();
    if (router) {
      router.push('/login');
    } else {
      window.location.href = '/login';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClass = (path) => `px-3 py-2 rounded-md text-sm font-medium ${
    pathname === path 
      ? 'text-indigo-600 dark:text-indigo-400' 
      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
  }`;

  return (
    <header className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Logo size="medium" />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none touch-manipulation"
              aria-expanded={isMenuOpen ? "true" : "false"}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-3 lg:space-x-4 mr-3 lg:mr-4">
              <Link 
                href="/" 
                className={`${navLinkClass('/')} px-2 py-1.5 lg:px-3 lg:py-2 active:bg-gray-100 dark:active:bg-gray-800 touch-manipulation`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {t('home')}
              </Link>

              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className={`${navLinkClass('/dashboard')} px-2 py-1.5 lg:px-3 lg:py-2 active:bg-gray-100 dark:active:bg-gray-800 touch-manipulation`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Dashboard
                </Link>
              )}

              <Link 
                href="/about" 
                className={`${navLinkClass('/about')} px-2 py-1.5 lg:px-3 lg:py-2 active:bg-gray-100 dark:active:bg-gray-800 touch-manipulation`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {t('about')}
              </Link>
            </nav>

            <DarkModeToggle />
            <div className="mx-1 lg:mx-2"></div>
            <LanguageSwitcher />

            {isAuthenticated && (
              <>
                <div className="mx-1 lg:mx-2"></div>
                <Notification />
              </>
            )}

            <div className="ml-3 lg:ml-4 flex items-center">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/profile" 
                    className="mr-2 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover border-2 border-indigo-500 shadow"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-indigo-500 shadow">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1.5 lg:px-3 lg:py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 ml-2 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link 
                    href="/login" 
                    className={`px-2 py-1.5 lg:px-3 lg:py-2 rounded-md text-sm font-medium touch-manipulation ${
                      pathname === '/login' 
                        ? 'text-white bg-indigo-600 active:bg-indigo-800' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 active:bg-gray-100 dark:active:bg-gray-800'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    href="/register" 
                    className={`px-2 py-1.5 lg:px-3 lg:py-2 rounded-md text-sm font-medium touch-manipulation ${
                      pathname === '/register' 
                        ? 'text-white bg-indigo-600 active:bg-indigo-800' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 active:bg-gray-100 dark:active:bg-gray-800'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'} md:hidden fixed top-14 sm:top-16 left-0 right-0 z-40 bg-white dark:bg-dark-card shadow-lg transition-all duration-200 ease-out transform origin-top safe-area-inset-bottom`}
        style={{ 
          maxHeight: isMenuOpen ? 'calc(100vh - 3.5rem)' : '0', 
          overflow: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          overscrollBehavior: 'contain'
        }}
      >
        <div className="px-4 pt-3 pb-3 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href="/" 
            className={`block ${navLinkClass('/')} py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation`}
            onClick={() => setIsMenuOpen(false)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {t('home')}
          </Link>

          {isAuthenticated && (
            <Link 
              href="/dashboard" 
              className={`block ${navLinkClass('/dashboard')} py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation`}
              onClick={() => setIsMenuOpen(false)}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Dashboard
            </Link>
          )}

          <Link 
            href="/about" 
            className={`block ${navLinkClass('/about')} py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation`}
            onClick={() => setIsMenuOpen(false)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {t('about')}
          </Link>
        </div>

        <div className="pt-3 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col px-4">
            <div className="flex items-center justify-center space-x-6 py-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <DarkModeToggle />
              <LanguageSwitcher />
              {isAuthenticated && <Notification />}
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/profile" 
                  className="flex items-center justify-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500 shadow"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-indigo-500 shadow">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-base">{t('profile')}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/login" 
                  className={`w-full px-4 py-3 rounded-lg text-base font-medium text-center touch-manipulation ${
                    pathname === '/login' 
                      ? 'text-white bg-indigo-600 active:bg-indigo-800 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {t('login')}
                </Link>
                <Link 
                  href="/register" 
                  className={`w-full px-4 py-3 rounded-lg text-base font-medium text-center touch-manipulation ${
                    pathname === '/register' 
                      ? 'text-white bg-indigo-600 active:bg-indigo-800 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-dark-card shadow-inner py-6 sm:py-8 safe-bottom">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mobile-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <Logo size="small" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              © {new Date().getFullYear()} {language === 'bn' ? 'বার্তা' : 'Barta'}. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত' : 'All rights reserved'}.
            </p>
            <p className={`text-sm text-gray-500 dark:text-gray-400 mt-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' 
                ? 'বন্ধুদের কাছ থেকে বেনামী বার্তা পান' 
                : 'Get anonymous messages from friends'}
            </p>

            <div className="mt-4">
              <Link href="/about" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm">
                {t('about')}
              </Link>
            </div>
          </div>

          {/* Developer Info */}
          <div className="mt-4 md:mt-0">
            <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('developer')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">MD SHAZAN MAHMUD ARPON</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
            </p>

            <div className="flex space-x-4 mt-3">
              <a 
                href="https://github.com/arpondark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/arpon11241" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/md-shazan-mahmud-arpon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-4 md:mt-0">
            <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('contactUs')}
            </h3>
            <a 
              href="mailto:contact@barta-app.com" 
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors block mb-2"
            >
              contact@barta-app.com
            </a>

            <p className={`text-sm text-gray-600 dark:text-gray-400 mt-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' 
                ? 'সমস্যা রিপোর্ট করতে বা সাহায্য পেতে আমাদের সাথে যোগাযোগ করুন।' 
                : 'Contact us for bug reports or assistance.'}
            </p>

            <div className="mt-4">
              <a 
                href="https://github.com/arpondark" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                {language === 'bn' ? 'গিটহাব রিপোজিটরি' : 'GitHub Repository'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children, title = 'বার্তা | Anonymous Messaging' }) => {
  return (
    <LanguageProvider>
      <LayoutContent title={title}>
        {children}
      </LayoutContent>
    </LanguageProvider>
  );
};

const LayoutContent = ({ children, title }) => {
  // Add global styles for mobile optimization
  React.useEffect(() => {
    // Add a style tag for mobile-specific optimizations if it doesn't exist
    if (!document.getElementById('mobile-optimization-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'mobile-optimization-styles';
      styleTag.innerHTML = `
        /* Global mobile optimizations */
        html, body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: none;
          touch-action: manipulation;
        }

        /* Fix for notched devices like iPhone X and newer */
        @supports (padding: max(0px)) {
          body {
            padding-left: env(safe-area-inset-left, 0px);
            padding-right: env(safe-area-inset-right, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }

          .safe-bottom {
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
        }

        /* Specific optimizations for iPhone 12, 13, 14 and similar devices */
        @media screen and (device-width: 390px) and (device-height: 844px),
               screen and (device-width: 428px) and (device-height: 926px),
               screen and (device-width: 375px) and (device-height: 812px),
               /* iPhone 14, 14 Pro */
               screen and (device-width: 393px) and (device-height: 852px),
               screen and (device-width: 430px) and (device-height: 932px) {
          .nav-content {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }

          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }

          /* Dashboard specific optimizations for iPhone */
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.5rem !important;
          }

          .dashboard-card {
            padding: 0.75rem !important;
          }

          .dashboard-popup {
            width: 95% !important;
            padding: 1rem !important;
          }
        }

        /* Optimizations for Samsung Galaxy and other Android devices */
        @media screen and (min-width: 360px) and (max-width: 412px),
               /* Samsung Galaxy S21, S22, S23 */
               screen and (min-width: 360px) and (max-width: 412px) and (min-height: 780px) and (max-height: 915px) {
          .mobile-optimized {
            font-size: 0.95rem;
          }

          .mobile-padding {
            padding-left: 12px;
            padding-right: 12px;
          }

          /* Dashboard specific optimizations for Samsung */
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.5rem !important;
          }

          .dashboard-card {
            padding: 0.75rem !important;
          }

          .dashboard-popup {
            width: 95% !important;
            padding: 1rem !important;
          }
        }

        /* Prevent text size adjustment on orientation change */
        html {
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        /* Improve tap targets for all interactive elements */
        button, a, input, select, textarea {
          touch-action: manipulation;
        }

        /* Prevent pull-to-refresh on mobile */
        body {
          overscroll-behavior-y: contain;
        }

        /* Optimize images for high-DPI screens */
        img {
          max-width: 100%;
          height: auto;
        }
      `;
      document.head.appendChild(styleTag);
    }

    return () => {
      // Clean up on unmount
      const styleTag = document.getElementById('mobile-optimization-styles');
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Send and receive anonymous messages" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <NavBar />

        <main className="flex-grow py-4 sm:py-6">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mobile-padding">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Layout; 
