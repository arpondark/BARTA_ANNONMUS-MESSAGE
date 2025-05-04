'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BellIcon } from './Icons';
import { useRouter } from 'next/navigation';
import Toast from './Toast';

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  read: boolean;
  cardTemplate?: string;
}

export default function Notification() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Message[]>([]);
  const prevCount = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Function to fetch unread message count and recent messages
    const fetchNotifications = async () => {
      try {
        // Fetch unread count
        const countResponse = await axios.get('http://localhost:5000/api/messages/unread', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUnreadCount((prev) => {
          if (countResponse.data.count > prev) {
            setShowToast(true);
          }
          prevCount.current = countResponse.data.count;
          return countResponse.data.count;
        });

        // Fetch recent messages for the dropdown
        const messagesResponse = await axios.get('http://localhost:5000/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Sort by date and take the 5 most recent
        const sortedMessages = messagesResponse.data
          .sort((a: Message, b: Message) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setNotifications(sortedMessages);
      } catch (error) {
        // silent fail
      }
    };

    // Fetch initially
    fetchNotifications();

    // Set up polling interval (every 5 seconds for more frequent updates)
    const interval = setInterval(fetchNotifications, 5000);

    // Add click outside listener to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = (messageId: string) => {
    // Mark as read
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:5000/api/messages/mark-read', 
        { messageIds: [messageId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // Close dropdown and navigate to dashboard
    setShowDropdown(false);
    router.push('/dashboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
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

      {/* Notification Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-md shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification._id)}
                  className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {notification.content.length > 40 
                          ? notification.content.substring(0, 40) + '...' 
                          : notification.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setShowDropdown(false);
                router.push('/dashboard');
              }}
              className="w-full px-4 py-2 text-sm text-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}

      <Toast
        message="You have a new anonymous message!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
