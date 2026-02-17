import { useState, useEffect, useCallback } from 'react';
import type { XMBNavigationState, XMBCategoryId, XMBCategory } from '../types';

interface UseXMBNavigationProps {
  categories: XMBCategory[];
  onSelect?: (categoryId: XMBCategoryId, itemId: string) => void;
}

export function useXMBNavigation({ categories, onSelect }: UseXMBNavigationProps) {
  const [state, setState] = useState<XMBNavigationState>(() => ({
    selectedCategoryIndex: 0,
    selectedItemIndices: {
      profile: 0,
      experience: 0,
      projects: 0,
      writing: 0,
      settings: 0,
    },
    detailPanelOpen: false,
  }));

  const currentCategory = categories[state.selectedCategoryIndex];
  const currentCategoryId = currentCategory?.id as XMBCategoryId;
  const currentItemIndex = state.selectedItemIndices[currentCategoryId] ?? 0;
  const currentItem = currentCategory?.items[currentItemIndex];

  const navigateLeft = useCallback(() => {
    if (state.detailPanelOpen) return;
    setState((prev) => ({
      ...prev,
      selectedCategoryIndex: Math.max(0, prev.selectedCategoryIndex - 1),
    }));
  }, [state.detailPanelOpen]);

  const navigateRight = useCallback(() => {
    if (state.detailPanelOpen) return;
    setState((prev) => ({
      ...prev,
      selectedCategoryIndex: Math.min(categories.length - 1, prev.selectedCategoryIndex + 1),
    }));
  }, [categories.length, state.detailPanelOpen]);

  const navigateUp = useCallback(() => {
    if (state.detailPanelOpen) return;
    setState((prev) => {
      const categoryId = categories[prev.selectedCategoryIndex]?.id as XMBCategoryId;
      const currentIndex = prev.selectedItemIndices[categoryId] ?? 0;
      return {
        ...prev,
        selectedItemIndices: {
          ...prev.selectedItemIndices,
          [categoryId]: Math.max(0, currentIndex - 1),
        },
      };
    });
  }, [categories, state.detailPanelOpen]);

  const navigateDown = useCallback(() => {
    if (state.detailPanelOpen) return;
    setState((prev) => {
      const category = categories[prev.selectedCategoryIndex];
      const categoryId = category?.id as XMBCategoryId;
      const currentIndex = prev.selectedItemIndices[categoryId] ?? 0;
      const maxIndex = (category?.items.length ?? 1) - 1;
      return {
        ...prev,
        selectedItemIndices: {
          ...prev.selectedItemIndices,
          [categoryId]: Math.min(maxIndex, currentIndex + 1),
        },
      };
    });
  }, [categories, state.detailPanelOpen]);

  const select = useCallback(() => {
    if (currentCategory && currentItem) {
      setState((prev) => ({ ...prev, detailPanelOpen: true }));
      onSelect?.(currentCategoryId, currentItem.id);
    }
  }, [currentCategory, currentItem, currentCategoryId, onSelect]);

  const back = useCallback(() => {
    setState((prev) => ({ ...prev, detailPanelOpen: false }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateRight();
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;
        case 'Enter':
          e.preventDefault();
          select();
          break;
        case 'Escape':
          e.preventDefault();
          back();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateLeft, navigateRight, navigateUp, navigateDown, select, back]);

  return {
    state,
    currentCategory,
    currentCategoryId,
    currentItemIndex,
    currentItem,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    select,
    back,
  };
}
