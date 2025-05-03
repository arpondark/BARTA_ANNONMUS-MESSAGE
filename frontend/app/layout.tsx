'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import Notification from '@/components/Notification';
import { useState, useEffect } from 'react';
import ProfileAvatar from '@/components/ProfileAvatar';
import { LanguageProvider } from '../context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-dark-bg dark:text-dark-text`}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <header className="bg-white dark:bg-dark-card shadow-sm py-4 dark:border-b dark:border-dark-border">
                <div className="container mx-auto px-4 flex justify-between items-center">
                  <Link href="/" className="text-2xl font-bold text-primary">
                    বার্তা
                  </Link>
                  <nav className="flex items-center space-x-4">
                    {isLoggedIn ? (
                      <>
                        <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
                        <Link href="/profile" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Profile</Link>
                        <Notification />
                        <ProfileAvatar />
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
                        <Link href="/register" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Register</Link>
                      </>
                    )}
                    <ThemeToggle />
                  </nav>
                </div>
              </header>
              
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              
              <footer className="bg-white dark:bg-dark-card py-4 border-t dark:border-dark-border">
                <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                  &copy; {new Date().getFullYear()}বার্তা
                </div>
              </footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 