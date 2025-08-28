// FILE: app/profile/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { toast } from 'sonner';
import { UserCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ProfileSettingsPage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    gender: '',
    location: '',
    birthday: '',
    occupation: '',
    tradingExperience: '',
    avatar: '',
  });
  
  const [privacyData, setPrivacyData] = useState({
    showRole: true,
    showLocation: true,
    showOccupation: true,
    showBirthday: true,
    showTradingExperience: true,
    showAvatar: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status, router]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const result = await response.json();
      
      if (result.success) {
        setFormData({
          name: result.data.name || '',
          bio: result.data.bio || '',
          gender: result.data.gender || '',
          location: result.data.location || '',
          birthday: result.data.birthday || '',
          occupation: result.data.occupation || '',
          tradingExperience: result.data.tradingExperience || '',
          avatar: result.data.avatar || '',
        });
        
        setPrivacyData({
          showRole: result.data.showRole ?? true,
          showLocation: result.data.showLocation ?? true,
          showOccupation: result.data.showOccupation ?? true,
          showBirthday: result.data.showBirthday ?? true,
          showTradingExperience: result.data.showTradingExperience ?? true,
          showAvatar: result.data.showAvatar ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfileChanges = async () => {
    setSaving(true);
    
    try {
      // Save profile data
      const profileResponse = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const profileResult = await profileResponse.json();
      
      if (!profileResult.success) {
        throw new Error(profileResult.error || 'Failed to update profile');
      }
      
      // Save privacy settings
      const privacyResponse = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privacyData),
      });
      
      const privacyResult = await privacyResponse.json();
      
      if (!privacyResult.success) {
        throw new Error(privacyResult.error || 'Failed to update privacy settings');
      }
      
      // Update session
      await update();
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <Button 
            variant="primary" 
            onClick={saveProfileChanges}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      options={[
                        { value: '', label: 'Select Gender' },
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                        { value: 'Prefer not to say', label: 'Prefer not to say' }
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthday
                    </label>
                    <Input
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Location & Occupation */}
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Occupation</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation
                  </label>
                  <Input
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="Your occupation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Experience
                  </label>
                  <Select
                    name="tradingExperience"
                    value={formData.tradingExperience}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Select Experience Level' },
                      { value: 'Beginner', label: 'Beginner' },
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Advanced', label: 'Advanced' },
                      { value: 'Professional', label: 'Professional' }
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Avatar */}
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <Input
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="URL to your avatar image"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Upload an image or provide a URL to your avatar
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Privacy Settings Sidebar */}
          <div className="space-y-8">
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Role
                    </label>
                    <p className="text-sm text-gray-500">
                      Display your user role on your profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('showRole', !privacyData.showRole)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      privacyData.showRole ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        privacyData.showRole ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Location
                    </label>
                    <p className="text-sm text-gray-500">
                      Display your location on your profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('showLocation', !privacyData.showLocation)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      privacyData.showLocation ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        privacyData.showLocation ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Occupation
                    </label>
                    <p className="text-sm text-gray-500">
                      Display your occupation on your profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('showOccupation', !privacyData.showOccupation)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      privacyData.showOccupation ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        privacyData.showOccupation ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Birthday
                    </label>
                    <p className="text-sm text-gray-500">
                      Display your birthday on your profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('showBirthday', !privacyData.showBirthday)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      privacyData.showBirthday ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        privacyData.showBirthday ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Trading Experience
                    </label>
                    <p className="text-sm text-gray-500">
                      Display your trading experience on your profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('showTradingExperience', !privacyData.showTradingExperience)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      privacyData.showTradingExperience ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        privacyData.showTradingExperience ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Avatar
                    </label>
                    <p className="text-sm text-gray-500">
                      Display your avatar on your profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('showAvatar', !privacyData.showAvatar)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      privacyData.showAvatar ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        privacyData.showAvatar ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription</h2>
              <p className="text-gray-600 mb-4">
                Manage your subscription settings and billing information.
              </p>
              <Button 
                variant="outline" 
                onClick={() => router.push('/subscribe')}
                className="w-full"
              >
                Manage Subscription
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;