import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { MessageCard } from './CardTemplates';
import MessageExport from './MessageExport';
import { useLanguage } from '../context/LanguageContext';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          toast.error(language === 'bn' ? 'বার্তা লোড করতে ব্যর্থ হয়েছে' : 'Failed to load messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error(language === 'bn' ? 'বার্তা লোড করার সময় একটি ত্রুটি ঘটেছে' : 'An error occurred while loading messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [language]);

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, isRead: true } : msg
        ));
        toast.success(language === 'bn' ? 'বার্তা পঠিত হিসাবে চিহ্নিত করা হয়েছে' : 'Message marked as read');
      } else {
        toast.error(language === 'bn' ? 'বার্তা আপডেট করতে ব্যর্থ হয়েছে' : 'Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error(language === 'bn' ? 'বার্তা আপডেট করার সময় একটি ত্রুটি ঘটেছে' : 'An error occurred while updating message');
    }
  };

  const toggleMessageExport = (message) => {
    if (selectedMessage && selectedMessage._id === message._id) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(message);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
        <div className="text-4xl mb-4">📭</div>
        <h2 className={`text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t('noMessagesYet')}
        </h2>
        <p className={`text-gray-600 dark:text-gray-400 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t('shareYourLink')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card Template Selection */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
        <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t('chooseCardStyle')}
        </h3>
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
                {t(template.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {messages.map((message) => (
        <div key={message._id} className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <MessageCard 
              message={message.content} 
              templateId={message.cardTemplate || selectedTemplate} 
            />

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(message.createdAt), 'MMM d, yyyy - h:mm a')}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleMessageExport(message)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  aria-label={language === 'bn' ? 'ছবি হিসাবে সংরক্ষণ করুন' : 'Save as image'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('saveImage')}
                </button>
                {!message.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(message._id)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    aria-label={language === 'bn' ? 'পঠিত হিসাবে চিহ্নিত করুন' : 'Mark as read'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('markRead')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedMessage && selectedMessage._id === message._id && (
            <div className="border-t border-gray-100 dark:border-gray-700">
              <MessageExport message={message} templateId={message.cardTemplate || selectedTemplate} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList; 
