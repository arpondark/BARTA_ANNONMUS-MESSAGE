'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BellIcon } from './Icons';
import { useRouter } from 'next/navigation';
import Toast from './Toast';

export default function Notification() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const prevCount = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Function to fetch unread message count
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages/unread', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount((prev) => {
          if (response.data.count > prev) {
            setShowToast(true);
          }
          prevCount.current = response.data.count;
          return response.data.count;
        });
      } catch (error) {
        // silent fail
      }
    };

    // Fetch initially
    fetchUnreadCount();

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      <Toast
        message="You have a new anonymous message!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
} 