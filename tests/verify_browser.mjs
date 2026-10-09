import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const SCREENSHOT_DIR = 'C:/Users/mouli/.gemini/antigravity-ide/brain/9163b6d6-1cdc-4481-9458-f894936e5e8b';

async function runBrowserVerification() {
  console.log('Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const report = [];

  try {
    // 1. Visit Tracker (Lyfta Pillar)
    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const title = await page.title();
    report.push(`Page Title: ${title}`);
    console.log('Page Title:', title);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_1_tracker_home.png') });
    report.push('Screenshot 1: screen_1_tracker_home.png captured.');

    // 2. Interacting with Sets (Lyfta Pillar)
    console.log('Testing workout sets interaction...');
    const firstAddSetBtn = page.locator('button[aria-label="Add working set"]').first();
    if (await firstAddSetBtn.isVisible()) {
      await firstAddSetBtn.click();
      await page.waitForTimeout(500);
      report.push('Added a working set to the first exercise.');
    }

    const firstIncWeightBtn = page.locator('button[aria-label^="Increase weight"]').first();
    if (await firstIncWeightBtn.isVisible()) {
      await firstIncWeightBtn.click();
      await page.waitForTimeout(500);
      report.push('Adjusted working weight on Set 1.');
    }

    const firstLogSetBtn = page.locator('button[aria-label^="Log set"]').first();
    if (await firstLogSetBtn.isVisible()) {
      await firstLogSetBtn.click();
      await page.waitForTimeout(500);
      report.push('Logged Set 1 as completed.');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_2_tracker_sets.png') });
    report.push('Screenshot 2: screen_2_tracker_sets.png captured.');

    // 3. Navigate to Nutrition (MyFitnessPal Pillar)
    console.log('Navigating to Nutrition & Macro Diary (/nutrition)...');
    await page.locator('#nav-nutrition-btn').click();
    await page.waitForTimeout(1000);

    const nutritionHeading = await page.getByRole('heading', { name: 'Nutrition & Macro Diary' }).isVisible();
    const hudEquation = await page.locator('text=Remaining = Goal − Food + Workout').isVisible();
    report.push(`Nutrition Page Heading Visible: ${nutritionHeading}`);
    report.push(`Calorie HUD Equation Visible: ${hudEquation}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_3_nutrition_hud.png') });
    report.push('Screenshot 3: screen_3_nutrition_hud.png captured.');

    // 4. Test Log Food Dialog
    console.log('Opening Log Food Dialog...');
    const logFoodBtn = page.locator('button:has-text("Log Food")').first();
    if (await logFoodBtn.isVisible()) {
      await logFoodBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_4_nutrition_log_dialog.png') });
      report.push('Screenshot 4: screen_4_nutrition_log_dialog.png captured.');

      // Select a food from library
      await page.locator('.MuiDialog-container').waitFor();
      const addToDiaryBtn = page.locator('button:has-text("Add to Diary")');
      if (await addToDiaryBtn.isVisible()) {
        await page.locator('input[placeholder*="Grilled Flank Steak"]').fill('Grass-Fed Flank Steak');
        await addToDiaryBtn.click();
        await page.waitForTimeout(800);
        report.push('Submitted custom food item to diary.');
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_5_nutrition_updated.png') });
    report.push('Screenshot 5: screen_5_nutrition_updated.png captured.');

    // 5. Navigate to Food Intel (Yuka Pillar)
    console.log('Navigating to Food Quality & Ingredient Intel (/food-intel)...');
    await page.locator('#nav-food-intel-btn').click();
    await page.waitForTimeout(1000);

    const foodIntelHeading = await page.getByRole('heading', { name: 'Food Quality & Ingredient Intel' }).isVisible();
    report.push(`Food Intel Heading Visible: ${foodIntelHeading}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_6_food_intel_directory.png') });
    report.push('Screenshot 6: screen_6_food_intel_directory.png captured.');

    // 6. Search for Soda / Warning Food & Clean Swaps
    console.log('Searching for warning foods & clean swaps...');
    const searchInput = page.getByPlaceholder(/Search verified foods/i);
    await searchInput.fill('Soda');
    await page.waitForTimeout(600);

    const cleanSwapVisible = await page.locator('text=Recommended Clean Swap').isVisible();
    report.push(`Clean Swap Recommendation Visible: ${cleanSwapVisible}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'screen_7_food_intel_clean_swaps.png') });
    report.push('Screenshot 7: screen_7_food_intel_clean_swaps.png captured.');

    console.log('\n--- VERIFICATION REPORT ---');
    console.log(report.join('\n'));
  } catch (err) {
    console.error('Error during browser verification:', err);
  } finally {
    await browser.close();
    console.log('Browser closed cleanly.');
  }
}

runBrowserVerification();
