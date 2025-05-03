'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MessageCard } from '../../components/CardTemplates';
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
  { id: 'gradient1', name: 'Gradient 1' },
  { id: 'gradient2', name: 'Gradient 2' },
  { id: 'gradient3', name: 'Gradient 3' },
  { id: 'gradient4', name: 'Gradient 4' },
  { id: 'gradient5', name: 'Gradient 5' },
  { id: 'pattern1', name: 'Pattern 1' },
  { id: 'pattern2', name: 'Pattern 2' },
  { id: 'pattern3', name: 'Pattern 3' },
  { id: 'pattern4', name: 'Pattern 4' },
  { id: 'pattern5', name: 'Pattern 5' },
  { id: 'special1', name: 'Special 1' },
  { id: 'special2', name: 'Special 2' },
  { id: 'special3', name: 'Special 3' },
  { id: 'special4', name: 'Special 4' },
  { id: 'special5', name: 'Special 5' },
  { id: 'premium1', name: 'Premium 1' },
  { id: 'premium2', name: 'Premium 2' },
  { id: 'premium3', name: 'Premium 3' },
  { id: 'premium4', name: 'Premium 4' },
  { id: 'premium5', name: 'Premium 5' },
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
  const router = useRouter();

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
        setMessages(response.data);
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
    fetchMessages();
  }, [router]);

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
    <div className="max-w-3xl mx-auto">
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

      {/* Received Messages */}
      <div className="space-y-8">
        {messages.length === 0 ? (
          <div className="card dark:bg-dark-card dark:border dark:border-dark-border text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Share your link to get some!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex flex-col items-center justify-center card dark:bg-dark-card dark:border dark:border-dark-border ${!message.read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="relative mb-2">
                <MessageCard
                  message={message.content}
                  templateId={message.cardTemplate || selectedTemplate}
                  className="mb-2"
                  style={{
                    width: '350px',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                  }}
                />
                <div className="absolute top-2 right-2">
                  <MessageExport message={message} templateId={message.cardTemplate || selectedTemplate} />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Link with selected template */}
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
    </div>
  );
} 