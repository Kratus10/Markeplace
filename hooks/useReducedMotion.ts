import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Based on the prefers-reduced-motion media query
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 */
const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches);

      // Listen for changes
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };

      // Add listener for older browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }

      // Cleanup
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;
