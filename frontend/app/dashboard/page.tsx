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

    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages', {
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
          await axios.post('http://localhost:5000/api/messages/mark-read', 
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
      const response = await axios.post('http://localhost:5000/api/messages', {
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
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg text-white relative animate-fade-in">
          <button
            onClick={() => setShowWhatsNew(false)}
            className="absolute top-3 right-3 text-white text-xl hover:text-gray-200 focus:outline-none"
            aria-label="Dismiss What's New"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-2">🚀 What's New</h2>
          <ul className="list-disc pl-6 space-y-1 text-lg">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {cardTemplates.map((template) => (
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
      <div className="card dark:bg-dark-card dark:border dark:border-dark-border mb-8">
        <h3 className="text-xl font-semibold mb-4 dark:text-dark-text">Your Anonymous Link</h3>
        <div className="flex">
          <input
            type="text"
            value={`${window.location.origin}/link/${localStorage.getItem('username') || Cookies.get('username')}?template=${selectedTemplate}`}
            className="input flex-grow dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
            readOnly
          />
          <button
            onClick={handleCopyLink}
            className="btn-primary ml-2"
          >
            {linkCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Share this link with your friends to receive anonymous messages with your selected card style.
        </p>
      </div>

      {/* Message inbox section */}
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-6 dark:text-dark-heading">Your Inbox</h2>

        {messages.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-dark-card rounded-xl shadow-md">
            <p className="text-gray-600 dark:text-gray-400">No messages yet. Share your link to receive anonymous messages!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div key={msg._id} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
                <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>

                {/* Use the message's cardTemplate if available, otherwise default */}
                <MessageCard 
                  message={msg.content}
                  templateId={msg.cardTemplate || 'default'}
                  className="w-full mb-4"
                />

                <div className="flex justify-end">
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-3xl w-full relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
              onClick={() => setSelectedMessage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Message</h3>

            <div className="mb-6">
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

            <div className="flex justify-end">
              <MessageExport 
                message={selectedMessage} 
                templateId={selectedMessage.cardTemplate || 'default'} 
              />
              <span className="ml-2 text-xs text-gray-500 self-center">
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
