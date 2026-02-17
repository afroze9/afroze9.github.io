import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAudio } from '../../hooks/useAudio';

interface AudioContextType {
  playNavigate: () => void;
  playSelect: () => void;
  playBack: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioManagerProps {
  enabled: boolean;
  children: ReactNode;
}

export function AudioManager({ enabled, children }: AudioManagerProps) {
  const audio = useAudio({ enabled });

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioManager');
  }
  return context;
}
