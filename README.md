# Mahjong - Bet Higher or Lower

A browser-based Mahjong tile betting game built with **React**, **Vite**, and **Framer Motion**. The entire application runs client-side with no backend required — all game logic executes in the browser and the leaderboard persists via `localStorage`.

![React](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4-purple) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Game Overview](#game-overview)
- [How to Play](#how-to-play)
- [Game Mechanics](#game-mechanics)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [File Structure](#file-structure)
- [Handwritten vs. AI-Assisted](#handwritten-vs-ai-assisted)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs on **http://localhost:5173**.

No backend server is needed — the game is entirely client-side.

---

## Game Overview

The game is a **Higher or Lower** betting game using Mahjong tiles. Each round, you are dealt a hand of 5 tiles, each with a numeric value. Your goal is to correctly predict whether the **next** hand will have a higher or lower total than your current hand. Correct guesses build a streak multiplier for bigger scores.

---

## How to Play

1. **Start a new game** from the landing page.
2. You are dealt **5 Mahjong tiles**. Each tile contributes a value to the hand total.
3. Look at your hand total and decide: will the next hand be **Higher** or **Lower**?
4. Click your bet. A new hand is drawn and compared to the previous total.
5. **Correct guess** — you earn points and your streak increases (up to 5x multiplier).
6. **Wrong guess** — your streak resets to 0, but the game continues.
7. Keep playing to maximize your score before a game-over condition triggers.
8. Submit your score to the **leaderboard** (stored locally in your browser).

---

## Game Mechanics

### Tile Types

| Type | Suits | Values | Color |
|------|-------|--------|-------|
| **Number Tiles** | Bamboo, Dots, Characters | Face value (1–9) | Green, Blue, Red |
| **Dragon Tiles** | Red, Green, White | Dynamic (starts at 5) | Gold |
| **Wind Tiles** | East, South, West, North | Dynamic (starts at 5) | Purple |

The deck contains **136 tiles** total: 3 suits × 9 numbers × 4 copies + 3 dragons × 4 copies + 4 winds × 4 copies.

### Scoring

```
Points = Hand Total × Streak Multiplier
```

- Each correct bet increases the streak by 1.
- The multiplier caps at **5x**.
- A wrong bet resets the streak to **0**.
- Ties (equal hand totals) count as a **win** for either bet.

### Dynamic Special Tile Values

Dragon and Wind tiles have **dynamic values** that change every round based on what special tiles appear in your newly drawn hand:

- **Win** → each special tile's global value increases by **+1**
- **Lose** → each special tile's global value decreases by **-1**

These shifting values affect hand totals in future rounds and create a risk mechanic.

### Game Over Conditions

The game ends when either:

1. **Any special tile value reaches 0 or 10** — the dynamic values have drifted too far.
2. **The draw pile is exhausted 3 times** — the deck has been reshuffled too many times.

### Reshuffling

When the draw pile doesn't have enough tiles (< 5) for a new hand, a reshuffle occurs:

- The remaining draw pile + discard pile + a fresh set of tiles are combined and shuffled.
- Maximum of **3 reshuffles** allowed before game over.

---

## Project Architecture

The application is structured into four layers:

```
┌──────────────────────────────────────────────┐
│                  React UI                     │
│  (Components, Context, Router, Animations)    │
├──────────────────────────────────────────────┤
│               API Service Layer               │
│  (Same interface as original HTTP API,        │
│   now calls local engine directly)            │
├──────────────────────────────────────────────┤
│              Game Engine (Pure JS)             │
│  (Tile creation, shuffling, betting logic,    │
│   scoring, game-over checks)                  │
├──────────────────────────────────────────────┤
│              localStorage                     │
│  (Leaderboard persistence)                    │
└──────────────────────────────────────────────┘
```

### Design Decisions

- **No backend needed** — All game logic runs in the browser. The game was originally built with an Express backend, but since there's no multiplayer, authentication, or database requirement, everything was moved client-side for simplicity.
- **API abstraction preserved** — The `services/api.js` layer keeps the same function signatures (`createGame`, `placeBet`, `getLeaderboard`, `submitScore`) so the UI components are decoupled from the engine implementation.
- **localStorage leaderboard** — Scores persist across browser sessions, which is better than the original in-memory backend store that lost data on every restart.
- **SVG card graphics** — Tiles render using inline SVG patterns instead of Chinese Unicode characters, making them universally readable with a playing-card aesthetic.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI component library |
| **Vite 5** | Build tool and dev server |
| **React Router DOM 6** | Client-side routing (`/` landing, `/game` gameplay) |
| **Framer Motion 11** | Animations (tile flips, transitions, hover effects) |
| **CSS (vanilla)** | Component-scoped styling with CSS variables, responsive `clamp()` |
| **localStorage** | Leaderboard data persistence |
| **crypto.randomUUID()** | Game session ID generation |

---

## Key Features

### Visual
- **SVG card-style tiles** — Number tiles show repeating suit patterns (bamboo stalks, dots/coins, character seals) arranged like playing cards. Dragons show flame/diamond/pearl icons. Winds show compass arrows.
- **Framer Motion animations** — Tile flip reveals, hover lift effects, spring-animated score updates, animated bet results.
- **Dark theme** — Dark background with gold accents and color-coded suits.
- **Responsive design** — Fluid sizing with `clamp()`, 3-column layout on desktop that collapses to single-column on mobile.

### Gameplay UI
- **Round History panel** (left sidebar) — Shows every round's result with mini tile cards, value comparisons, win/loss badges, and points earned. Scrollable with styled scrollbar.
- **Special Tile Values tracker** (right sidebar) — Real-time display of all dynamic dragon/wind values with progress bars and danger warnings.
- **How to Play modal** — Accessible from the header, explains all game rules and tile types.
- **Bet result banner** — Animated win/loss notification with points and multiplier info.
- **Game Over overlay** — Shows final score, rounds played, and leaderboard submission form.
- **Leaderboard** — Top 5 scores with medal icons, displayed on the landing page.

---

## File Structure

```
frontend/
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── public/
│   └── favicon.svg                # Tab icon
└── src/
    ├── main.jsx                   # React root mount
    ├── App.jsx                    # Router setup with GameProvider
    ├── App.css                    # App-level styles
    ├── index.css                  # Global styles, CSS variables, fonts
    │
    ├── engine/                    # Game logic (no UI dependencies)
    │   ├── constants.js           # Tile suits, numbers, hand size, limits
    │   ├── tileService.js         # Deck creation, Fisher-Yates shuffle, value calc
    │   ├── gameEngine.js          # Game lifecycle: create, bet, score, game-over
    │   └── leaderboard.js         # localStorage read/write for top 5 scores
    │
    ├── services/
    │   └── api.js                 # Thin wrapper over engine (async interface)
    │
    ├── context/
    │   └── GameContext.jsx         # React context for game state + round history
    │
    └── components/
        ├── LandingPage.jsx/.css   # Home screen with New Game button + leaderboard
        ├── GameBoard.jsx/.css     # Main game layout (3-column grid)
        ├── HandDisplay.jsx/.css   # Renders a row of tiles with total value
        ├── Tile.jsx/.css          # Individual tile card with SVG graphics
        ├── BetResult.jsx/.css     # Win/loss notification banner
        ├── RoundHistory.jsx/.css  # Left sidebar: scrollable round-by-round results
        ├── TileValueTracker.jsx/.css  # Right sidebar: dynamic special tile values
        ├── HowToPlay.jsx/.css     # Modal with game instructions
        ├── GameOver.jsx/.css      # Game over overlay with score submission
        └── Leaderboard.jsx/.css   # Top scores display with medals
```

### Engine Module (`src/engine/`)

The engine is pure JavaScript with no React dependencies. It can be tested or reused independently.

| File | Exports | Responsibility |
|------|---------|---------------|
| `constants.js` | `SUITS`, `NUMBERS`, `DRAGONS`, `WINDS`, `HAND_SIZE`, `MAX_RESHUFFLES`, etc. | All game configuration constants |
| `tileService.js` | `createTileDefinitions()`, `shuffle()`, `getTileValue()`, `calculateHandValue()` | Deck building, randomization, value math |
| `gameEngine.js` | `createGame()`, `getGame()`, `placeBet()` | Full game state machine: create sessions, process bets, manage draw/discard piles, update dynamic values, check game-over |
| `leaderboard.js` | `getLeaderboard()`, `submitScore()` | Read/write top 5 scores to localStorage |

### Component Hierarchy

```
App
├── LandingPage
│   └── Leaderboard
└── GameBoard
    ├── BetResult
    ├── HandDisplay
    │   └── Tile (×5)
    ├── RoundHistory
    ├── TileValueTracker
    ├── HowToPlay (modal)
    └── GameOver (overlay)
```

---

## Handwritten vs. AI-Assisted

### Handwritten (manual effort)

- **Game design and rules** — the Higher-or-Lower concept, dynamic special tile values as a risk mechanic, streak multiplier scoring, and game-over conditions were all designed manually.
- **Architecture decisions** — choosing to move from a client-server architecture to a fully client-side app, the API abstraction layer pattern, localStorage for leaderboard persistence, and the engine/service/component separation.
- **Core game logic** — the betting algorithm, win/loss evaluation, dynamic value update rules, draw-pile reshuffle strategy, and game-over condition checks in `gameEngine.js` were written by hand.
- **State management** — React Context design for game state, round history accumulation logic, and the data flow between components.
- **Layout and UX decisions** — the 3-column game board layout, round history as a scrollable left sidebar, responsive breakpoints, and the "How to Play" modal placement.
- **Bug fixes and iteration** — debugging async/sync API migration issues, CSS grid overflow problems, scrollbar behaviour, and responsive scaling were done through manual testing and reasoning.

### AI-assisted (GitHub Copilot / LLM tooling)

- **Boilerplate acceleration** — repetitive code such as the 136-tile `TILE_DEFINITIONS` array, CSS token declarations, SVG path coordinates for tile icons, and the initial component scaffolding were generated and then reviewed and adjusted.
- **CSS styling** — the dark-theme casino-felt aesthetic, tile card visual design (gradients, shadows, border treatments), SVG suit icon patterns (bamboo stalks, dot coins, character seals, dragon flames, wind arrows), and animation keyframes were iterated with AI suggestions and manually refined.
- **Component boilerplate** — initial JSX structure for components like `RoundHistory`, `HowToPlay`, `TileValueTracker`, and `GameOver` was scaffolded by AI and then customised for specific layout and interaction needs.
- **Responsive CSS** — `clamp()` value ranges, media query breakpoints, and grid-to-stack collapse rules were suggested by AI and tuned by hand.
