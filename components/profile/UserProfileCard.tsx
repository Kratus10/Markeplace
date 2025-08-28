// FILE: components/profile/UserProfileCard.tsx
import React from 'react';
import { UserCircleIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, BriefcaseIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  gender: string | null;
  location: string | null;
  birthday: string | null;
  occupation: string | null;
  tradingExperience: string | null;
  role: string;
  isPremium: boolean;
  createdAt: string;
  showRole: boolean;
  showLocation: boolean;
  showOccupation: boolean;
  showBirthday: boolean;
  showTradingExperience: boolean;
  showAvatar: boolean;
}

interface UserProfileCardProps {
  user: UserProfile;
  currentUser?: UserProfile | null; // Current logged-in user
  isOwnProfile?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, currentUser, isOwnProfile = false }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canViewField = (fieldVisible: boolean, isCurrentUser: boolean = false) => {
    // If it's the user's own profile, they can always see their info
    if (isOwnProfile) return true;
    
    // If user is looking at their own profile
    if (isCurrentUser) return true;
    
    // Otherwise respect privacy settings
    return fieldVisible;
  };

  const canViewPrivateInfo = () => {
    // Users can see their own private info
    if (isOwnProfile) return true;
    
    // Admins can see private info
    if (currentUser?.role === 'ADMIN') return true;
    
    return false;
  };

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
      <div className="flex flex-col items-center">
        {canViewField(user.showAvatar, isOwnProfile) && user.avatar ? (
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="h-24 w-24 text-gray-400" />
        )}
        
        <h2 className="text-xl font-semibold mt-4">
          {user.name || user.username || 'No name set'}
        </h2>
        
        <p className="text-gray-500 flex items-center mt-2">
          <EnvelopeIcon className="h-4 w-4 mr-2" />
          {user.email}
        </p>
        
        {canViewField(user.showRole, isOwnProfile) && (
          <div className="mt-3">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800' 
                : user.isPremium 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.role === 'ADMIN' ? 'Admin' : user.isPremium ? 'Premium Member' : 'Member'}
            </span>
          </div>
        )}
        
        {canViewField(user.showLocation, isOwnProfile) && user.location && (
          <p className="text-gray-500 flex items-center mt-3">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {user.location}
          </p>
        )}
        
        {user.gender && canViewPrivateInfo() && (
          <p className="text-gray-500 flex items-center mt-2">
            <UserCircleIcon className="h-4 w-4 mr-2" />
            {user.gender}
          </p>
        )}
        
        {canViewField(user.showBirthday, isOwnProfile) && user.birthday && (
          <p className="text-gray-500 flex items-center mt-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {formatDate(user.birthday)}
          </p>
        )}
        
        {canViewField(user.showOccupation, isOwnProfile) && user.occupation && (
          <p className="text-gray-500 flex items-center mt-2">
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            {user.occupation}
          </p>
        )}
        
        {canViewField(user.showTradingExperience, isOwnProfile) && user.tradingExperience && (
          <p className="text-gray-500 flex items-center mt-2">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            {user.tradingExperience}
          </p>
        )}
        
        {user.bio && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full">
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          Member since {formatDate(user.createdAt)}
        </p>
      </div>
    </Card>
  );
};

export default UserProfileCard;