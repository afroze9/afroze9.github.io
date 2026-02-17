# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website for Afroze Amjad rendered as a PS3-style XMB (XrossMediaBar) UI using PixiJS + React, bundled with Vite, and deployed as a static site.

## Tech Stack

- **Renderer**: PixiJS (WebGL canvas for the XMB interface)
- **UI Framework**: React (component structure, state management)
- **Bundler**: Vite
- **Language**: TypeScript
- **Output**: Static site (no server-side rendering)

## XMB Interface Design

The XMB has a horizontal row of **categories** (top-level icons). Each category expands vertically into **items**. Navigation uses arrow keys/gamepad/touch with smooth PixiJS-driven animations.

### Full PS3 Experience

- **Wave background**: Animated ribbon/wave effect rendered in PixiJS (like the PS3 home screen)
- **Sound effects**: Navigate tick, select confirm, back cancel (short audio clips)
- **Animations**: Smooth horizontal/vertical scrolling, icon scale/wobble on focus, fade transitions for content panels
- **Category icons**: Styled to match XMB aesthetic (monochrome/gradient icons)

### XMB Categories (left → right)

| Category | Icon Style | Content |
|----------|-----------|---------|
| **Profile** | User silhouette | Name, title ("Solution Architect"), bio, philosophy, career timeline, education |
| **Experience** | Briefcase | Work history — each role is a vertical item (Associate Director → Application Analyst) |
| **Projects** | Grid/folder | Featured + additional projects, each with name, description, tech tags, role |
| **Writing** | Pencil/document | Blog posts rendered from Markdown files |
| **Settings** | Gear | Theme toggle (dark/light wave colors), sound on/off, credits/attribution |

### Interaction Model

- **Left/Right arrows**: Move between categories (horizontal)
- **Up/Down arrows**: Move between items within a category (vertical)
- **Enter/X button**: Open detail panel for selected item (slides in from right or expands)
- **Escape/O button**: Close detail panel, go back
- **Gamepad support**: Map to standard PS controller layout
- **Touch/swipe**: Mobile support for horizontal/vertical navigation

## Data Architecture

### Structured Data — JSON (`/data/*.json`)

- `profile.json` — Name, title, bio, philosophy principles, career timeline, education, contact links (LinkedIn, GitHub, email), stats (years experience, engineers led, clients served)
- `experience.json` — Array of roles: company, title, year, description, achievements, tech used
- `projects.json` — Array of projects: name, year, description, technologies, role, category (featured/additional)
- `skills.json` — Service/focus areas: Generative AI, Cloud Architecture, Engineering Leadership, Platform Modernization (with descriptions)
- `impact.json` — Quantified achievements for highlight display (e.g., "40% dev time reduced")

### Long-form Content — Markdown (`/content/writing/*.md`)

Blog posts use frontmatter:

```yaml
---
title: "A Simple Batch Reporting Tool..."
date: 2025-12-16
description: "Short summary for XMB item list"
tags: [healthcare, automation]
---

Article body in Markdown...
```

## Build & Dev Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build (static output to /dist)
npm run preview      # Preview production build locally
```

## Key Architectural Decisions

- PixiJS renders the XMB chrome (background, icons, transitions, navigation) on a full-screen canvas
- React manages state (selected category, selected item, detail panel open/closed, settings) and renders HTML overlays for text-heavy content (detail panels, blog posts)
- Audio files are short MP3/OGG clips loaded on init; playback gated by a Settings toggle
- All portfolio data is imported at build time (JSON imports + markdown loader) — no runtime API calls
- Static site output: single `index.html` with JS/CSS/assets, deployable to any CDN
