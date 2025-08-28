"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TrendingNews() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const response = await fetch('/api/forum/trending');
        const data = await response.json();
        
        if (data.ok) {
          setTopics(data.topics);
        }
      } catch (error) {
        console.error('Error fetching trending topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  if (loading) {
    return (
      <div className="feature-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Trending News</h3>
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Live</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start p-3 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="feature-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Trending News</h3>
        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Live</span>
      </div>
      <ul className="space-y-4">
        {topics.map((topic, index) => (
          <li key={topic.id} className="flex items-start group hover:bg-gray-50 p-3 rounded-lg transition-all duration-200">
            <div className="flex-shrink-0 mt-1">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs font-bold">
                {index + 1}
              </div>
            </div>
            <div className="ml-3">
              <Link href={`/forum/topic/${topic.id}`} className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {topic.title}
              </Link>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {topic.content.substring(0, 100)}...
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-500">
                  by {topic.user?.name || topic.user?.username}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {topic.category?.name}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link href="/forum" className="w-full py-3 text-center text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors duration-200 block">
          View All Forum Topics
        </Link>
      </div>
    </div>
  );
}