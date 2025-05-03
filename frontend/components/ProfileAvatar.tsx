'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserIcon } from './Icons';

export default function ProfileAvatar() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfilePicture(data.profilePicture || null);
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
          src={`http://localhost:5000${profilePicture}`}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-dark-border"
        />
      ) : (
        <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </Link>
  );
} 