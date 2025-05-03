'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CameraIcon } from '@/components/Icons';

interface Profile {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
  allowNotifications: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState('');
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(response.data);
        setBio(response.data.bio || '');
        setAllowNotifications(response.data.allowNotifications);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile',
        { bio, allowNotifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile(response.data);
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    setUploadingPhoto(true);
    setError('');

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/profile/upload-photo',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setProfile({
        ...profile!,
        profilePicture: response.data.profilePicture
      });
      
      setSelectedFile(null);
      
      // Clear the file input
      const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="card dark:bg-dark-card dark:border dark:border-dark-border mb-8">
        <div className="flex items-center mb-6">
          <div className="relative mr-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {profile?.profilePicture ? (
                <img 
                  src={`http://localhost:5000${profile.profilePicture}`} 
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <CameraIcon className="h-10 w-10" />
                </div>
              )}
            </div>
            <label 
              htmlFor="profilePicture" 
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer shadow-md"
            >
              <CameraIcon className="h-4 w-4" />
            </label>
            <input 
              type="file" 
              id="profilePicture" 
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold dark:text-dark-text">{profile?.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined {new Date(profile?.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Selected file: {selectedFile.name}
              </span>
              <button
                onClick={handleUpload}
                disabled={uploadingPhoto}
                className="btn-primary text-xs py-1"
              >
                {uploadingPhoto ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              className="input dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
            ></textarea>
            <p className="text-sm text-right text-gray-500 dark:text-gray-400">
              {bio.length}/160
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allowNotifications}
                onChange={(e) => setAllowNotifications(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Receive message notifications
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
} 