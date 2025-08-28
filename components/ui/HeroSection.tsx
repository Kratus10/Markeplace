import React from 'react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  className?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  className,
  ctaText = 'Start a Project',
  ctaLink = '/hire'
}) => {
  return (
    <div className={clsx(
      'relative overflow-hidden rounded-3xl shadow-xl p-6 md:p-12 lg:p-16 min-h-[500px] flex items-center',
      className,
      'gradient-bg-diagonal' // Apply improved gradient background
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 right-20 w-60 h-60 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl text-center mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white drop-shadow-lg">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {ctaText && ctaLink && (
            <Button 
              href={ctaLink} 
              size="xl" 
              className="px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              {ctaText}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="xl" 
            className="px-8 py-4 text-lg font-medium bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
