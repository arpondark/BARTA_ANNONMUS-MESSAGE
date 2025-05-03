'use client';

import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { MessageCard } from '../../../components/CardTemplates';

export default function MessageLink() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const username = params.username as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/messages', {
        username,
        content: message
      });
      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className="rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-center mb-8"
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
            <h2 className="text-2xl font-bold text-primary mb-4">Message Sent!</h2>
            <p className="mb-6 dark:text-dark-text">Your anonymous message has been delivered.</p>
            <button 
              onClick={() => setSubmitted(false)} 
              className="btn-primary"
            >
              Send Another
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center dark:text-dark-text">Send Anonymous Message</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              to <span className="font-semibold">{username}</span>
            </p>
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative flex flex-col items-center">
                <MessageCard
                  message={message || 'Type your anonymous message here...'}
                  templateId={'gradient1'}
                  publicView={true}
                  className="w-full"
                  style={{
                    width: '350px',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    padding: 0,
                  }}
                />
                <textarea
                  className="absolute top-0 left-0 w-full h-full p-6 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-transparent text-gray-800 text-lg font-semibold placeholder-gray-400 resize-none"
                  style={{
                    fontFamily: 'inherit',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: '#6366f1',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    width: '350px',
                    height: '180px',
                    zIndex: 2,
                  }}
                  placeholder="Type your anonymous message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={500}
                  spellCheck={false}
                  autoFocus
                />
                <div className="absolute bottom-2 right-4 text-xs text-gray-500 z-10">
                  {message.length}/500
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading || message.trim() === ''}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          This message will be sent anonymously.
          <br />
          {username} will not know who sent it.
        </p>
      </div>
    </div>
  );
} 