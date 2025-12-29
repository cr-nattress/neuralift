# Story 02-002: Configure Typography

## Story

**As a** designer
**I want** consistent typography throughout the app
**So that** the visual hierarchy is clear and readable

## Points: 2

## Priority: Critical

## Status: TODO

## Description

Configure the typography system using Inter (variable font) for body and UI text, with a secondary display font option. Set up responsive font scaling.

## Acceptance Criteria

- [ ] Inter variable font loaded
- [ ] Font weights available: 300, 400, 500, 600, 700
- [ ] Font CSS variables defined
- [ ] Typography scale implemented
- [ ] Tailwind classes configured for typography

## Technical Details

### Font Loading (layout.tsx)

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

### globals.css Typography Variables

```css
:root {
  /* FONTS */
  --font-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;

  /* FONT SIZES */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */

  /* LINE HEIGHTS */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* LETTER SPACING */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}

/* Typography defaults */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: var(--tracking-tight);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }
h5 { font-size: var(--text-lg); }
h6 { font-size: var(--text-base); }

p {
  line-height: var(--leading-relaxed);
}

small {
  font-size: var(--text-sm);
}
```

### Tailwind Config Addition

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      display: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
    },
  },
}
```

## Tasks

- [ ] Import Inter from next/font/google
- [ ] Apply font variable to html element
- [ ] Add typography CSS variables to globals.css
- [ ] Add heading styles
- [ ] Update Tailwind config with font family

## Dependencies

- Story 02-001 (CSS Variables)

## Notes

- Inter is highly legible and works well for both UI and body text
- Variable font reduces file size and allows flexible weights
