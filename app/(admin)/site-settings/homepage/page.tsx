'use client';

import { useState } from 'react';
import HeroSection from '@/components/ui/HeroSection';

type AssetType = 'lottie' | 'mp4' | 'static';

const HomepageSettingsPage = () => {
  const [heroAsset, setHeroAsset] = useState<AssetType>('lottie');
  const [topProductsAsset, setTopProductsAsset] = useState<AssetType>('lottie');
  const [trendingNewsAsset, setTrendingNewsAsset] = useState<AssetType>('lottie');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Homepage Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section Controls */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Hero Section Asset</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Asset Type</label>
            <div className="flex space-x-4">
              {(['lottie', 'mp4', 'static'] as AssetType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setHeroAsset(type)}
                  className={`px-4 py-2 rounded-md ${
                    heroAsset === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Current URL:</h3>
            <div className="bg-white border border-gray-300 rounded-md p-2 text-sm break-all">
              {heroAsset === 'lottie' 
                ? 'https://assets.lottiefiles.com/packages/lf20_xxx-gradient.json' 
                : heroAsset === 'mp4'
                ? 'https://www.pexels.com/video/xxx.mp4'
                : '/hero-static.svg'}
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Set Custom URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Paste new asset URL"
              />
              <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                Update
              </button>
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
            <HeroSection 
              title="Preview Title" 
              subtitle="This is a preview subtitle for the hero section." 
            />
            <div className="p-4 bg-gray-50 text-center text-gray-500">
              Preview updates in real-time as settings change
            </div>
          </div>
        </div>
        
        {/* Top Products Controls */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Top Products Assets</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Product Card GIF</label>
            <div className="flex space-x-4">
              {(['lottie', 'mp4', 'static'] as AssetType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setTopProductsAsset(type)}
                  className={`px-4 py-2 rounded-md ${
                    topProductsAsset === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Current GIF URL:</h3>
            <div className="bg-white border border-gray-300 rounded-md p-2 text-sm break-all">
              https://dribbble.com/shots/17335977-Website-Hero-Section-Animated-Gif
            </div>
          </div>
        </div>
        
        {/* Trending News Controls */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Trending News Assets</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Card Animation</label>
            <div className="flex space-x-4">
              {(['lottie', 'mp4', 'static'] as AssetType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setTrendingNewsAsset(type)}
                  className={`px-4 py-2 rounded-md ${
                    trendingNewsAsset === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Current Animation URL:</h3>
            <div className="bg-white border border-gray-300 rounded-md p-2 text-sm break-all">
              https://assets.lottiefiles.com/packages/lf20_xxx-particles.json
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageSettingsPage;
