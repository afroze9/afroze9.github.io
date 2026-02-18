import type { XMBCategoryId } from '../types';

export interface DeepLink {
  categoryId: XMBCategoryId;
  itemId?: string;
  openDetail?: boolean;
}

// Parse URL hash into a deep link
// Format: #/category or #/category/item
export function parseHash(hash: string): DeepLink | null {
  if (!hash || hash === '#' || hash === '#/') {
    return null;
  }

  // Remove leading # and /
  const path = hash.replace(/^#\/?/, '');
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  const categoryId = parts[0] as XMBCategoryId;
  const validCategories: XMBCategoryId[] = ['profile', 'experience', 'projects', 'opensource', 'writing', 'settings'];

  if (!validCategories.includes(categoryId)) {
    return null;
  }

  if (parts.length === 1) {
    return { categoryId };
  }

  return {
    categoryId,
    itemId: parts[1],
    openDetail: true,
  };
}

// Generate URL hash from category and item
export function generateHash(categoryId: XMBCategoryId, itemId?: string): string {
  if (itemId) {
    return `#/${categoryId}/${itemId}`;
  }
  return `#/${categoryId}`;
}

// Update the browser URL without triggering navigation
export function updateUrl(categoryId: XMBCategoryId, itemId?: string, openDetail?: boolean): void {
  const hash = openDetail && itemId ? generateHash(categoryId, itemId) : generateHash(categoryId);

  // Use replaceState to avoid cluttering browser history on every navigation
  window.history.replaceState(null, '', hash);
}
