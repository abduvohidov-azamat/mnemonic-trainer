# Mnemonic Memory Training Platform - Design Document

**Date:** 2026-08-25  
**Topic:** Mnemonic Memory Training Platform (Angular 18+ & Nest.js + SQLite)  
**Status:** Approved by User  
**Project Base:** `C:\Users\a_abduvohidov\.gemini\antigravity-ide\scratch\mnemonic-trainer` (and synced to `C:\Users\a_abduvohidov\Desktop\mnemonic-trainer`)  

---

## 1. Executive Summary & Vision

The **Mnemonic Memory Training Platform** is a specialized, high-performance web application engineered for memory athletes, students, and cognitive enthusiasts. It facilitates rigorous training across standard memory championship disciplines: **Speed Numbers**, **Deck of Cards (52-card memorization)**, and **Random Words / Names**, combined with an integrated **PAO (Person-Action-Object) Matrix & Live Assistant**.

The platform is architected as a clean monorepo:
- **Frontend**: Angular 18+ Standalone Components with Angular Signals, RxJS timing engines, and keyboard shortcuts.
- **Backend**: Nest.js 10+ with SQLite + TypeORM, providing sequence generation, recall evaluation, session telemetry, and PAO dictionary customization with guest and JWT auth.

---

## 2. Core Disciplines & Game Mechanics

### 2.1 The Two-Phase Memory Sports Lifecycle
Every training session proceeds through 3 structured phases:
1. **Configuration**: Set sequence length, chunk size (1, 2, or 3 digits / cards per locus), auto-pacer speed (ms) or manual arrow navigation, and toggle live PAO assistance.
2. **Memorization Phase**:
   - High-precision millisecond stopwatch.
   - Interactive focus on active locus.
   - Navigation via keyboard (`Space`, `ArrowRight`, `ArrowLeft`, `Backspace`).
   - Live PAO hint bar displaying mapped Person, Action, or Object for the active chunk.
   - Instant transition to recall on user command or timer expiration.
3. **Recall Phase**:
   - Direct interactive input grid (number keypad, visual card selector, or text inputs).
   - Real-time locus jumping.
4. **Evaluation & Performance Analytics**:
   - Automated server-side evaluation.
   - Exact match vs. error breakdown with color-coded diffing.
   - Time-per-chunk metric, accuracy percentage, and historical progress graph.

---

### 2.2 Detailed Discipline Specifications

#### A. Speed Numbers
- **Config**: 20 to 500 digits; chunk sizes of 1, 2, or 3 digits per locus.
- **Memorize UI**: Crisp monospace display with the active chunk highlighted and surrounded by subtle locus brackets.
- **Recall UI**: Dynamic input matrix allowing digit typing with automatic cursor advancement and backspace locus jumping.
- **Scoring**: Digit-by-digit accuracy %, total time, and speed (digits per minute).

#### B. Speed Cards (Deck Memorization)
- **Config**: 1 full deck (52 cards), half deck (26 cards), or custom subsets; 1 or 2 cards per locus.
- **Memorize UI**: High-contrast card visuals (Spades, Hearts, Diamonds, Clubs) with smooth card flip animations and keyboard advance.
- **Recall UI**: 52-card interactive picker with suit/rank matrix and quick discard.
- **Scoring**: Full sequence accuracy, misplaced card offsets, and total memorization duration.

#### C. Random Words & Names Recall
- **Config**: 10 to 50 words selected from a curated dictionary of 1,000+ concrete and abstract nouns.
- **Memorize UI**: Locus-indexed list with clean typography.
- **Recall UI**: Typeahead input list with Levenshtein-distance spelling tolerance (fuzzy matching for small typos).

#### D. PAO (Person-Action-Object) Matrix Manager
- Comprehensive dictionary for `00`–`99` (100 items) and all 52 playing cards.
- Pre-seeded with a complete default Major System / PAO dictionary.
- Athletes can edit any entry (`Person`, `Action`, `Object`, `Notes`, `Image URL`).
- Toggleable "PAO Overlay" during practice to display hints in real-time.

---

## 3. System Architecture & Monorepo Layout

```
mnemonic-trainer/
├── backend/                       # Nest.js 10+ Application
│   ├── src/
│   │   ├── auth/                  # JWT auth & Guest session handler
│   │   ├── games/                 # Sequence generation (Numbers, Cards, Words)
│   │   │   ├── numbers.service.ts
│   │   │   ├── cards.service.ts
│   │   │   └── words.service.ts
│   │   ├── sessions/              # Evaluation, scoring, historical stats
│   │   │   ├── sessions.controller.ts
│   │   │   └── sessions.service.ts
│   │   ├── pao/                   # PAO dictionary CRUD & Major system seed
│   │   │   ├── pao.controller.ts
│   │   │   ├── pao.service.ts
│   │   │   └── pao-seed.data.ts
│   │   ├── entities/              # TypeORM entities: User, Session, PaoEntry
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                      # Unit & E2E tests
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                      # Angular 18+ Standalone App
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # AuthService, ApiService, GameStore (Signals)
│   │   │   ├── shared/            # Navbar, Keypad, CardVisual, Timer, ScoreBoard
│   │   │   └── features/
│   │   │       ├── dashboard/     # Game discipline launcher & quick stats
│   │   │       ├── speed-numbers/ # Numbers Memorize & Recall components
│   │   │       ├── speed-cards/   # Cards Memorize & Recall components
│   │   │       ├── words-trainer/ # Words Memorize & Recall components
│   │   │       ├── pao-manager/   # Interactive 00-99 & Cards PAO matrix editor
│   │   │       └── stats/         # Historical performance charts & benchmarks
│   │   ├── styles.scss            # Obsidian/Slate dark mode & light mode
│   │   └── main.ts
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
└── package.json                   # Root orchestrator (npm run dev:all)
```

---

## 4. REST API Specification

### Game Generation & Evaluation
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/games/numbers/generate` | Generates random digit sequence given length & chunk size |
| `POST` | `/api/games/cards/generate` | Generates shuffled card deck given deck size |
| `POST` | `/api/games/words/generate` | Generates randomized words from dictionary |
| `POST` | `/api/sessions/evaluate` | Evaluates recall sequence against target, calculates score & accuracy, stores record |
| `GET` | `/api/sessions/history` | Retrieves recent sessions and personal records |
| `GET` | `/api/sessions/stats` | Aggregated analytics (avg accuracy, speed trends) |

### PAO System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pao` | Retrieves current user's PAO table (or default seed) |
| `PUT` | `/api/pao/:id` | Updates a specific number/card PAO definition |
| `POST` | `/api/pao/reset` | Resets PAO table back to default Major System seed |

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/guest` | Returns instant guest JWT token with isolated session capability |
| `POST` | `/api/auth/register` | Registers new user account |
| `POST` | `/api/auth/login` | Authenticates credentials and issues JWT |

---

## 5. Frontend State Management & Ergonomics

1. **Angular Signals**:
   - `GameStore` provides atomic, ultra-fast reactive signals for `activeLocus`, `isTimerRunning`, `memorizationTimeMs`, `recallAnswers`, `evaluatedResult`.
2. **Keyboard Ergonomics**:
   - Dedicated keyboard listener handles memory athlete keybinds:
     - `Space` / `ArrowRight`: Advance to next locus.
     - `ArrowLeft` / `Backspace`: Return to previous locus.
     - `Escape`: Cancel session / back to config.
     - `Enter`: Submit recall or advance phase.
3. **Design Aesthetic**:
   - Deep obsidian memory sports dark theme with neon cyan & amber accents for high focus and zero visual fatigue.
   - Smooth card transitions and tactile input indicators.
