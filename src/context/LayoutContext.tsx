import { createContext, useContext, type ReactNode } from 'react';
import { useResponsiveLayout } from '../hooks/useMobile';

type LayoutContextType = ReturnType<typeof useResponsiveLayout>;

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const layout = useResponsiveLayout();

  return (
    <LayoutContext.Provider value={layout}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
