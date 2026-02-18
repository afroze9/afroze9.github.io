import { useState, useEffect, useCallback } from 'react';
import type { XMBNavigationState, XMBCategoryId, XMBCategory } from '../types';

export interface InitialNavigation {
  categoryId: XMBCategoryId;
  itemId?: string;
  openDetail?: boolean;
}

interface UseXMBNavigationProps {
  categories: XMBCategory[];
  initialNavigation?: InitialNavigation | null;
  onSelect?: (categoryId: XMBCategoryId, itemId: string) => void;
  onNavigate?: () => void;
  onConfirm?: () => void;
  onBack?: () => void;
  onNavigationChange?: (categoryId: XMBCategoryId, itemId: string, detailOpen: boolean) => void;
}

export function useXMBNavigation({
  categories,
  initialNavigation,
  onSelect,
  onNavigate,
  onConfirm,
  onBack: onBackSound,
  onNavigationChange,
}: UseXMBNavigationProps) {
  const [state, setState] = useState<XMBNavigationState>(() => {
    const baseState: XMBNavigationState = {
      selectedCategoryIndex: 0,
      selectedItemIndices: {
        profile: 0,
        experience: 0,
        projects: 0,
        opensource: 0,
        writing: 0,
        settings: 0,
      },
      detailPanelOpen: false,
    };

    // If there's initial navigation, apply it
    if (initialNavigation && categories.length > 0) {
      const categoryIndex = categories.findIndex(c => c.id === initialNavigation.categoryId);
      if (categoryIndex >= 0) {
        baseState.selectedCategoryIndex = categoryIndex;

        if (initialNavigation.itemId) {
          const category = categories[categoryIndex];
          const itemIndex = category.items.findIndex(item => item.id === initialNavigation.itemId);
          if (itemIndex >= 0) {
            baseState.selectedItemIndices[initialNavigation.categoryId] = itemIndex;
            if (initialNavigation.openDetail) {
              baseState.detailPanelOpen = true;
            }
          }
        }
      }
    }

    return baseState;
  });

  const currentCategory = categories[state.selectedCategoryIndex];
  const currentCategoryId = currentCategory?.id as XMBCategoryId;
  const currentItemIndex = state.selectedItemIndices[currentCategoryId] ?? 0;
  const currentItem = currentCategory?.items[currentItemIndex];

  const navigateLeft = useCallback(() => {
    if (state.detailPanelOpen) return false;
    const canMove = state.selectedCategoryIndex > 0;
    if (canMove) {
      setState((prev) => ({
        ...prev,
        selectedCategoryIndex: prev.selectedCategoryIndex - 1,
      }));
      onNavigate?.();
    }
    return canMove;
  }, [state.detailPanelOpen, state.selectedCategoryIndex, onNavigate]);

  const navigateRight = useCallback(() => {
    if (state.detailPanelOpen) return false;
    const canMove = state.selectedCategoryIndex < categories.length - 1;
    if (canMove) {
      setState((prev) => ({
        ...prev,
        selectedCategoryIndex: prev.selectedCategoryIndex + 1,
      }));
      onNavigate?.();
    }
    return canMove;
  }, [categories.length, state.detailPanelOpen, state.selectedCategoryIndex, onNavigate]);

  const navigateUp = useCallback((count: number = 1) => {
    if (state.detailPanelOpen) return false;
    const categoryId = categories[state.selectedCategoryIndex]?.id as XMBCategoryId;
    const currentIdx = state.selectedItemIndices[categoryId] ?? 0;
    const canMove = currentIdx > 0;
    if (canMove) {
      const newIndex = Math.max(0, currentIdx - count);
      setState((prev) => ({
        ...prev,
        selectedItemIndices: {
          ...prev.selectedItemIndices,
          [categoryId]: newIndex,
        },
      }));
      onNavigate?.();
    }
    return canMove;
  }, [categories, state.detailPanelOpen, state.selectedCategoryIndex, state.selectedItemIndices, onNavigate]);

  const navigateDown = useCallback((count: number = 1) => {
    if (state.detailPanelOpen) return false;
    const category = categories[state.selectedCategoryIndex];
    const categoryId = category?.id as XMBCategoryId;
    const currentIdx = state.selectedItemIndices[categoryId] ?? 0;
    const maxIndex = (category?.items.length ?? 1) - 1;
    const canMove = currentIdx < maxIndex;
    if (canMove) {
      const newIndex = Math.min(maxIndex, currentIdx + count);
      setState((prev) => ({
        ...prev,
        selectedItemIndices: {
          ...prev.selectedItemIndices,
          [categoryId]: newIndex,
        },
      }));
      onNavigate?.();
    }
    return canMove;
  }, [categories, state.detailPanelOpen, state.selectedCategoryIndex, state.selectedItemIndices, onNavigate]);

  // Direct navigation to specific category (for mouse clicks)
  const goToCategory = useCallback((index: number) => {
    if (state.detailPanelOpen) return;
    if (index >= 0 && index < categories.length && index !== state.selectedCategoryIndex) {
      setState((prev) => ({
        ...prev,
        selectedCategoryIndex: index,
      }));
      onNavigate?.();
    }
  }, [state.detailPanelOpen, state.selectedCategoryIndex, categories.length, onNavigate]);

  // Direct navigation to specific item (for mouse clicks)
  // If clicking on already-selected item, open it
  const goToItem = useCallback((index: number) => {
    if (state.detailPanelOpen) return;
    const categoryId = categories[state.selectedCategoryIndex]?.id as XMBCategoryId;
    const maxIndex = (categories[state.selectedCategoryIndex]?.items.length ?? 1) - 1;
    const currentIdx = state.selectedItemIndices[categoryId] ?? 0;

    if (index >= 0 && index <= maxIndex) {
      if (index === currentIdx) {
        // Already selected - open it
        const item = categories[state.selectedCategoryIndex]?.items[index];
        if (item) {
          setState((prev) => ({ ...prev, detailPanelOpen: true }));
          onSelect?.(categoryId, item.id);
          onConfirm?.();
        }
      } else {
        // Navigate to it
        setState((prev) => ({
          ...prev,
          selectedItemIndices: {
            ...prev.selectedItemIndices,
            [categoryId]: index,
          },
        }));
        onNavigate?.();
      }
    }
  }, [state.detailPanelOpen, state.selectedCategoryIndex, state.selectedItemIndices, categories, onNavigate, onSelect, onConfirm]);

  const select = useCallback(() => {
    if (currentCategory && currentItem) {
      setState((prev) => ({ ...prev, detailPanelOpen: true }));
      onSelect?.(currentCategoryId, currentItem.id);
      onConfirm?.();
    }
  }, [currentCategory, currentItem, currentCategoryId, onSelect, onConfirm]);

  const back = useCallback(() => {
    if (state.detailPanelOpen) {
      setState((prev) => ({ ...prev, detailPanelOpen: false }));
      onBackSound?.();
    }
  }, [state.detailPanelOpen, onBackSound]);

  // Notify parent of navigation changes (for URL updates)
  useEffect(() => {
    if (currentCategory && currentItem) {
      onNavigationChange?.(currentCategoryId, currentItem.id, state.detailPanelOpen);
    }
  }, [currentCategory, currentItem, currentCategoryId, state.detailPanelOpen, onNavigationChange]);

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

    // Right-click acts as back button
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      back();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
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
    goToCategory,
    goToItem,
    select,
    back,
  };
}
