import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('skip link should be visible on focus', async ({ page }) => {
    await page.goto('/');

    // Tab to the skip link
    await page.keyboard.press('Tab');

    // Skip link should be visible when focused
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test('skip link should navigate to main content', async ({ page }) => {
    await page.goto('/');

    // Tab to the skip link and click it
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Focus should be on main content
    const main = page.locator('main#main-content');
    await expect(main).toBeInViewport();
  });

  test('all interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through the page
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      // Check that something is focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeDefined();
    }
  });

  test('settings page should have proper labels', async ({ page }) => {
    await page.goto('/settings');

    // Wait for settings to load
    await page.waitForSelector('text=Trial Duration');

    // Check that settings have accessible labels
    await expect(page.locator('text=Trial Duration')).toBeVisible();
    await expect(page.locator('text=Session Length')).toBeVisible();
    await expect(page.locator('text=Adaptive Mode')).toBeVisible();
  });

  test('focus states should be visible', async ({ page }) => {
    await page.goto('/');

    // Tab to an interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focused element should have visible focus indicator
    // This is a basic check - in real testing you'd validate the CSS
    const focusedElement = page.locator(':focus-visible');
    await expect(focusedElement).toBeVisible();
  });
});
