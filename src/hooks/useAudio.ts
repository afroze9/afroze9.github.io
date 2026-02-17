import { useCallback } from 'react';

type SoundType = 'navigate' | 'select' | 'back';

interface UseAudioProps {
  enabled: boolean;
}

export function useAudio({ enabled }: UseAudioProps) {
  // Audio cache will be used when audio files are added
  // const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  const play = useCallback(
    (sound: SoundType) => {
      if (!enabled) return;

      // Placeholder: sounds will be loaded when audio files are added
      // For now, just log the sound being played
      console.log(`[Audio] Playing: ${sound}`);

      // When audio files are available, this would look like:
      // let audio = audioCache.current.get(sound);
      // if (!audio) {
      //   audio = new Audio(`/assets/audio/${sound}.mp3`);
      //   audioCache.current.set(sound, audio);
      // }
      // audio.currentTime = 0;
      // audio.play().catch(() => {});
    },
    [enabled]
  );

  const playNavigate = useCallback(() => play('navigate'), [play]);
  const playSelect = useCallback(() => play('select'), [play]);
  const playBack = useCallback(() => play('back'), [play]);

  return {
    play,
    playNavigate,
    playSelect,
    playBack,
  };
}
