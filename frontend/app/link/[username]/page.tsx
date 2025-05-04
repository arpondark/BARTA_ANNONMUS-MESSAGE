'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { MessageCard } from '../../../components/CardTemplates';
import { useLanguage } from '../../../context/LanguageContext';

export default function MessageLink() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const templateId = searchParams.get('template') || 'gradient-purple';
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/messages', {
        username,
        content: message,
        cardTemplate: templateId
      });
      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || t('failedToSendMessage') || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div
        className="rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-center mb-8 dark:bg-dark-card"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          border: '2.5px solid #a5b4fc',
          fontFamily: '"Quicksand", "Inter", Arial, sans-serif',
          boxShadow: '0 8px 32px 0 rgba(80,80,180,0.10), 0 1.5px 6px 0 rgba(80,80,180,0.10)',
          transition: 'all 0.3s',
        }}
      >
        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t('messageSent') || 'Message Sent!'}</h2>
            <button 
              onClick={() => setSubmitted(false)} 
              className="btn-primary"
            >
              {t('sendAnother') || 'Send Another'}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center dark:text-gray-800">{t('sendAnonymousMessage') || 'Send Anonymous Message'}</h2>
            <p className="text-center text-gray-600 dark:text-gray-800 mb-6">
              {t('to') || 'to'} <span className="font-semibold">{username}</span>
            </p>
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 w-full">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full flex justify-center mb-6">
                {/* Card container with consistent size */}
                <div className="relative w-full" style={{ 
                  maxWidth: '540px',
                  aspectRatio: '16/9'
                }}>
                  {/* MessageCard as visual background */}
                  <div className="absolute inset-0">
                    <MessageCard
                      message={message || t('typeYourMessage') || 'Type your anonymous message here...'}
                      templateId={templateId}
                      publicView={true}
                      className="w-full h-full"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                  </div>

                  {/* Textarea overlay */}
                  <textarea
                    className="absolute inset-0 w-full h-full p-6 border-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-transparent text-transparent placeholder-transparent resize-none"
                    style={{
                      caretColor: '#6366f1',
                      zIndex: 2,
                    }}
                    placeholder={t('typeYourMessage') || 'Type your anonymous message here...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={500}
                    spellCheck={false}
                    autoFocus
                  />

                  {/* Character counter */}
                  <div className="absolute bottom-2 right-4 text-xs text-gray-200 z-10" style={{textShadow:'0 2px 8px rgba(0,0,0,0.18)'}}>
                    {message.length}/500
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary max-w-xs w-full mx-auto block"
                disabled={loading || message.trim() === ''}
              >
                {loading ? (t('sending') || 'Sending...') : (t('sendMessage') || 'Send Message')}
              </button>
            </form>
          </>
        )}
      </div>
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          {t('anonymousNote') || 'This message will be sent anonymously.'}
          <br />
          {username} {t('willNotKnow') || 'will not know who sent it.'}
        </p>
      </div>
    </div>
  );
} 
