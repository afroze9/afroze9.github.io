import { useRef, useEffect } from 'react';
import { Application, Graphics } from 'pixi.js';

interface WaveBackgroundProps {
  theme: 'dark' | 'light';
}

export function WaveBackground({ theme }: WaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Initialize PixiJS application
    const app = new Application();

    const init = async () => {
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      container.appendChild(app.canvas);
      appRef.current = app;

      // Wave configuration
      const waveCount = 5;
      const waves: Graphics[] = [];

      // Create wave graphics
      for (let i = 0; i < waveCount; i++) {
        const wave = new Graphics();
        app.stage.addChild(wave);
        waves.push(wave);
      }

      // Animation variables
      let time = 0;

      // Colors based on theme
      const getWaveColor = (index: number) => {
        if (theme === 'dark') {
          const colors = [0x1a1a2e, 0x16213e, 0x0f3460, 0x1a1a2e, 0x16213e];
          return colors[index % colors.length];
        } else {
          const colors = [0xe8f4f8, 0xd1e8ef, 0xb8dbe6, 0xa0cfdd, 0x88c3d4];
          return colors[index % colors.length];
        }
      };

      // Animation loop
      const animate = () => {
        time += 0.005;
        const width = app.screen.width;
        const height = app.screen.height;

        waves.forEach((wave, index) => {
          wave.clear();

          const amplitude = 50 + index * 20;
          const frequency = 0.003 + index * 0.001;
          const speed = 1 + index * 0.2;
          const yOffset = height * 0.3 + index * (height * 0.12);

          wave.fill({ color: getWaveColor(index), alpha: 0.3 + index * 0.1 });
          wave.moveTo(0, height);

          // Draw wave path
          for (let x = 0; x <= width; x += 5) {
            const y =
              yOffset +
              Math.sin(x * frequency + time * speed) * amplitude +
              Math.sin(x * frequency * 0.5 + time * speed * 0.7) * (amplitude * 0.5);
            wave.lineTo(x, y);
          }

          wave.lineTo(width, height);
          wave.lineTo(0, height);
          wave.fill();
        });
      };

      app.ticker.add(animate);
    };

    init();

    // Handle resize
    const handleResize = () => {
      if (appRef.current) {
        appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [theme]);

  // Background gradient based on theme
  const gradientStyle =
    theme === 'dark'
      ? 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
      : 'linear-gradient(180deg, #f0f8ff 0%, #e0f0ff 50%, #d0e8ff 100%)';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: gradientStyle,
        zIndex: -1,
      }}
    />
  );
}
