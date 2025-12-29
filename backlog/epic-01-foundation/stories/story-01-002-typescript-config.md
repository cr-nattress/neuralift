# Story 01-002: Configure TypeScript Strict Mode

## Story

**As a** developer
**I want** TypeScript configured in strict mode
**So that** I catch type errors early and maintain code quality

## Points: 2

## Priority: Critical

## Status: TODO

## Description

Configure TypeScript with strict mode and additional safety checks for both the Next.js application and the core package.

## Acceptance Criteria

- [ ] Root tsconfig.json configured with strict mode
- [ ] Path aliases configured (@/* for src)
- [ ] All strict flags enabled
- [ ] noUncheckedIndexedAccess enabled
- [ ] exactOptionalPropertyTypes enabled
- [ ] No TypeScript errors in existing code

## Technical Details

### Root tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@neuralift/core": ["./packages/core/src"],
      "@neuralift/core/*": ["./packages/core/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "packages"]
}
```

## Tasks

- [ ] Update root tsconfig.json with strict settings
- [ ] Add path aliases for core package
- [ ] Run tsc --noEmit to verify no errors
- [ ] Update any code that fails type checks

## Notes

- exactOptionalPropertyTypes may require code adjustments
- noUncheckedIndexedAccess adds safety but requires explicit checks
