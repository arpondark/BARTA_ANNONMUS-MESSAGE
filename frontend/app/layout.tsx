'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-dark-bg dark:text-dark-text`}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Layout>
                {children}
              </Layout>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
