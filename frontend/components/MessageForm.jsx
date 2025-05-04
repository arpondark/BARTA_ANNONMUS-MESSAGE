import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCardTemplate, MessageCard } from './CardTemplates';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

const MessageForm = ({ username }) => {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const MAX_CHARS = 300;

  useEffect(() => {
    // Fetch user data to get their preferred card template
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/profile/${username}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setSelectedTemplate(userData.preferredCardTemplate || 'default');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error(language === 'bn' ? 'অনুগ্রহ করে একটি বার্তা লিখুন' : 'Please enter a message');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: username,
          content: message,
          cardTemplate: selectedTemplate,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success(language === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message sent successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || (language === 'bn' ? 'বার্তা পাঠাতে ব্যর্থ হয়েছে' : 'Failed to send message'));
      }
    } catch (error) {
      toast.error(language === 'bn' ? 'বার্তা পাঠানোর সময় একটি ত্রুটি ঘটেছে' : 'An error occurred while sending message');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const templateOptions = [
    { id: 'default', name: 'Default' },
    { id: 'gradient-purple', name: 'Purple Gradient' },
    { id: 'gradient-blue', name: 'Blue Ocean' },
    { id: 'sunshine', name: 'Sunshine' },
    { id: 'dark-elegance', name: 'Dark Elegance' },
    { id: 'nature', name: 'Nature' },
    { id: 'pastel-pink', name: 'Pastel Pink' },
    { id: 'vibrant-coral', name: 'Vibrant Coral' },
    { id: 'midnight-blue', name: 'Midnight Blue' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'neon', name: 'Neon' },
    { id: 'sky', name: 'Sky' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'galaxy', name: 'Galaxy' },
    { id: 'forest', name: 'Forest' },
    { id: 'beach', name: 'Beach' },
    { id: 'fire', name: 'Fire' },
    { id: 'ice', name: 'Ice' },
    { id: 'dark-mode', name: 'Dark Mode' },
  ];

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className={`text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t('messageSent')}
        </h2>
        <p className={`text-gray-600 dark:text-gray-400 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t('messageSentSuccess')}
        </p>
        <button
          onClick={() => {
            setMessage('');
            setSubmitted(false);
            setCharCount(0);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 mr-4">
          {user?.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={username}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h2 className={`text-xl font-bold text-gray-800 dark:text-gray-100 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? `@${username} কে পাঠান` : `Send to @${username}`}
          </h2>
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'আপনার বার্তা বেনামী থাকবে' : 'Your message will be anonymous'}
          </p>
        </div>
      </div>

      {/* Card Template Selection */}
      <div className="mb-4">
        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {language === 'bn' ? 'কার্ড স্টাইল নির্বাচন করুন' : 'Select Card Style'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {templateOptions.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-2 rounded-lg border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <MessageCard
                message={language === 'bn' ? 'আপনার বার্তা' : 'Your message'}
                templateId={template.id}
                className="w-full h-20 flex items-center justify-center text-xs"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <MessageCard 
            message={message || (language === 'bn' 
              ? `@${username} কে একটি বেনামী বার্তা পাঠান...` 
              : `Send an anonymous message to @${username}...`)}
            templateId={selectedTemplate}
            className="w-full relative"
          />

          <textarea
            value={message}
            onChange={handleChange}
            placeholder={language === 'bn' 
              ? `@${username} কে একটি বেনামী বার্তা পাঠান...` 
              : `Send an anonymous message to @${username}...`}
            className="w-full p-3 rounded-md resize-none border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 mt-4"
            rows={6}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {charCount}/{MAX_CHARS} {language === 'bn' ? 'অক্ষর' : 'characters'}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className={`w-full py-3 rounded-md transition ${
            isSubmitting || !message.trim()
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSubmitting 
            ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...') 
            : t('sendAnonymousMessage')
          }
        </button>
      </form>
    </div>
  );
};

export default MessageForm; 
