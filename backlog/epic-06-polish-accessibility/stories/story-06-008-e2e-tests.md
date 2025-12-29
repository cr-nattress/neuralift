# Story 06-008: Write E2E Tests

## Story

**As a** developer
**I want** end-to-end tests
**So that** critical user flows are verified

## Points: 8

## Priority: High

## Status: TODO

## Description

Write Playwright E2E tests covering critical user flows: onboarding, level selection, training session, results viewing, and settings.

## Acceptance Criteria

- [ ] Playwright configured
- [ ] Test: Complete training session flow
- [ ] Test: Keyboard shortcuts work
- [ ] Test: Settings persist
- [ ] Test: Progress updates
- [ ] Test: Accessibility audit passes

## Test Cases

```typescript
// e2e/training-session.spec.ts
test('completes a training session', async ({ page }) => {
  await page.goto('/train/position-1back');
  await page.click('text=BEGIN SESSION');
  await page.waitForTimeout(3000); // Countdown

  // Complete trials
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(3000);
    if (Math.random() > 0.7) {
      await page.press('body', 'a');
    }
  }

  await expect(page.locator('text=SESSION COMPLETE')).toBeVisible();
});

test('keyboard shortcuts work', async ({ page }) => {
  await page.goto('/train/dual-1back/session');
  await page.waitForSelector('[data-tour="grid"]');

  await page.press('body', 'a'); // Position response
  await page.press('body', 'l'); // Audio response
  await page.press('body', 'Escape'); // Pause

  await expect(page.locator('text=Paused')).toBeVisible();
});

// e2e/accessibility.spec.ts
test('no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Tasks

- [ ] Install Playwright
- [ ] Configure Playwright for Next.js
- [ ] Write training session test
- [ ] Write keyboard shortcuts test
- [ ] Write settings persistence test
- [ ] Write progress update test
- [ ] Install @axe-core/playwright
- [ ] Write accessibility tests
- [ ] Add to CI pipeline

## Dependencies

- All features built and working
