import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'navigate' | 'select' | 'back';

interface UseAudioProps {
  enabled: boolean;
}

// Audio file paths (in public/audio/)
const SOUND_FILES: Record<SoundType, string> = {
  navigate: '/audio/navigate.mp3',
  select: '/audio/select.mp3',
  back: '/audio/back.mp3',
};

const MUSIC_FILE = '/audio/background.mp3';
const MUSIC_VOLUME = 0.3;
const SFX_VOLUME = 0.5;

export function useAudio({ enabled }: UseAudioProps) {
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const userInteracted = useRef(false);

  // Initialize background music
  useEffect(() => {
    if (!enabled) {
      // Stop music if disabled
      if (musicRef.current) {
        musicRef.current.pause();
      }
      return;
    }

    // Create music element if not exists
    if (!musicRef.current) {
      const music = new Audio(MUSIC_FILE);
      music.loop = true;
      music.volume = MUSIC_VOLUME;
      musicRef.current = music;
    }

    // Try to play music (will fail if no user interaction yet)
    const tryPlayMusic = () => {
      if (musicRef.current && enabled && userInteracted.current) {
        musicRef.current.play().catch(() => {
          // Autoplay blocked, will retry on user interaction
        });
      }
    };

    tryPlayMusic();

    // Listen for first user interaction to start music
    const handleInteraction = () => {
      userInteracted.current = true;
      tryPlayMusic();
    };

    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
      audioCache.current.forEach((audio) => {
        audio.pause();
      });
      audioCache.current.clear();
    };
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      if (!enabled) return;

      // Mark user interaction
      userInteracted.current = true;

      // Try to start background music if not playing
      if (musicRef.current && musicRef.current.paused) {
        musicRef.current.play().catch(() => {});
      }

      // Get or create audio element for this sound
      let audio = audioCache.current.get(sound);
      if (!audio) {
        audio = new Audio(SOUND_FILES[sound]);
        audio.volume = SFX_VOLUME;
        audioCache.current.set(sound, audio);
      }

      // Play from start
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Audio play failed (file not found or blocked)
      });
    },
    [enabled]
  );

  const playNavigate = useCallback(() => play('navigate'), [play]);
  const playSelect = useCallback(() => play('select'), [play]);
  const playBack = useCallback(() => play('back'), [play]);

  // Function to toggle music
  const toggleMusic = useCallback(() => {
    if (musicRef.current) {
      if (musicRef.current.paused) {
        musicRef.current.play().catch(() => {});
      } else {
        musicRef.current.pause();
      }
    }
  }, []);

  return {
    play,
    playNavigate,
    playSelect,
    playBack,
    toggleMusic,
  };
}
