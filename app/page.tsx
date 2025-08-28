"use client";

import HeroSection from '@/components/ui/HeroSection';
import TopProducts from '@/components/homepage/TopProducts';
import TrendingNews from '@/components/homepage/TrendingNews';
import SubscriptionCTA from '@/components/homepage/SubscriptionCTA';

export default function Home() {
  return (
    <main>
      <HeroSection
        title="Hire a Coder/Programmer for Your Projects"
        subtitle="Connect with expert developers to build your trading tools and strategies"
        ctaText="Start a Project"
        ctaLink="/hire"
      />
      
      <div className="container-padding section-spacing">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card-style">
                <h2 className="section-title">Top Performing Sales</h2>
                <TopProducts />
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              <div className="card-style">
                <h2 className="section-title">Trending News</h2>
                <TrendingNews />
              </div>
              
              <SubscriptionCTA />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
