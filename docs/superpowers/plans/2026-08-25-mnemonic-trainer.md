# Mnemonic Memory Training Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-ready Mnemonic Memory Training Platform featuring Speed Numbers, Speed Cards (52-card deck), Random Words recall, and an interactive 00-99 + 52-card PAO (Person-Action-Object) Matrix with live in-session hints.

**Architecture:** Monorepo consisting of:
- **Backend**: Nest.js 10+ with SQLite + TypeORM, JWT/Guest authentication, deterministic & randomized sequence generators, PAO dictionary manager, Levenshtein fuzzy matching, and session scoring/diffing analytics.
- **Frontend**: Angular 18+ with Standalone Components, Signal-based state management (`GameStore`), high-contrast dark obsidian/cyan memory-sports UI, keyboard ergonomics (`Space`, `ArrowRight`, `ArrowLeft`, `Backspace`, `Enter`), card visualization, and interactive evaluation screens.

**Tech Stack:** 
- Frontend: Angular 18+, TypeScript, RxJS, Angular Signals, SCSS, Chart.js / Canvas analytics
- Backend: Nest.js 10+, TypeORM, SQLite, Passport-JWT, bcrypt, class-validator
- Monorepo: Concurrently / npm workspaces root scripts

**Spec:** [`docs/superpowers/specs/2026-08-25-mnemonic-trainer-design.md`](file:///c:/Users/a_abduvohidov/.gemini/antigravity-ide/scratch/mnemonic-trainer/docs/superpowers/specs/2026-08-25-mnemonic-trainer-design.md)

## Global Constraints

- Backend base port: `http://localhost:3000/api`
- Frontend dev server: `http://localhost:4200`
- Monorepo root directory: `C:\Users\a_abduvohidov\.gemini\antigravity-ide\scratch\mnemonic-trainer`
- Database: Embedded SQLite (`database.sqlite`) via TypeORM
- Full offline / guest-first capability: Users can train immediately as Guests without registration or register/login to persist historical progress.

---

### Task 1: Root Orchestration and Monorepo Scaffolding

**Files:**
- Create: `package.json` (root)
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Produces: Root npm scripts `npm run dev:all`, `npm run build:all`, `npm run test:all`

- [x] **Step 1: Create root package.json**
- [x] **Step 2: Create root .gitignore and README.md**
- [x] **Step 3: Verify root scripts structure**

---

### Task 2: Backend Core Setup, TypeORM Entities & Database

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/tsconfig.build.json`
- Create: `backend/nest-cli.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`
- Create: `backend/src/entities/user.entity.ts`
- Create: `backend/src/entities/session.entity.ts`
- Create: `backend/src/entities/pao-entry.entity.ts`
- Test: `backend/test/app.e2e-spec.ts`

- [x] **Step 1: Write backend dependencies & configs**
- [x] **Step 2: Define TypeORM Entities**
- [x] **Step 3: Configure AppModule & TypeORM connection**
- [x] **Step 4: Test database bootstrap**

---

### Task 3: Backend Auth Module (Guest & JWT Authentication)

**Files:**
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/auth.controller.ts`
- Create: `backend/src/auth/jwt.strategy.ts`
- Create: `backend/src/auth/optional-jwt.guard.ts`
- Create: `backend/src/auth/dto/register.dto.ts`
- Create: `backend/src/auth/dto/login.dto.ts`
- Test: `backend/src/auth/auth.service.spec.ts`

- [x] **Step 1: Write unit test for AuthService**
- [x] **Step 2: Implement AuthService and JwtStrategy**
- [x] **Step 3: Implement AuthController with validation DTOs**
- [x] **Step 4: Run AuthService unit tests and verify they pass**

---

### Task 4: Backend PAO (Person-Action-Object) Matrix & Seed Data

**Files:**
- Create: `backend/src/pao/pao-seed.data.ts` (100 Major System numbers 00-99 + 52 Playing Cards)
- Create: `backend/src/pao/pao.module.ts`
- Create: `backend/src/pao/pao.service.ts`
- Create: `backend/src/pao/pao.controller.ts`
- Create: `backend/src/pao/dto/update-pao.dto.ts`
- Test: `backend/src/pao/pao.service.spec.ts`

- [x] **Step 1: Build comprehensive Major System PAO Seed Data**
- [x] **Step 2: Write unit test for PaoService**
- [x] **Step 3: Implement PaoService & PaoController**
- [x] **Step 4: Run PaoService tests and verify all pass**

---

### Task 5: Backend Game Generation & Evaluation Engines

**Files:**
- Create: `backend/src/games/games.module.ts`
- Create: `backend/src/games/numbers.service.ts`
- Create: `backend/src/games/cards.service.ts`
- Create: `backend/src/games/words.service.ts`
- Create: `backend/src/games/words-dictionary.data.ts` (1,000+ words)
- Create: `backend/src/games/games.controller.ts`
- Create: `backend/src/sessions/sessions.module.ts`
- Create: `backend/src/sessions/sessions.service.ts`
- Create: `backend/src/sessions/sessions.controller.ts`
- Create: `backend/src/sessions/dto/evaluate-session.dto.ts`
- Test: `backend/src/games/games.service.spec.ts`
- Test: `backend/src/sessions/sessions.service.spec.ts`

- [x] **Step 1: Write unit tests for Numbers, Cards, and Words generation services**
- [x] **Step 2: Implement NumbersService, CardsService, and WordsService**
- [x] **Step 3: Write unit tests for SessionsService evaluation logic**
- [x] **Step 4: Implement SessionsService & SessionsController with historical query methods**
- [x] **Step 5: Run all backend tests and confirm 100% pass rate**

---

### Task 6: Frontend Scaffolding, Obsidian Theme & Design System

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/angular.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/src/index.html`
- Create: `frontend/src/main.ts`
- Create: `frontend/src/styles.scss`
- Create: `frontend/src/app/app.config.ts`
- Create: `frontend/src/app/app.routes.ts`
- Create: `frontend/src/app/app.component.ts`
- Create: `frontend/src/app/app.component.html`
- Create: `frontend/src/app/shared/components/navbar/navbar.component.ts`

- [x] **Step 1: Configure Angular 18+ Standalone Application**
- [x] **Step 2: Build `styles.scss` design system tokens**
- [x] **Step 3: Implement `NavbarComponent`**
- [x] **Step 4: Verify frontend builds and renders cleanly**

---

### Task 7: Frontend Core Services & Reactive GameStore (Signals)

**Files:**
- Create: `frontend/src/app/core/models/game.models.ts`
- Create: `frontend/src/app/core/models/pao.models.ts`
- Create: `frontend/src/app/core/models/auth.models.ts`
- Create: `frontend/src/app/core/services/api.service.ts`
- Create: `frontend/src/app/core/services/auth.service.ts`
- Create: `frontend/src/app/core/services/pao.service.ts`
- Create: `frontend/src/app/core/store/game.store.ts`

- [x] **Step 1: Define TypeScript interfaces**
- [x] **Step 2: Implement ApiService, AuthService, and PaoService**
- [x] **Step 3: Implement `GameStore` with Angular Signals**
- [x] **Step 4: Verify `GameStore` transitions**

---

### Task 8: Shared Memory Sports Components

**Files:**
- Create: `frontend/src/app/shared/components/timer-display/timer-display.component.ts`
- Create: `frontend/src/app/shared/components/card-visual/card-visual.component.ts`
- Create: `frontend/src/app/shared/components/pao-hint-bar/pao-hint-bar.component.ts`
- Create: `frontend/src/app/shared/components/evaluation-diff/evaluation-diff.component.ts`
- Create: `frontend/src/app/shared/components/keypad/keypad.component.ts`

- [x] **Step 1: Implement TimerDisplayComponent and CardVisualComponent**
- [x] **Step 2: Implement PaoHintBarComponent**
- [x] **Step 3: Implement EvaluationDiffComponent**
- [x] **Step 4: Implement KeypadComponent**

---

### Task 9: Speed Numbers Discipline (Config, Memorize, Recall, Diff)

**Files:**
- Create: `frontend/src/app/features/speed-numbers/speed-numbers.component.ts`
- Create: `frontend/src/app/features/speed-numbers/components/numbers-config/numbers-config.component.ts`
- Create: `frontend/src/app/features/speed-numbers/components/numbers-memorize/numbers-memorize.component.ts`
- Create: `frontend/src/app/features/speed-numbers/components/numbers-recall/numbers-recall.component.ts`

- [x] **Step 1: Build NumbersConfigComponent**
- [x] **Step 2: Build NumbersMemorizeComponent**
- [x] **Step 3: Build NumbersRecallComponent**
- [x] **Step 4: Wire to GameStore and backend evaluation endpoint**
- [x] **Step 5: Verify Numbers discipline flow**

---

### Task 10: Speed Cards Discipline (52-Deck Memorize & Card Picker Recall)

**Files:**
- Create: `frontend/src/app/features/speed-cards/speed-cards.component.ts`
- Create: `frontend/src/app/features/speed-cards/components/cards-config/cards-config.component.ts`
- Create: `frontend/src/app/features/speed-cards/components/cards-memorize/cards-memorize.component.ts`
- Create: `frontend/src/app/features/speed-cards/components/cards-recall/cards-recall.component.ts`

- [x] **Step 1: Build CardsConfigComponent**
- [x] **Step 2: Build CardsMemorizeComponent**
- [x] **Step 3: Build CardsRecallComponent**
- [x] **Step 4: Connect evaluation for misplaced cards**
- [x] **Step 5: Verify Speed Cards flow end-to-end**

---

### Task 11: Random Words Trainer & Levenshtein Recall

**Files:**
- Create: `frontend/src/app/features/words-trainer/words-trainer.component.ts`
- Create: `frontend/src/app/features/words-trainer/components/words-config/words-config.component.ts`
- Create: `frontend/src/app/features/words-trainer/components/words-memorize/words-memorize.component.ts`
- Create: `frontend/src/app/features/words-trainer/components/words-recall/words-recall.component.ts`

- [x] **Step 1: Build WordsConfigComponent**
- [x] **Step 2: Build WordsMemorizeComponent**
- [x] **Step 3: Build WordsRecallComponent**
- [x] **Step 4: Integrate backend Levenshtein fuzzy evaluation**

---

### Task 12: Interactive PAO Matrix Manager (00-99 & 52 Cards)

**Files:**
- Create: `frontend/src/app/features/pao-manager/pao-manager.component.ts`
- Create: `frontend/src/app/features/pao-manager/components/pao-edit-modal/pao-edit-modal.component.ts`

- [x] **Step 1: Build PaoManagerComponent**
- [x] **Step 2: Implement PaoEditModalComponent**
- [x] **Step 3: Implement Reset to Default dialog**
- [x] **Step 4: Verify PAO edits**

---

### Task 13: Dashboard, Performance Analytics & Auth Modal

**Files:**
- Create: `frontend/src/app/features/dashboard/dashboard.component.ts`
- Create: `frontend/src/app/features/stats/stats.component.ts`
- Create: `frontend/src/app/shared/components/auth-modal/auth-modal.component.ts`

- [x] **Step 1: Build DashboardComponent**
- [x] **Step 2: Build StatsComponent**
- [x] **Step 3: Implement AuthModalComponent**

---

### Task 14: End-to-End Verification & Polish

- [x] **Step 1: Run all backend tests (`npm test` in backend - 9/9 passing)**
- [x] **Step 2: Run frontend build (`npm run build` in frontend - 100% clean build)**
- [x] **Step 3: Test complete API endpoints (Auth, Numbers, Cards, Words, PAO, Evaluation, Stats)**
- [x] **Step 4: Verify both dev servers running simultaneously (`npm run dev:all`)**
