// FILE: components/admin/AdminL1Panel.tsx
"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

export default function AdminL1Panel() {
  const [activeTab, setActiveTab] = useState("moderation");
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch topics and categories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch topics
        const topicsResponse = await fetch('/api/forum/topics');
        const topicsData = await topicsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/forum/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (topicsData.ok) {
          setTopics(topicsData.topics);
        }
        
        if (categoriesData.ok) {
          setCategories(categoriesData.categories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle pinning/unpinning a topic
  const handlePinTopic = async (topicId, isPinned) => {
    try {
      const response = await fetch('/api/forum/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicId, isPinned: !isPinned }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the topics state with the new pinned status
        setTopics(topics.map(topic => 
          topic.id === topicId ? { ...topic, isPinned: !isPinned } : topic
        ));
      } else {
        console.error('Failed to update topic:', data.error);
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("moderation")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "moderation"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Moderation Queue
          </button>
          <button
            onClick={() => setActiveTab("subcategory")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "subcategory"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Subcategories
          </button>
          <button
            onClick={() => setActiveTab("topic-move")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "topic-move"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Featured Topics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "moderation" && (
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Moderation Queue</h2>
            <p className="text-slate-600 mb-4">Review and moderate user content</p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-500">Moderation queue functionality would be implemented here</p>
            </div>
          </Card>
        )}
        
        {activeTab === "subcategory" && (
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Subcategories</h2>
            <p className="text-slate-600 mb-4">Manage forum subcategories</p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-500">Subcategory management functionality would be implemented here</p>
            </div>
          </Card>
        )}
        
        {activeTab === "topic-move" && (
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Featured Topics</h2>
            <p className="text-slate-600 mb-4">Manage which topics appear on the homepage</p>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-bold">
                          {topic.isPinned ? '★' : '☆'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800">{topic.title}</h3>
                        <p className="text-sm text-slate-600">
                          by {topic.user?.name || topic.user?.username} • {topic.category?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePinTopic(topic.id, topic.isPinned)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        topic.isPinned
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {topic.isPinned ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}