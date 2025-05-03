import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { LanguageProvider } from '../context/LanguageContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  // When mounted on client, we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthProvider>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#8B5CF6" />
        {/* Script to check for dark mode preference before page loads to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check localStorage first
                var savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  // If no saved preference, check system preference
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="bottom-center" />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp; 