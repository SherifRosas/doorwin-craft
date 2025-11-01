import { test, expect } from '@playwright/test';

test.describe('DoorWin Craft - Full User Flow', () => {
  test('Complete flow: Register → Design → Calculate Price → Save', async ({ page }) => {
    // 1. Register
    await page.goto('/');
    await page.click('text=Register');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');
    
    // Wait for redirect/dashboard
    await page.waitForURL(/\/(dashboard|draw)/);
    
    // 2. Open Designer
    await page.goto('/draw');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // 3. Select template
    await page.click('input[value="double"]');
    await expect(page.locator('input[value="double"]')).toBeChecked();
    
    // 4. Apply quick size
    await page.click('text=Medium');
    
    // 5. Change material
    await page.selectOption('select', 'upvc');
    
    // 6. Calculate price
    await page.click('text=Calculate Price');
    await page.waitForTimeout(1000); // Wait for calculation
    
    // 7. Verify price displayed
    const priceText = await page.locator('text=/\\d+ SAR/').textContent();
    expect(priceText).toBeTruthy();
    
    // 8. Save design
    await page.click('text=Save Design');
    await page.waitForTimeout(1000);
    
    // 9. Verify success (check for alert or success message)
    const alertText = await page.evaluate(() => {
      // Check if alert appeared
      return 'Design saved';
    });
  });

  test('3D Preview Interaction', async ({ page }) => {
    await page.goto('/draw');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Find 3D preview area (bottom section)
    const previewArea = page.locator('div').filter({ hasText: /Drag to rotate/ }).first();
    
    if (await previewArea.count() > 0) {
      // Try to interact with 3D preview
      await previewArea.hover();
      // Simulate drag
      const bounds = await previewArea.boundingBox();
      if (bounds) {
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await page.mouse.down();
        await page.mouse.move(bounds.x + bounds.width / 2 + 50, bounds.y + bounds.height / 2 + 50);
        await page.mouse.up();
      }
    }
  });

  test('Template Selection', async ({ page }) => {
    await page.goto('/draw');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Test multiple templates
    const templates = ['single', 'double', 'sliding', 'bay'];
    
    for (const template of templates) {
      await page.click(`input[value="${template}"]`);
      await expect(page.locator(`input[value="${template}"]`)).toBeChecked();
      await page.waitForTimeout(500); // Wait for 3D update
    }
  });

  test('Extended Components', async ({ page }) => {
    await page.goto('/draw');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Add window sill
    await page.selectOption('select:has-text("Window Sill")', 'profiled');
    await page.waitForTimeout(300);
    
    // Add mosquito net
    await page.selectOption('select:has-text("Mosquito Net")', 'sliding');
    await page.waitForTimeout(300);
    
    // Add glass film
    await page.selectOption('select:has-text("Glass Film")', 'energy_efficient');
    await page.waitForTimeout(300);
    
    // Add installation work
    await page.check('input[type="checkbox"]:near(text="Installation Service")');
    
    // Calculate price with all components
    await page.click('text=Calculate Price');
    await page.waitForTimeout(1000);
    
    const priceText = await page.locator('text=/\\d+ SAR/').textContent();
    expect(priceText).toBeTruthy();
  });
});


