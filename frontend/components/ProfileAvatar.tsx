'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserIcon } from './Icons';
import { API_URL } from '../utils/config';
import axiosInstance from '../utils/axiosConfig';

export default function ProfileAvatar() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    axiosInstance.get('/profile')
      .then((res) => {
        setProfilePicture(res.data.profilePicture || null);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  return (
    <Link
      href="/profile"
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Profile"
    >
      {profilePicture ? (
        <img
          src={`${API_URL.replace('/api', '')}${profilePicture}`}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-dark-border"
        />
      ) : (
        <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </Link>
  );
} 