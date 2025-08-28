'use client';

import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg">
          {content}
          <div className="absolute w-0 h-0 border-solid border-transparent border-t-gray-800 border-4 left-1/2 transform -translate-x-1/2 top-full"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
