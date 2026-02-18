import { useEffect, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
}

interface SwipeOptions {
  threshold?: number; // minimum distance to trigger swipe
  velocityThreshold?: number; // minimum velocity for quick swipes
  enabled?: boolean;
}

export function useSwipeGestures(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const { threshold = 50, velocityThreshold = 0.3, enabled = true } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchMoveRef.current = null;
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current) return;
    const touch = e.touches[0];
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }, [enabled]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchStartRef.current) return;

    const start = touchStartRef.current;
    const end = touchMoveRef.current || start;
    const elapsed = Date.now() - start.time;

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Calculate velocity (pixels per millisecond)
    const velocityX = absX / elapsed;
    const velocityY = absY / elapsed;

    // Check for tap (minimal movement)
    if (absX < 10 && absY < 10) {
      handlers.onTap?.();
      touchStartRef.current = null;
      touchMoveRef.current = null;
      return;
    }

    // Determine if it's a valid swipe
    const isHorizontalSwipe = absX > absY;
    const swipeDistance = isHorizontalSwipe ? absX : absY;
    const swipeVelocity = isHorizontalSwipe ? velocityX : velocityY;

    // Check if swipe meets threshold or velocity requirement
    if (swipeDistance >= threshold || swipeVelocity >= velocityThreshold) {
      if (isHorizontalSwipe) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    touchStartRef.current = null;
    touchMoveRef.current = null;
  }, [enabled, threshold, velocityThreshold, handlers]);

  useEffect(() => {
    if (!enabled) return;

    // Use passive: false to allow preventDefault if needed
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
