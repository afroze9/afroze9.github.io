import { Application, Graphics, BlurFilter } from "pixi.js";
import { useEffect, useRef } from "react";
import type { ThemeColor } from "../../types";

interface WaveBackgroundProps {
  theme: ThemeColor;
  showRibbons?: boolean;
}

// PS3-style color themes - radial gradient from bottom-right corner
const themeColors: Record<ThemeColor, { primary: string; secondary: string; ribbons: number[] }> = {
  blue: {
    primary: "#1a4a7a",
    secondary: "#0a2040",
    ribbons: [0x4a8ac8, 0x6aaae8, 0x8acaff],
  },
  red: {
    primary: "#8a3020",
    secondary: "#401510",
    ribbons: [0xc86a5a, 0xe88a7a, 0xffaa9a],
  },
  green: {
    primary: "#1a6a3a",
    secondary: "#103520",
    ribbons: [0x5ac88a, 0x7ae8aa, 0x9affca],
  },
  purple: {
    primary: "#5a2a7a",
    secondary: "#2d1540",
    ribbons: [0x9a6ac8, 0xba8ae8, 0xdaaaff],
  },
  orange: {
    primary: "#8a5a1a",
    secondary: "#402d10",
    ribbons: [0xc89a5a, 0xe8ba7a, 0xffda9a],
  },
  pink: {
    primary: "#7a2a5a",
    secondary: "#40152d",
    ribbons: [0xc86a9a, 0xe88aba, 0xffaada],
  },
};

// Sparkle particle
interface Sparkle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  alphaDirection: number;
}

// Ribbon control point for organic movement
interface RibbonPoint {
  baseY: number;
  offsetY: number;
  phase: number;
  speed: number;
  amplitude: number;
}

// Ribbon configuration
interface Ribbon {
  points: RibbonPoint[];
  color: number;
  alpha: number;
  thickness: number;
  blur: number;
}

