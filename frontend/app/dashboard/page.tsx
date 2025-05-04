'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MessageCard, cardTemplates } from '../../components/CardTemplates';
import MessageExport from '../../components/MessageExport';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  read: boolean;
  cardTemplate?: string;
}

// Using cardTemplates imported from CardTemplates.jsx

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const previousMessagesRef = useRef<Message[]>([]);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSoundRef.current = new Audio('/notification.mp3');
    }
  }, []);

  // Fetch messages and set up polling
  useEffect(() => {
    // Use both cookies and localStorage for session
    let token = localStorage.getItem('token') || Cookies.get('token');
    let username = localStorage.getItem('username') || Cookies.get('username');
    if (!token || !username) {
      router.push('/login');
      return;
    }
    // Save to both for future
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    Cookies.set('token', token);
    Cookies.set('username', username);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Check for new messages
        if (previousMessagesRef.current.length > 0) {
          const newMessages = response.data.filter(
            (newMsg: Message) => !previousMessagesRef.current.some(
              (oldMsg: Message) => oldMsg._id === newMsg._id
            )
          );

          // Show notifications for new messages
          if (newMessages.length > 0 && notificationEnabled) {
            newMessages.forEach((msg: Message) => {
              toast.success(
                <div onClick={() => setSelectedMessage(msg)} className="cursor-pointer">
                  <div>You received a new message!</div>
                  <div className="text-xs mt-1">Click to view with selected card style</div>
                </div>, 
                {
                  duration: 5000,
                  icon: '📩',
                }
              );
            });

            // Play notification sound
            if (notificationSoundRef.current) {
              notificationSoundRef.current.play().catch(err => {
                console.error('Error playing notification sound:', err);
              });
            }
          }
        }

        // Update messages and reference
        setMessages(response.data);
        previousMessagesRef.current = response.data;

        // Mark unread messages as read
        const unreadMessageIds = response.data
          .filter((msg: Message) => !msg.read)
          .map((msg: Message) => msg._id);
        if (unreadMessageIds.length > 0) {
          await axios.post(`${apiUrl}/messages/mark-read`, 
            { messageIds: unreadMessageIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchMessages, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [router, notificationEnabled]);

  const handleCopyLink = () => {
    const username = localStorage.getItem('username') || Cookies.get('username');
    const link = `${window.location.origin}/link/${username}?template=${selectedTemplate}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    Cookies.remove('token');
    Cookies.remove('username');
    router.push('/login');
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await axios.delete(`${apiUrl}/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setMessages(messages.filter(msg => msg._id !== messageId));
          if (selectedMessage && selectedMessage._id === messageId) {
            setSelectedMessage(null);
          }
          toast.success('Message deleted successfully');
        } else {
          toast.error('Failed to delete message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('An error occurred while deleting message');
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || Cookies.get('token');
      const username = localStorage.getItem('username') || Cookies.get('username');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/messages`, {
        recipient: username,
        content: message,
        cardTemplate: selectedTemplate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        toast.success('Message sent successfully!');
        setMessage('');
        // Optionally refresh messages
        setMessages(prev => [response.data, ...prev]);
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred while sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Dashboard Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-dark-text">Dashboard</h1>
      </div>

      {/* What's New Section */}
      {showWhatsNew && (
        <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg text-white relative animate-fade-in">
          <button
            onClick={() => setShowWhatsNew(false)}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white text-xl hover:text-gray-200 focus:outline-none"
            aria-label="Dismiss What's New"
          >
            &times;
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">🚀 What's New</h2>
          <ul className="list-disc pl-4 sm:pl-6 space-y-0.5 sm:space-y-1 text-base sm:text-lg">
            <li><b>Real-time Notifications:</b> Get instant notifications with sound when you receive new messages!</li>
            <li><b>20+ Stylish Card Templates:</b> Choose from a variety of beautiful card designs for your messages.</li>
            <li><b>Card Preview & Selection:</b> Instantly preview and select your favorite card style before sending or saving.</li>
            <li><b>Save as Image:</b> Export any message as a high-quality image with the card design.</li>
            <li><b>Bengali & English Support:</b> Use the app in your preferred language.</li>
            <li><b>Dark Mode:</b> Enjoy all features in both light and dark themes.</li>
          </ul>
        </div>
      )}

      {/* Card Template Selection for Sending */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Card Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 dashboard-grid">
          {cardTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-2 rounded-lg border-2 transition-all dashboard-card ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <MessageCard
                message={"Your message"}
                templateId={template.id}
                className="w-full h-16 flex items-center justify-center text-xs"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Link with selected template - Moved here after template selector */}
      <div className="card dark:bg-dark-card dark:border dark:border-dark-border mb-6 sm:mb-8 p-4 sm:p-5 rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-dark-text">Your Anonymous Link</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="text"
            value={`${window.location.origin}/link/${localStorage.getItem('username') || Cookies.get('username')}?template=${selectedTemplate}`}
            className="input flex-grow dark:bg-dark-bg dark:border-dark-border dark:text-dark-text text-sm sm:text-base py-2 px-3 rounded-md w-full"
            readOnly
          />
          <button
            onClick={handleCopyLink}
            className="btn-primary sm:ml-2 py-2 px-4 rounded-md touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {linkCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Share this link with your friends to receive anonymous messages with your selected card style.
        </p>
      </div>

      {/* Message inbox section */}
      <div className="my-6 sm:my-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 dark:text-dark-heading">Your Inbox</h2>

        {messages.length === 0 ? (
          <div className="text-center p-4 sm:p-8 bg-white dark:bg-dark-card rounded-xl shadow-md">
            <p className="text-gray-600 dark:text-gray-400">No messages yet. Share your link to receive anonymous messages!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {messages.map((msg) => (
              <div key={msg._id} className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-md dashboard-card">
                <div className="mb-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>

                {/* Use the message's cardTemplate if available, otherwise default */}
                <MessageCard 
                  message={msg.content}
                  templateId={msg.cardTemplate || 'default'}
                  className="w-full mb-3 sm:mb-4"
                />

                <div className="flex flex-wrap justify-between items-center gap-2">
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="text-red-500 hover:text-red-700 py-1 px-2 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Delete
                  </button>

                  <MessageExport
                    message={msg}
                    templateId={msg.cardTemplate || 'default'}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Popup */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 sm:p-6 max-w-3xl w-full relative dashboard-popup">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 touch-manipulation" 
              onClick={() => setSelectedMessage(null)}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold mb-3 sm:mb-4 dark:text-gray-200">Message</h3>

            <div className="mb-4 sm:mb-6">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <MessageCard
                  message={selectedMessage.content}
                  templateId={selectedMessage.cardTemplate || 'default'}
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
                  publicView={true}
                  showEmoji={true}
                />
                {/* Debug info - remove in production */}
                <div className="absolute bottom-0 right-0 text-xs text-gray-500 bg-white bg-opacity-70 px-1 rounded">
                  Template: {selectedMessage.cardTemplate || selectedTemplate}
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <MessageExport 
                message={selectedMessage} 
                templateId={selectedMessage.cardTemplate || 'default'} 
              />
              <button 
                onClick={() => handleDeleteMessage(selectedMessage._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Delete
              </button>
              <span className="w-full text-right text-xs text-gray-500 mt-1">
                Using template: {selectedMessage.cardTemplate || 'default'}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

    </div>
  );
} 
