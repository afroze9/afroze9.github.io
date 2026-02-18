# afroze9.github.io

Portfolio website for Afroze Amjad, styled as a PS3 XrossMediaBar (XMB) UI built with React, PixiJS, and Vite.

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 19 + TypeScript 5.9 |
| Canvas / Animations | PixiJS 8 (`@pixi/react`) |
| Bundler | Vite 7 |
| Markdown | `react-markdown` + `gray-matter` |
| Icons | Lucide React |
| Deployment | GitHub Pages (static) |

## Project Structure

```
src/
  components/
    boot/           # PS3-style boot sequence animation
    xmb/            # XMB chrome: CategoryBar, ItemList, DetailPanel,
                    #   WaveBackground, ContentRenderer, ThemeSelector
    ui/             # AudioManager
  context/          # LayoutContext (mobile detection, viewport)
  hooks/            # useXMBNavigation, useAudio, useSwipeGestures,
                    #   useMobile, useFullscreen
  utils/            # storage (localStorage), routing (URL hash)
  data/             # JSON data files + writings.ts metadata
  types/            # TypeScript interfaces

content/writing/    # Markdown blog posts (YAML frontmatter)
public/             # Static assets (audio clips, favicon)
.github/workflows/  # GitHub Actions deploy to Pages
```

## Data

All content is imported at build time — no runtime API calls.

- [src/data/profile.json](src/data/profile.json) — name, title, bio, timeline, education, contact links, stats
- [src/data/experience.json](src/data/experience.json) — work history (roles, achievements, tech used)
- [src/data/projects.json](src/data/projects.json) — featured and additional projects
- [src/data/skills.json](src/data/skills.json) — core competencies
- [src/data/impact.json](src/data/impact.json) — quantified achievements
- [src/data/opensource.json](src/data/opensource.json) — open source projects
- [content/writing/](content/writing/) — Markdown blog posts

## XMB Categories

**Profile** · **Experience** · **Projects** · **Writing** · **Settings**

Navigation: arrow keys, gamepad, or swipe. Enter/X opens a detail panel; Escape/O closes it.

## Dev Commands

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Deployment

Pushes to `main` trigger the [GitHub Actions workflow](.github/workflows/deploy.yml), which builds and deploys `/dist` to GitHub Pages.
