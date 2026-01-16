import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
});

test('homepage has title and homePage section', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Bayu Aksana/);

    // Check for homePage section which is the default on homepage
    await expect(page.locator('div#section-homePage')).toBeVisible();
});

test('should navigate to the systemsPage page', async ({ page }) => {
    await page.goto('/');

    // Click the Systems link in the navigation
    await page.getByRole('link', { name: 'Systems' }).click();

    await expect(page).toHaveURL('/systems');

    // Wait for content to load
    await expect(page.locator('article').first()).toBeVisible();
});

test('should toggle theme', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const isDarkInitially = await html.getAttribute('class').then((c) => c?.includes('dark'));

    await page.getByLabel('Toggle theme').click();

    if (isDarkInitially) {
        await expect(html).not.toHaveClass(/dark/);
    } else {
        await expect(html).toHaveClass(/dark/);
    }
});

test('Ctrl/Cmd+K focuses search input', async ({ page, browserName }) => {
    await page.goto('/');

    if (browserName === 'webkit') {
        await page.keyboard.press('Meta+K');
    } else {
        await page.keyboard.press('Control+K');
    }

    await expect(page.locator('input[placeholder="Search…"]')).toBeFocused();
});
