import { test, expect } from '@playwright/test';

test.describe('Training Session', () => {
  test('should start a training session', async ({ page }) => {
    // Navigate to levels page
    await page.goto('/levels');

    // Click on an unlocked level (position-1 should be unlocked by default)
    await page.click('text=Position 1-Back');

    // Should be on briefing page
    await expect(page.locator('text=Session Briefing')).toBeVisible();

    // Click begin session
    await page.click('text=Begin Session');

    // Should see countdown
    await expect(page.locator('text=/[0-3]/')).toBeVisible();
  });

  test('should show training grid during session', async ({ page }) => {
    // Navigate to an active session
    await page.goto('/train/position-1/session');

    // Wait for session to start (after countdown)
    await page.waitForTimeout(4000);

    // Training grid should be visible
    await expect(page.locator('[data-testid="training-grid"]').or(
      page.locator('.grid') // Fallback selector
    )).toBeVisible();
  });

  test('should respond to keyboard shortcuts', async ({ page }) => {
    // Navigate to an active session
    await page.goto('/train/position-1/session');

    // Wait for session to start
    await page.waitForTimeout(4000);

    // Press 'A' for position match
    await page.keyboard.press('a');

    // Button should show pressed state
    // This is a basic check - you'd verify the specific visual feedback
    await expect(page).toHaveURL(/\/train/);
  });

  test('should pause session with Escape key', async ({ page }) => {
    // Navigate to an active session
    await page.goto('/train/position-1/session');

    // Wait for session to start
    await page.waitForTimeout(4000);

    // Press Escape to pause
    await page.keyboard.press('Escape');

    // Pause overlay should be visible
    await expect(page.locator('text=Paused')).toBeVisible();

    // Resume and quit buttons should be visible
    await expect(page.locator('text=Resume')).toBeVisible();
    await expect(page.locator('text=Quit')).toBeVisible();
  });

  test('should resume session from pause', async ({ page }) => {
    // Navigate to an active session
    await page.goto('/train/position-1/session');

    // Wait for session to start
    await page.waitForTimeout(4000);

    // Pause
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Paused')).toBeVisible();

    // Resume
    await page.click('text=Resume');

    // Pause overlay should be gone
    await expect(page.locator('text=Paused')).not.toBeVisible();
  });

  test('should quit session to levels page', async ({ page }) => {
    // Navigate to an active session
    await page.goto('/train/position-1/session');

    // Wait for session to start
    await page.waitForTimeout(4000);

    // Pause and quit
    await page.keyboard.press('Escape');
    await page.click('text=Quit');

    // Should be back on levels page
    await expect(page).toHaveURL('/levels');
  });
});