export function WaveBackground({ theme, showRibbons = true }: WaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const themeRef = useRef<ThemeColor>(theme);
  const showRibbonsRef = useRef(showRibbons);
  const ribbonOpacityRef = useRef(0);

  // Keep refs in sync with props
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    showRibbonsRef.current = showRibbons;
  }, [showRibbons]);

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

      const width = app.screen.width;
      const height = app.screen.height;

      // Create sparkles
      const sparkleCount = 80;
      const sparkles: Sparkle[] = [];
      for (let i = 0; i < sparkleCount; i++) {
        sparkles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.5 + Math.random() * 1.5,
          alpha: Math.random(),
          alphaSpeed: 0.005 + Math.random() * 0.015,
          alphaDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
      const sparkleGraphics = new Graphics();
      app.stage.addChild(sparkleGraphics);

      // Create ribbons (5 strands that form a collective flowing ribbon)
      const ribbonCount = 5;
      const ribbons: Ribbon[] = [];
      const ribbonGraphics: Graphics[] = [];

      // Base Y position for the ribbon cluster (around 40% from top)
      const ribbonCenterY = height * 0.42;

      for (let i = 0; i < ribbonCount; i++) {
        // Create control points along the ribbon
        const pointCount = 10;
        const points: RibbonPoint[] = [];

        // Each ribbon strand is offset slightly from center, creating intertwined effect
        const strandOffset = (i - (ribbonCount - 1) / 2) * 12; // -24, -12, 0, 12, 24

        for (let j = 0; j < pointCount; j++) {
          points.push({
            baseY: ribbonCenterY + strandOffset,
            offsetY: 0,
            // Offset phases so ribbons interweave
            phase: (j / pointCount) * Math.PI * 2 + i * 1.2,
            speed: 0.25 + (i % 2) * 0.1, // Alternating speeds for interweaving
            amplitude: 40 + Math.random() * 30,
          });
        }

        ribbons.push({
          points,
          color: 0xffffff, // Will be updated based on theme
          alpha: 0.08 + (i === 2 ? 0.04 : 0), // Center ribbon slightly brighter
          thickness: 60 + (i === 2 ? 20 : 0), // Center ribbon thicker
          blur: 6 + Math.abs(i - 2) * 2, // Center ribbon sharper
        });

        const g = new Graphics();
        const blurFilter = new BlurFilter({ strength: ribbons[i].blur });
        g.filters = [blurFilter];
        app.stage.addChild(g);
        ribbonGraphics.push(g);
      }

      // Animation variables
      let time = 0;

      // Cubic bezier helper for smooth ribbon curves
      const catmullRom = (
        p0: number,
        p1: number,
        p2: number,
        p3: number,
        t: number
      ): number => {
        const t2 = t * t;
        const t3 = t2 * t;
        return (
          0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
        );
      };

      // Animation loop
      const animate = () => {
        time += 0.008;
        const currentWidth = app.screen.width;
        const currentHeight = app.screen.height;
        const colors = themeColors[themeRef.current];

        // Update and draw sparkles
        sparkleGraphics.clear();
        sparkles.forEach((sparkle) => {
          // Twinkle effect
          sparkle.alpha += sparkle.alphaSpeed * sparkle.alphaDirection;
          if (sparkle.alpha >= 1) {
            sparkle.alpha = 1;
            sparkle.alphaDirection = -1;
          } else if (sparkle.alpha <= 0) {
            sparkle.alpha = 0;
            sparkle.alphaDirection = 1;
            // Reposition when fully faded
            sparkle.x = Math.random() * currentWidth;
            sparkle.y = Math.random() * currentHeight;
          }

          sparkleGraphics.circle(sparkle.x, sparkle.y, sparkle.size);
          sparkleGraphics.fill({ color: 0xffffff, alpha: sparkle.alpha * 0.6 });
        });

        // Fade ribbons in/out based on showRibbons prop
        if (showRibbonsRef.current && ribbonOpacityRef.current < 1) {
          ribbonOpacityRef.current = Math.min(1, ribbonOpacityRef.current + 0.02);
        } else if (!showRibbonsRef.current && ribbonOpacityRef.current > 0) {
          ribbonOpacityRef.current = Math.max(0, ribbonOpacityRef.current - 0.02);
        }

        // Update and draw ribbons
        ribbons.forEach((ribbon, ribbonIndex) => {
          const g = ribbonGraphics[ribbonIndex];
          g.clear();

          // Skip drawing if ribbons are fully hidden
          if (ribbonOpacityRef.current <= 0) return;

          // Update control points
          ribbon.points.forEach((point) => {
            point.offsetY =
              Math.sin(time * point.speed + point.phase) * point.amplitude +
              Math.sin(time * point.speed * 0.7 + point.phase * 1.3) * (point.amplitude * 0.5);
          });

          // Get ribbon color from theme (cycle through available colors)
          const ribbonColor = colors.ribbons[ribbonIndex % colors.ribbons.length];

          // Draw ribbon as a smooth filled shape
          const segments = 100;

          // Build top and bottom edge points
          const topEdge: { x: number; y: number }[] = [];
          const bottomEdge: { x: number; y: number }[] = [];

          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const totalT = t * (ribbon.points.length - 1);
            const segmentIndex = Math.floor(totalT);
            const localT = totalT - segmentIndex;

            // Get 4 control points for Catmull-Rom
            const p0 = ribbon.points[Math.max(0, segmentIndex - 1)];
            const p1 = ribbon.points[segmentIndex];
            const p2 = ribbon.points[Math.min(ribbon.points.length - 1, segmentIndex + 1)];
            const p3 = ribbon.points[Math.min(ribbon.points.length - 1, segmentIndex + 2)];

            const x = i * (currentWidth / segments);
            const baseY = catmullRom(p0.baseY, p1.baseY, p2.baseY, p3.baseY, localT);
            const offsetY = catmullRom(p0.offsetY, p1.offsetY, p2.offsetY, p3.offsetY, localT);
            const y = baseY + offsetY;

            // Ribbon thickness varies along its length for organic look
            const thicknessVar = ribbon.thickness * (0.8 + 0.4 * Math.sin(t * Math.PI));

            topEdge.push({ x, y: y - thicknessVar / 2 });
            bottomEdge.push({ x, y: y + thicknessVar / 2 });
          }

          // Draw the ribbon shape
          g.moveTo(topEdge[0].x, topEdge[0].y);

          // Top edge (left to right)
          for (let i = 1; i < topEdge.length; i++) {
            g.lineTo(topEdge[i].x, topEdge[i].y);
          }

          // Bottom edge (right to left)
          for (let i = bottomEdge.length - 1; i >= 0; i--) {
            g.lineTo(bottomEdge[i].x, bottomEdge[i].y);
          }

          g.closePath();
          g.fill({ color: ribbonColor, alpha: ribbon.alpha * ribbonOpacityRef.current });
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
        // Radial gradient from bottom-right corner
        background: `radial-gradient(ellipse 120% 80% at 100% 100%, ${colors.primary} 0%, ${colors.secondary} 40%, #000000 80%)`,
        transition: "background 0.5s ease-out",
        zIndex: -1,
      }}
    />
  );
}
