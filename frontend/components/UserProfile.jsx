import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CardTemplateSelector, MessageCard } from './CardTemplates';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const UserProfile = ({ user, isCurrentUser }) => {
  const { t, language } = useLanguage();
  const [bio, setBio] = useState(user?.bio || '');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [selectedCardTemplate, setSelectedCardTemplate] = useState(user?.preferredCardTemplate || 'default');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setProfilePicture(user.profilePicture || '');
      setSelectedCardTemplate(user.preferredCardTemplate || 'default');
    }
  }, [user]);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleCardTemplateChange = (templateId) => {
    setSelectedCardTemplate(templateId);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If we're closing the edit mode, reset the values
      setBio(user?.bio || '');
      setSelectedCardTemplate(user?.preferredCardTemplate || 'default');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bio,
          preferredCardTemplate: selectedCardTemplate 
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        toast.success(language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!');
        // You might want to refresh the user data here
      } else {
        const data = await response.json();
        toast.error(data.message || (language === 'bn' ? 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে' : 'Failed to update profile'));
      }
    } catch (error) {
      toast.error(language === 'bn' ? 'প্রোফাইল আপডেট করার সময় একটি ত্রুটি ঘটেছে' : 'An error occurred while updating profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(language === 'bn' ? 'দয়া করে একটি ছবি ফাইল আপলোড করুন (JPEG, PNG, GIF)' : 'Please upload an image file (JPEG, PNG, GIF)');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('/api/users/profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profilePictureUrl);
        toast.success(language === 'bn' ? 'প্রোফাইল ছবি আপডেট করা হয়েছে!' : 'Profile picture updated!');
      } else {
        const error = await response.json();
        toast.error(error.message || (language === 'bn' ? 'প্রোফাইল ছবি আপলোড করতে ব্যর্থ হয়েছে' : 'Failed to upload profile picture'));
      }
    } catch (error) {
      toast.error(language === 'bn' ? 'আপলোড করার সময় একটি ত্রুটি ঘটেছে' : 'An error occurred while uploading');
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const shareLink = `${window.location.origin}/link/${user?.username}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => toast.success(language === 'bn' ? 'লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Link copied to clipboard!'))
      .catch(() => toast.error(language === 'bn' ? 'লিঙ্ক কপি করতে ব্যর্থ হয়েছে' : 'Failed to copy link'));
  };

  if (!user) {
    return <div className="text-center p-4">{language === 'bn' ? 'ব্যবহারকারী পাওয়া যায়নি' : 'User not found'}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white dark:bg-dark-card rounded-lg shadow-md">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={user.username}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          
          {isCurrentUser && (
            <label 
              htmlFor="profile-picture-upload" 
              className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1 rounded-full cursor-pointer"
              title={language === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন করুন' : 'Change profile picture'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input 
                type="file" 
                id="profile-picture-upload" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">@{user.username}</h1>
        
        {isEditing ? (
          <textarea
            value={bio}
            onChange={handleBioChange}
            placeholder={t('writeBio')}
            className="w-full p-2 border rounded-md mb-4 text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700"
            maxLength={160}
            rows={3}
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{bio || (language === 'bn' ? 'এখনও কোন পরিচিতি নেই' : 'No bio yet')}</p>
        )}

        {isCurrentUser && (
          <div className="w-full mb-4">
            {isEditing ? (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  {t('save')}
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  {t('cancel')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                {t('editProfile')}
              </button>
            )}
          </div>
        )}

        <div className="w-full p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mt-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{t('shareLink')}</h2>
          <div className="flex">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-grow p-2 border rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:border-gray-700"
            />
            <button
              onClick={copyShareLink}
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
            >
              {t('copy')}
            </button>
          </div>
        </div>

        {/* Preview the current card template */}
        <div className="w-full mt-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            {language === 'bn' ? 'আপনার বর্তমান কার্ড টেমপ্লেট' : 'Your Current Card Template'}
          </h2>
          <div className="mb-4">
            <MessageCard 
              message={language === 'bn' ? "এটি আপনার বার্তা কার্ডের প্রিভিউ। এটি দেখতে কেমন হবে তা দেখুন!" : "This is a preview of your message card. See how it will look!"}
              templateId={user?.preferredCardTemplate || 'default'}
              className="w-full"
            />
          </div>
        </div>

        {isCurrentUser && isEditing && (
          <div className="w-full mt-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">{t('chooseCardTemplate')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('cardTemplateDesc')}
            </p>
            <CardTemplateSelector 
              selectedTemplate={selectedCardTemplate} 
              onSelect={handleCardTemplateChange} 
            />
            
            {/* Show preview of selected template during editing */}
            {selectedCardTemplate !== user?.preferredCardTemplate && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'bn' ? 'নতুন টেমপ্লেট প্রিভিউ' : 'New Template Preview'}
                </h3>
                <MessageCard 
                  message={language === 'bn' ? "আপনার নতুন নির্বাচিত টেমপ্লেট এরকম দেখাবে!" : "Your newly selected template will look like this!"}
                  templateId={selectedCardTemplate}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 