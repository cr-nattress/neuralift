# Story 01-003: Setup Monorepo Structure

## Story

**As a** developer
**I want** a monorepo structure with npm workspaces
**So that** the core domain can be developed as a separate package

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Configure the project as a monorepo using npm workspaces, with the main Next.js app at the root and the core domain as a separate package under `packages/core`.

## Acceptance Criteria

- [ ] packages/ directory created
- [ ] npm workspaces configured in root package.json
- [ ] packages/core initialized with its own package.json
- [ ] Path aliases work across packages
- [ ] Build scripts work for both packages
- [ ] Core package can be imported in the app

## Technical Details

### Root package.json Updates

```json
{
  "name": "neuralift",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "next dev",
    "build": "npm run build:core && next build",
    "build:core": "npm run build -w @neuralift/core",
    "test": "npm run test:core && npm run test:app",
    "test:core": "npm run test -w @neuralift/core",
    "typecheck": "tsc --noEmit && npm run typecheck -w @neuralift/core"
  }
}
```

### Folder Structure

```
├── packages/
│   └── core/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
├── src/
│   └── ... (Next.js app)
├── package.json
└── tsconfig.json
```

### Core package.json

```json
{
  "name": "@neuralift/core",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "zod": "^3.0.0"
  }
}
```

## Tasks

- [ ] Create packages/ directory
- [ ] Create packages/core/ structure
- [ ] Add package.json for core
- [ ] Update root package.json with workspaces
- [ ] Install tsup and vitest in core
- [ ] Create placeholder index.ts
- [ ] Verify npm install links packages
- [ ] Verify build:core works

## Dependencies

- Story 01-001 (Initialize Next.js Project)
- Story 01-002 (TypeScript Config)

## Notes

- Use npm workspaces (not lerna or turborepo) for simplicity
- tsup handles TypeScript compilation and bundling
