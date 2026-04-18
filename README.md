# Mahjong Tiles - Bet Higher or Lower

A **Higher or Lower** card game using Mahjong tiles. You're dealt 5 tiles each round and bet whether the next hand's total will be higher or lower. Build streaks for score multipliers and compete on the leaderboard.

---

## Quick Start

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**


## How to Play

1. Start a new game from the landing page.
2. You're dealt **5 tiles** — each has a point value.
3. Bet **Higher** or **Lower** on the next hand.
4. Correct guesses build your streak (up to 5x multiplier).
5. Wrong guesses reset the streak.
6. Submit your final score to the leaderboard.

---

## Game Mechanics

### Tiles

| Type | Examples | Values |
|------|---------|--------|
| Number | Bamboo, Dots, Characters | Face value 1–9 |
| Dragon | Red, Green, White | Dynamic (starts at 5) |
| Wind | East, South, West, North | Dynamic (starts at 5) |

136 tiles in the deck (3 suits x 9 ranks x 4 copies + 7 special tiles x 4 copies).

### Scoring

**Points = Hand Total x Streak Multiplier** (streak caps at 5x, resets on wrong bet, ties count as a win).

### Dynamic Values

Dragon and Wind tiles shift globally each round — **+1 on win, -1 on loss** for any special tiles in the drawn hand. If any value hits 0 or 10, the game ends.

---

## Tech Stack

- **React 18** — UI components
- **TypeScript** — type safety
- **Vite 5** — build tooling
- **Vitest** — unit testing
- **React Router DOM 6** — client-side routing
- **Framer Motion 11** — animations
- **localStorage** — leaderboard persistence
- **Docker + Nginx** — containerized production deployment

---

## Features

- SVG card-style tile graphics
- Animated tile flips, hover effects, and score transitions
- Round History sidebar — scrollable log of every round's result
- Special Tile Values tracker with progress bars and danger warnings
- How to Play modal accessible from the game header
- Responsive 3-column layout that collapses on smaller screens
- Persistent leaderboard (top 5 scores)

---

## Testing

Unit tests cover the core game engine using **Vitest**:

```bash
npm test            # single run
npm run test:watch  # watch mode
```

| Test suite | What's covered |
|-----------|---------------|
| `tileService.test.js` | Deck creation (136 tiles), shuffle integrity, hand value calculation |
| `gameEngine.test.js` | Game creation, betting flow, scoring & streaks, game-over conditions |
| `leaderboard.test.js` | localStorage CRUD, ranking, top-5 cap, corrupted data handling |

**57 tests** across 3 suites.

---

## Docker

Build and run with a single multi-stage Dockerfile (Node build → Nginx serve):

```bash
docker build -t mahjong .
docker run -p 3000:80 mahjong
```

Opens at **http://localhost:3000**

The image uses `nginx:stable-alpine` for a minimal production footprint with SPA fallback routing.

---

## Project Structure

```
src/
├── engine/                    # Pure game logic (no React deps)
│   ├── constants.js           # Game config (suits, hand size, limits)
│   ├── tileService.js         # Deck creation, shuffle, value calc
│   ├── tileService.test.js    # Tests for tile service
│   ├── gameEngine.js          # Game state machine (create, bet, score)
│   ├── gameEngine.test.js     # Tests for game engine
│   ├── leaderboard.js         # localStorage leaderboard
│   └── leaderboard.test.js    # Tests for leaderboard
├── services/
│   └── api.js                 # Async wrapper over engine
├── context/
│   └── GameContext.jsx         # React state management
└── components/
    ├── GameBoard              # Main 3-column game layout
    ├── Tile                   # Individual tile card with SVG
    ├── HandDisplay            # Row of 5 tiles with total
    ├── RoundHistory           # Left sidebar: round-by-round log
    ├── TileValueTracker       # Right sidebar: special tile values
    ├── HowToPlay              # Rules modal
    ├── BetResult              # Win/loss notification
    ├── GameOver               # End screen with score submission
    ├── Leaderboard            # Top scores display
    └── LandingPage            # Home screen
Dockerfile                     # Multi-stage build (Node → Nginx)
nginx.conf                     # SPA routing config
.dockerignore                  # Build context exclusions
```

---

## Handwritten vs. AI-Assisted

### Handwritten (manual effort)

- **Game design** — Higher-or-Lower concept, dynamic tile values as a risk mechanic, streak scoring, and game-over conditions.
- **Core game logic** — betting algorithm, win/loss evaluation, dynamic value updates, reshuffle strategy, and game-over checks in `gameEngine.js`.
- **Architecture** — engine/service/component separation, React Context state management, and data flow design.
- **Layout and UX** — 3-column board layout, round history sidebar, responsive breakpoints, and How to Play placement.
- **Bug fixes** — async/sync migration issues, CSS grid overflow, scrollbar behaviour, and responsive scaling.

### AI-assisted (GitHub Copilot / LLM tooling)

- **Boilerplate acceleration** — repetitive code such as the 136-tile `TILE_DEFINITIONS` array, CSS token declarations, SVG path coordinates for tile icons, and initial component scaffolding were generated and then reviewed and adjusted.
- **CSS styling** — the casino-felt aesthetic, tile card visual design, SVG suit icon patterns (bamboo stalks, dot coins, character seals, dragon flames, wind arrows), and animation keyframes were iterated with AI suggestions and manually refined.
- **Responsive CSS** — `clamp()` value ranges, media query breakpoints, and grid-to-stack collapse rules were suggested by AI and tuned by hand.
