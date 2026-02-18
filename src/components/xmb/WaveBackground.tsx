import { Application, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";
import type { ThemeColor } from "../../types";

interface WaveBackgroundProps {
  theme: ThemeColor;
}

// PS3-style color themes
const themeColors: Record<ThemeColor, { gradient: string; waves: number[] }> = {
  blue: {
    gradient: "linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #1b3a5f 100%)",
    waves: [0x0d1b2a, 0x1b3a5f, 0x274c77, 0x3d6a99, 0x4a7fa8],
  },
  red: {
    gradient: "linear-gradient(180deg, #1a0a0a 0%, #2a0d0d 50%, #5f1b1b 100%)",
    waves: [0x2a0d0d, 0x5f1b1b, 0x772727, 0x993d3d, 0xa84a4a],
  },
  green: {
    gradient: "linear-gradient(180deg, #0a1a0a 0%, #0d2a0d 50%, #1b5f1b 100%)",
    waves: [0x0d2a0d, 0x1b5f1b, 0x277727, 0x3d993d, 0x4aa84a],
  },
  purple: {
    gradient: "linear-gradient(180deg, #120a1a 0%, #1d0d2a 50%, #3d1b5f 100%)",
    waves: [0x1d0d2a, 0x3d1b5f, 0x522777, 0x6d3d99, 0x7a4aa8],
  },
  orange: {
    gradient: "linear-gradient(180deg, #1a120a 0%, #2a1d0d 50%, #5f3d1b 100%)",
    waves: [0x2a1d0d, 0x5f3d1b, 0x775227, 0x996d3d, 0xa87a4a],
  },
  pink: {
    gradient: "linear-gradient(180deg, #1a0a14 0%, #2a0d1d 50%, #5f1b4a 100%)",
    waves: [0x2a0d1d, 0x5f1b4a, 0x772760, 0x993d7a, 0xa84a8a],
  },
};

export function WaveBackground({ theme }: WaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const themeRef = useRef<ThemeColor>(theme);

  // Keep themeRef in sync with prop
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Initialize PixiJS only once
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

      // Animation loop - reads theme from ref so it always gets current value
      const animate = () => {
        time += 0.005;
        const width = app.screen.width;
        const height = app.screen.height;
        const colors = themeColors[themeRef.current];

        waves.forEach((wave, index) => {
          wave.clear();

          const amplitude = 50 + index * 20;
          const frequency = 0.003 + index * 0.001;
          const speed = 1 + index * 0.2;
          const yOffset = height * 0.3 + index * (height * 0.12);

          wave.fill({ color: colors.waves[index], alpha: 0.3 + index * 0.1 });
          wave.moveTo(0, height);

          // Draw wave path
          for (let x = 0; x <= width; x += 5) {
            const y =
              yOffset + Math.sin(x * frequency + time * speed) * amplitude + Math.sin(x * frequency * 0.5 + time * speed * 0.7) * (amplitude * 0.5);
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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []); // Only run once on mount

  const colors = themeColors[theme];

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: colors.gradient,
        transition: "background 0.3s ease-out",
        zIndex: -1,
      }}
    />
  );
}
