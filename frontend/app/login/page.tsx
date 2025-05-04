'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token') || Cookies.get('token');
    const username = localStorage.getItem('username') || Cookies.get('username');

    if (token && username) {
      // User is already logged in, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username });
      // Store in both localStorage and cookies for better persistence
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      Cookies.set('token', response.data.token);
      Cookies.set('username', username);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card dark:bg-dark-card dark:border dark:border-dark-border">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-dark-text">Sign In</h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-primary hover:text-secondary">
            Don&apos;t have an account? Create one!
          </Link>
        </div>
      </div>
    </div>
  );
} 
