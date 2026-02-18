import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Layout constants that adapt to screen size
export function useResponsiveLayout() {
  const isMobile = useMobile();
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate responsive values
  const layout = {
    isMobile,
    // Intersection point (where category bar and item list meet)
    intersectionX: isMobile ? 15 : 25, // percent from left
    intersectionY: isMobile ? Math.min(180, dimensions.height * 0.25) : 260, // pixels from top
    // Category bar
    categoryIconSize: isMobile ? 60 : 100,
    categorySpacing: isMobile ? 90 : 160,
    // Item list
    itemSpacing: isMobile ? 60 : 85,
    belowBarGap: isMobile ? 50 : 80,
    // Detail panel
    detailPanelWidth: isMobile ? '100%' : '50%',
    // Font sizes
    itemFontSize: isMobile ? 14 : 17,
    subtitleFontSize: isMobile ? 10 : 12,
  };

  return layout;
}
