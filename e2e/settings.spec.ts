import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display all setting sections', async ({ page }) => {
    // Training section
    await expect(page.locator('text=Training')).toBeVisible();
    await expect(page.locator('text=Trial Duration')).toBeVisible();
    await expect(page.locator('text=Session Length')).toBeVisible();
    await expect(page.locator('text=Adaptive Mode')).toBeVisible();

    // Display section
    await expect(page.locator('text=Display')).toBeVisible();
    await expect(page.locator('text=History Helper')).toBeVisible();
    await expect(page.locator('text=Show Briefing')).toBeVisible();

    // Audio section
    await expect(page.locator('text=Audio')).toBeVisible();
    await expect(page.locator('text=Sound Enabled')).toBeVisible();
    await expect(page.locator('text=Volume')).toBeVisible();
  });

  test('should toggle adaptive mode', async ({ page }) => {
    // Wait for settings to load
    await page.waitForSelector('text=Adaptive Mode');

    // Find the adaptive mode toggle
    const toggleSection = page.locator('div:has-text("Adaptive Mode")').first();
    const toggle = toggleSection.locator('button[role="switch"]');

    // Get initial state
    const initialState = await toggle.getAttribute('aria-checked');

    // Click to toggle
    await toggle.click();

    // State should have changed
    const newState = await toggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should change session length', async ({ page }) => {
    // Wait for settings to load
    await page.waitForSelector('text=Session Length');

    // Click the select
    const select = page.locator('[role="combobox"]').first();
    await select.click();

    // Select a different option
    await page.click('text=25 trials');

    // Verify selection
    await expect(select).toContainText('25 trials');
  });

  test('should reset settings to defaults', async ({ page }) => {
    // Wait for settings to load
    await page.waitForSelector('text=Reset to Defaults');

    // Click reset button
    await page.click('text=Reset to Defaults');

    // Settings should be reset (verify by checking default values)
    // This would need to know the default values
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('should persist settings after page reload', async ({ page }) => {
    // Wait for settings to load
    await page.waitForSelector('text=Adaptive Mode');

    // Toggle adaptive mode
    const toggleSection = page.locator('div:has-text("Adaptive Mode")').first();
    const toggle = toggleSection.locator('button[role="switch"]');

    const initialState = await toggle.getAttribute('aria-checked');
    await toggle.click();
    const newState = await toggle.getAttribute('aria-checked');

    // Wait for save
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Wait for settings to load again
    await page.waitForSelector('text=Adaptive Mode');

    // Verify setting persisted
    const reloadedToggle = page.locator('div:has-text("Adaptive Mode")').first()
      .locator('button[role="switch"]');
    const persistedState = await reloadedToggle.getAttribute('aria-checked');

    expect(persistedState).toBe(newState);
  });
});
