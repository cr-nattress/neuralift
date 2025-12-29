# Contributing to Neuralift

Thank you for your interest in contributing to Neuralift! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/cr-nattress/neuralift/issues)
2. If not, create a new issue using the bug report template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### Suggesting Features

1. Check existing [Issues](https://github.com/cr-nattress/neuralift/issues) for similar suggestions
2. Create a new issue using the feature request template
3. Describe the feature and its benefits
4. Include mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Write or update tests as needed
5. Run the test suite: `npm run test`
6. Run type checking: `npm run typecheck`
7. Run linting: `npm run lint`
8. Commit with clear messages following [Conventional Commits](https://www.conventionalcommits.org/)
9. Push and create a Pull Request

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/neuralift.git
cd neuralift

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
neuralift/
├── packages/core/      # Domain logic (Clean Architecture)
│   ├── src/
│   │   ├── domain/     # Entities, value objects, events
│   │   ├── ports/      # Repository interfaces
│   │   ├── services/   # Domain services
│   │   └── use-cases/  # Application use cases
├── src/
│   ├── app/            # Next.js pages (App Router)
│   ├── application/    # React hooks, providers, stores
│   ├── components/     # UI components
│   ├── infrastructure/ # Repository implementations
│   └── lib/            # Utilities
├── e2e/                # Playwright E2E tests
└── supabase/           # Database migrations
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Coding Standards

### TypeScript

- Use strict mode
- Prefer explicit types over inference for function parameters
- Use interfaces for object shapes
- Avoid `any` - use `unknown` if type is truly unknown

### React

- Use functional components with hooks
- Keep components small and focused
- Use `'use client'` directive only when necessary
- Prefer composition over prop drilling

### CSS

- Use Tailwind CSS utility classes
- Follow the design system in `globals.css`
- Use CSS variables for theming
- Support reduced motion preferences

### Testing

- Write unit tests for business logic
- Write E2E tests for critical user flows
- Aim for meaningful coverage, not 100%

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new training mode
fix: correct scoring calculation
docs: update README
style: format code
refactor: simplify session logic
test: add E2E tests for settings
chore: update dependencies
```

## Architecture

Neuralift follows Clean Architecture principles:

1. **Domain Layer** (`packages/core`) - Pure business logic, no dependencies
2. **Application Layer** (`src/application`) - React hooks, state management
3. **Infrastructure Layer** (`src/infrastructure`) - Database, API implementations
4. **Presentation Layer** (`src/components`, `src/app`) - UI components and pages

### Key Principles

- Domain logic is framework-agnostic
- Dependencies point inward
- Infrastructure implements domain interfaces
- UI consumes application hooks

## Getting Help

- Open an issue for bugs or features
- Start a discussion for questions
- Check existing documentation

Thank you for contributing!
