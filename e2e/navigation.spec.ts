import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check for the main logo/title
    await expect(page.locator('text=Neuralift')).toBeVisible();

    // Check for main content area
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  test('should navigate to levels page', async ({ page }) => {
    await page.goto('/');

    // Click on "Start Training" or similar button
    await page.click('text=Start Training');

    // Should be on levels page
    await expect(page).toHaveURL('/levels');
    await expect(page.locator('text=Choose Your Training')).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/');

    // Click on settings icon
    await page.click('[aria-label="Settings"]');

    // Should be on settings page
    await expect(page).toHaveURL('/settings');
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('should navigate to progress page', async ({ page }) => {
    await page.goto('/');

    // Click on progress icon
    await page.click('[aria-label="View progress"]');

    // Should be on progress page
    await expect(page).toHaveURL('/progress');
    await expect(page.locator('text=Your Progress')).toBeVisible();
  });

  test('should navigate back to home from settings', async ({ page }) => {
    await page.goto('/settings');

    // Click back button
    await page.click('text=Back');

    // Should be back on home
    await expect(page).toHaveURL('/');
  });
});
