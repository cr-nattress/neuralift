# Neuralift

**Train your working memory with science-backed dual n-back exercises.**

[![CI](https://github.com/cr-nattress/neuralift/actions/workflows/ci.yml/badge.svg)](https://github.com/cr-nattress/neuralift/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Phases](#development-phases)
- [Contributing](#contributing)
- [License](#license)

---

## About

Neuralift is a progressive dual n-back training application designed to enhance working memory and cognitive performance. Built on research-backed methodologies, it guides users from foundational single-modality exercises to advanced dual-stream training with personalized AI-driven feedback.

The app features a premium "Neural Luxe" aesthetic—a fusion of clinical precision and luxury minimalism—creating an experience that feels like a high-end cognitive lab designed by a Scandinavian design studio.

### What is Dual N-Back?

Dual n-back is a cognitive training task that challenges your working memory by requiring you to track two independent streams of information (visual positions and audio letters) simultaneously. Research suggests this type of training may improve working memory capacity, fluid intelligence, and cognitive control.

---

## Features

- **Progressive Training Path** - Start with position-only and audio-only 1-back, advance through dual 2-back to elite 3-back levels
- **Intelligent Analytics** - Comprehensive user interaction tracking powers personalized recommendations
- **AI-Powered Feedback** - LLM integration provides real-time coaching and performance insights via Anthropic Claude
- **D-Prime Scoring** - Signal detection theory-based metrics for accurate performance measurement
- **Contextual Help System** - Rich popovers explain the "why" behind every feature with scientific backing
- **Guided Onboarding** - First-time user tour ensures smooth learning curve
- **History Helper** - Training wheels that fade as skills develop
- **Streak Tracking** - Gamified consistency motivation with daily goals
- **Offline-First** - Local IndexedDB storage keeps your data private and accessible
- **Premium Aesthetics** - Glassmorphism, subtle animations, and a refined dark theme

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/cr-nattress/neuralift.git
cd neuralift

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY for LLM features (optional)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start training.

### First Session

1. **Landing Page** - Get an overview and start your journey
2. **Level Selection** - Begin with Position 1-Back or Audio 1-Back
3. **Briefing** - Learn the controls and see an animated example
4. **Training** - Complete 20-25 trials per session
5. **Results** - Review your performance with AI-generated insights

---

## Architecture

Neuralift is built with **Clean Architecture** principles, ensuring complete separation between business logic and UI concerns:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│   Next.js App Router, React Components, Zustand UI State            │
│   (Replaceable: Could be Vue, React Native, CLI, etc.)              │
├─────────────────────────────────────────────────────────────────────┤
│                         APPLICATION LAYER                           │
│   Use Cases, Application Services, Orchestration                    │
│   (React Hooks that compose core services)                          │
├─────────────────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE LAYER                           │
│   Adapters: IndexedDB, Web Audio, Fetch API, LocalStorage           │
│   (Implements Port interfaces defined by Core)                      │
├─────────────────────────────────────────────────────────────────────┤
│                          CORE DOMAIN                                │
│   Business Logic, Entities, Value Objects, Domain Services          │
│   Port Interfaces (contracts for external dependencies)             │
│   Zero external dependencies - pure TypeScript                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Benefits

- **UI Interchangeability** - Core doesn't know React exists
- **Serverless Ready** - Core can run in Edge Functions, AWS Lambda, etc.
- **Testability** - Test business logic without mocking UI
- **Package Extraction** - Core can become `@neuralift/core` npm package

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS Variables |
| Animation | Framer Motion |
| UI Primitives | Radix UI (Popover, Dialog, Progress, Tooltip) |
| State | Zustand (UI state only) |
| Storage | Dexie.js (IndexedDB wrapper) |
| Audio | Howler.js |
| AI | Anthropic Claude API |
| Testing | Vitest + Playwright |

---

## Project Structure

```
├── packages/
│   └── core/                      # CORE DOMAIN (publishable)
│       ├── src/
│       │   ├── domain/            # Entities & Value Objects
│       │   ├── services/          # Domain Services
│       │   ├── ports/             # Port Interfaces
│       │   ├── use-cases/         # Application Use Cases
│       │   └── config/            # Static Configuration
│       └── __tests__/             # Core unit tests
│
├── src/                           # NEXT.JS APPLICATION
│   ├── app/                       # Pages (App Router)
│   │   ├── train/                 # Training flow
│   │   ├── results/               # Session results
│   │   ├── progress/              # Statistics & history
│   │   └── settings/              # User preferences
│   ├── components/                # React Components
│   │   ├── ui/                    # Design system
│   │   ├── training/              # Game components
│   │   └── help/                  # Help system
│   ├── infrastructure/            # Adapter Implementations
│   ├── application/               # Hooks & Providers
│   └── content/                   # Popover content library
│
└── prompts/                       # Development planning
    └── phases/                    # Phase-by-phase specs
```

---

## Development Phases

The project is organized into 6 development phases:

### Phase 1: Foundation & Project Setup
Establish Clean Architecture, monorepo structure, core domain module with port interfaces, and dependency injection patterns.

### Phase 2: Design System & Base Components
Implement the "Neural Luxe" design system with complete color palette, typography, Tailwind configuration, and base UI components.

### Phase 3: Training Infrastructure
Build game logic, sequence generation, scoring (d-prime), audio system, state management, analytics tracking, and LLM integration.

### Phase 4: Page Development
Create all application pages: Landing, Level Selection, Briefing, Training Session, Results, Settings, and Progress.

### Phase 5: Help System & Contextual Content
Implement intelligent popovers, guided tour for first-time users, quick help during sessions, and educational "Learn More" modal.

### Phase 6: Polish, Animations & Accessibility
Finalize with refined animations, responsive design, WCAG 2.1 AA compliance, performance optimization, and comprehensive testing.

See the [prompts/phases/](prompts/phases/) directory for detailed specifications.

---

## Training Levels

| Level | Mode | N-Back | Description |
|-------|------|--------|-------------|
| Position 1-Back | Position Only | 1 | Track grid positions |
| Position 2-Back | Position Only | 2 | Match 2 steps ago |
| Audio 1-Back | Audio Only | 1 | Track letter sounds |
| Audio 2-Back | Audio Only | 2 | Match 2 steps ago |
| Dual 1-Back | Dual | 1 | Combined training begins |
| Dual 2-Back | Dual | 2 | Classic research protocol |
| Dual 2-Back Fast | Dual | 2 | Reduced trial duration |
| Dual 3-Back | Dual | 3 | Elite level |

Levels unlock progressively based on performance (70%+ accuracy threshold).

---

## Analytics & AI Features

### User Behavioral Profile

The app tracks comprehensive interaction data to build personalized profiles:

- **Performance Patterns** - Accuracy trends, response times, error patterns, fatigue indicators
- **Learning Patterns** - Progression rate, plateau detection, learning velocity
- **Engagement Patterns** - Session habits, streaks, preferred training times
- **Help-Seeking Behavior** - Popover usage, tutorial completion

### LLM-Powered Feedback

Powered by Anthropic Claude, the app provides:

- **Session Feedback** - Personalized analysis after each session
- **Recommendations** - Suggested levels and training focus
- **Motivational Messages** - Context-aware encouragement
- **In-Session Tips** - Real-time guidance based on recent performance

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...           # Required for LLM features
NEXT_PUBLIC_LLM_API_ENDPOINT=/api/llm  # Can be customized for external API
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) and [Code of Conduct](.github/CODE_OF_CONDUCT.md) before submitting pull requests.

### Development Setup

```bash
# Clone and install
git clone https://github.com/cr-nattress/neuralift.git
cd neuralift
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build core package
npm run build:core

# Type checking
npm run typecheck
```

### Areas for Contribution

- UI/UX improvements
- Additional training modes
- Accessibility enhancements
- Performance optimizations
- Documentation
- Testing coverage

---

## Accessibility

Neuralift is committed to WCAG 2.1 AA compliance:

- Full keyboard navigation support
- Screen reader announcements for game events
- Reduced motion support (`prefers-reduced-motion`)
- Minimum 4.5:1 color contrast ratios
- 44x44px minimum touch targets
- Focus indicators on all interactive elements

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Dual n-back research by Jaeggi et al.
- Signal detection theory (d-prime) methodology
- Open-source community for the amazing tools

---

<p align="center">
  <strong>Train your brain. Expand your potential.</strong>
</p>
