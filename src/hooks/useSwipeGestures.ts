import { useEffect, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
}

interface SwipeOptions {
  threshold?: number; // minimum distance to trigger initial swipe
  itemThreshold?: number; // distance to move one item while dragging
  enabled?: boolean;
}

export function useSwipeGestures(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const { threshold = 30, itemThreshold = 60, enabled = true } = options;

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTriggerRef = useRef<{ x: number; y: number } | null>(null);
  const directionLockedRef = useRef<'horizontal' | 'vertical' | null>(null);
  const hasMovedRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    lastTriggerRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    directionLockedRef.current = null;
    hasMovedRef.current = false;
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current || !lastTriggerRef.current) return;

    const touch = e.touches[0];
    const startDeltaX = touch.clientX - touchStartRef.current.x;
    const startDeltaY = touch.clientY - touchStartRef.current.y;
    const absStartX = Math.abs(startDeltaX);
    const absStartY = Math.abs(startDeltaY);

    // Lock direction after initial movement threshold
    if (directionLockedRef.current === null && (absStartX > threshold || absStartY > threshold)) {
      directionLockedRef.current = absStartX > absStartY ? 'horizontal' : 'vertical';
    }

    // Calculate delta from last trigger point
    const deltaX = touch.clientX - lastTriggerRef.current.x;
    const deltaY = touch.clientY - lastTriggerRef.current.y;

    if (directionLockedRef.current === 'horizontal') {
      // Horizontal swipe - trigger on itemThreshold
      if (Math.abs(deltaX) >= itemThreshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
        // Update trigger point
        lastTriggerRef.current = {
          x: touch.clientX,
          y: lastTriggerRef.current.y,
        };
        hasMovedRef.current = true;
      }
    } else if (directionLockedRef.current === 'vertical') {
      // Vertical swipe - trigger on itemThreshold
      if (Math.abs(deltaY) >= itemThreshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
        // Update trigger point
        lastTriggerRef.current = {
          x: lastTriggerRef.current.x,
          y: touch.clientY,
        };
        hasMovedRef.current = true;
      }
    }
  }, [enabled, threshold, itemThreshold, handlers]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current) return;

    // If we haven't moved during drag, check for tap
    if (!hasMovedRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      if (deltaX < 10 && deltaY < 10) {
        handlers.onTap?.();
      }
    }

    touchStartRef.current = null;
    lastTriggerRef.current = null;
    directionLockedRef.current = null;
    hasMovedRef.current = false;
  }, [enabled, handlers]);

  useEffect(() => {
    if (!enabled) return;

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
