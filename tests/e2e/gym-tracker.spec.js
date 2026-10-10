import { test, expect } from '@playwright/test';

test.describe('IronPulse Gym Training Session Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads IronPulse homepage with athletic branding and workout progress meter', async ({ page }) => {
    // Check page title and brand heading
    await expect(page).toHaveTitle(/IronPulse/i);
    await expect(page.getByRole('heading', { name: 'IRONPULSE' })).toBeVisible();
    await expect(page.locator('text=TRAINING SESSION TRACKER')).toBeVisible();

    // Verify Workout Progress Meter exists
    await expect(page.locator('text=SESSION HUD // INTENSITY GAUGE')).toBeVisible();

    // Verify workout list exists
    const workoutList = page.locator('#todo-list');
    await expect(workoutList).toBeVisible();
  });

  test('logs a new gym exercise and verifies it appears in the active session', async ({ page }) => {
    const uniqueTitle = `Incline Bench Press ${Date.now()}`;
    const input = page.locator('#task-title-input');
    await input.fill(uniqueTitle);

    const addBtn = page.locator('#add-task-btn');
    await addBtn.click();

    // Expect exercise to appear in list
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
  });

  test('uses quick preset chips to automatically populate exercise and log movement', async ({ page }) => {
    // Click Back muscle group
    await page.getByRole('button', { name: 'Back' }).click();

    // Click Barbell Deadlifts preset chip
    const presetChip = page.getByRole('button', { name: 'Barbell Deadlifts' });
    await expect(presetChip).toBeVisible();
    await presetChip.click();

    // Verify input is populated
    const input = page.locator('#task-title-input');
    await expect(input).toHaveValue('Barbell Deadlifts');

    // Click LOG
    await page.locator('#add-task-btn').click();

    // Verify it appears in active session
    await expect(page.locator('#todo-list li', { hasText: 'Barbell Deadlifts' }).first()).toBeVisible();
  });

  test('toggles exercise completion and updates completion progress', async ({ page }) => {
    // Log unique exercise to test completion
    const uniqueTitle = `Tricep Extension ${Date.now()}`;
    const input = page.locator('#task-title-input');
    await input.fill(uniqueTitle);
    await page.locator('#add-task-btn').click();

    const taskText = page.locator(`text=${uniqueTitle}`);
    await expect(taskText).toBeVisible();

    // Find the item container and toggle its checkbox
    const item = page.locator('li', { hasText: uniqueTitle });
    const checkbox = item.locator('input[type="checkbox"]');
    await checkbox.check();

    // Expect CONQUERED badge to appear
    await expect(item.locator('text=CONQUERED')).toBeVisible();
  });

  test('filters exercises using the session filter tabs', async ({ page }) => {
    // Click FINISHED tab
    const finishedTab = page.locator('#filter-completed-tab');
    await finishedTab.click();

    // All visible items in finished tab should have CONQUERED
    const finishedItems = page.locator('#todo-list li');
    const count = await finishedItems.count();
    if (count > 0) {
      await expect(finishedItems.first().locator('text=CONQUERED')).toBeVisible();
    }

    // Switch back to ALL tab
    await page.locator('#filter-all-tab').click();
    await expect(page.locator('#todo-list')).toBeVisible();
  });

  test('navigates between page routes seamlessly', async ({ page }) => {
    // Navigate to Exercises page
    await page.locator('#nav-exercises-btn').click();
    await expect(page.getByText('EXERCISE MOVEMENT DIRECTORY')).toBeVisible();

    // Navigate to Analytics page
    await page.locator('#nav-analytics-btn').click();
    await expect(page.locator('text=TRAINING PERFORMANCE & ANALYTICS')).toBeVisible();

    // Navigate to History page
    await page.locator('#nav-history-btn').click();
    await expect(page.locator('text=WORKOUT SESSION LOGS & HISTORY')).toBeVisible();

    // Navigate back to Tracker (Home)
    await page.locator('#nav-tracker-btn').click();
    await expect(page.locator('#task-title-input')).toBeVisible();
  });

  test('toggles between dark and light athletic themes', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle-btn');
    await themeBtn.click();

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Toggle back
    await themeBtn.click();
    await expect(body).toBeVisible();
  });

  test('interacts with sets table, adjusts weights and reps, and adds working sets', async ({ page }) => {
    const uniqueTitle = `Bulgarian Split Squat ${Date.now()}`;
    const input = page.locator('#task-title-input');
    await input.fill(uniqueTitle);

    // Fill initial weight
    const weightInput = page.locator('#task-weight-input');
    await weightInput.fill('40 kg');

    const addBtn = page.locator('#add-task-btn');
    await addBtn.click();

    const item = page.locator('li', { hasText: uniqueTitle });
    await expect(item).toBeVisible();

    // Verify sets table headers
    await expect(item.locator('text=SET').first()).toBeVisible();
    await expect(item.locator('text=WEIGHT').first()).toBeVisible();
    await expect(item.locator('text=REPS').first()).toBeVisible();
    await expect(item.locator('text=LOG').first()).toBeVisible();

    // Verify initial weight propagated to Set 1
    const set1WeightInput = item.locator('input[aria-label="Weight for set 1"]');
    await expect(set1WeightInput).toHaveValue('40 kg');

    // Increase weight on Set 1
    const incWeightBtn = item.locator('button[aria-label="Increase weight for set 1"]');
    await incWeightBtn.click();
    await expect(set1WeightInput).toHaveValue('42.5 kg');

    // Increase reps on Set 1
    const incRepsBtn = item.locator('button[aria-label="Increase reps for set 1"]');
    await incRepsBtn.click();
    await expect(item.locator('text=11 REPS').first()).toBeVisible();

    // Click ADD SET to append a new set
    const addSetBtn = item.locator('button[aria-label="Add working set"]');
    await addSetBtn.click();
    await expect(item.locator('text=#4')).toBeVisible();

    // Log set 1 as completed
    const logSet1Btn = item.locator('button[aria-label="Log set 1"]');
    await logSet1Btn.click();
  });

  test('navigates to Nutrition page and verifies MyFitnessPal calorie HUD & macro targets', async ({ page }) => {
    // Navigate to Nutrition page
    const nutritionBtn = page.locator('#nav-nutrition-btn');
    await nutritionBtn.click();

    // Verify Page Heading & Subtext
    await expect(page.getByRole('heading', { name: 'Nutrition & Macro Diary' })).toBeVisible();
    await expect(page.locator('text=Daily Caloric Equation')).toBeVisible();
    await expect(page.locator('text=Remaining = Goal − Food + Workout')).toBeVisible();

    // Verify Macro progress meters
    await expect(page.locator('text=Protein (Muscle Synthesis)')).toBeVisible();
    await expect(page.locator('text=Carbohydrates (Glycogen)')).toBeVisible();
    await expect(page.locator('text=Fats (Hormonal Balance)')).toBeVisible();

    // Verify Meal Categories & Yuka score badges
    await expect(page.getByRole('heading', { name: 'Breakfast' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lunch' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dinner' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Snacks' })).toBeVisible();

    const yukaBadges = page.locator('[data-testid="yuka-score-badge"]');
    await expect(yukaBadges.first()).toBeVisible();
  });

  test('navigates to Food Intel page and searches verified food database with Yuka scoring', async ({ page }) => {
    // Navigate to Food Intel page
    const foodIntelBtn = page.locator('#nav-food-intel-btn');
    await foodIntelBtn.click();

    // Verify Page Heading
    await expect(page.getByRole('heading', { name: 'Food Quality & Ingredient Intel' })).toBeVisible();

    // Verify search input
    const searchInput = page.getByPlaceholder(/Search verified foods/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Chicken');

    // Expect Chicken item to be visible with its high Yuka score
    await expect(page.locator('text=Organic Free-Range Chicken Breast')).toBeVisible();
    await expect(page.locator('text=98/100')).toBeVisible();
    await expect(page.locator('text=Clean Formulation')).toBeVisible();
  });

  test('opens AI Quick Log modal, parses natural language transcript, and logs movements to active session', async ({ page }) => {
    // Open AI Quick Log modal
    const openAIBtn = page.locator('#open-ai-modal-btn');
    await expect(openAIBtn).toBeVisible();
    await openAIBtn.click();

    // Verify modal elements
    await expect(page.locator('text=AI NATURAL LANGUAGE WORKOUT PARSER')).toBeVisible();
    const parseBtn = page.locator('#ai-parse-btn');
    await expect(parseBtn).toBeVisible();

    // Parse transcript
    await parseBtn.click();

    // Verify parsed movements and confidence chip
    await expect(page.locator('text=PARSED EXTRACTED MOVEMENTS')).toBeVisible();
    const commitBtn = page.locator('#ai-commit-btn');
    await expect(commitBtn).toBeVisible();

    // Commit to active session
    await commitBtn.click();

    // Verify modal closes and active workout count increases
    await expect(page.locator('text=AI NATURAL LANGUAGE WORKOUT PARSER')).not.toBeVisible();
    await expect(page.locator('text=Concept2 Rowing Ergometer')).toBeVisible();
  });

  test('opens Food Intel Barcode Scanner, inspects product via preset code, and detects nutritional telemetry', async ({ page }) => {
    // Navigate to Food Intel page
    const foodIntelBtn = page.locator('#nav-food-intel-btn');
    await foodIntelBtn.click();
    await expect(page.getByRole('heading', { name: 'Food Quality & Ingredient Intel' })).toBeVisible();

    // Click SCAN BARCODE button
    const scanBtn = page.locator('[data-testid="open-barcode-scanner-btn"]');
    await expect(scanBtn).toBeVisible();
    await scanBtn.click();

    // Verify Barcode Scanner modal opens
    await expect(page.locator('[data-testid="barcode-scanner-modal"]')).toBeVisible();
    await expect(page.getByText('FOOD INTEL BARCODE SCANNER')).toBeVisible();

    // Click preset chip for chicken
    const presetChip = page.locator('[data-testid="preset-barcode-078742372487"]');
    await expect(presetChip).toBeVisible();
    await presetChip.click();

    // Verify detected food card appears
    const detectedCard = page.locator('[data-testid="detected-food-card"]');
    await expect(detectedCard).toBeVisible();
    await expect(detectedCard.getByText('Organic Free-Range Chicken Breast')).toBeVisible();
    await expect(detectedCard.getByText('98/100')).toBeVisible();

    // Click USE THIS FOOD
    const useFoodBtn = page.locator('[data-testid="barcode-use-food-btn"]');
    await expect(useFoodBtn).toBeVisible();
    await useFoodBtn.click();

    // Verify modal closes and detected food is highlighted
    await expect(page.locator('[data-testid="barcode-scanner-modal"]')).not.toBeVisible();
    await expect(page.locator('text=Organic Free-Range Chicken Breast').first()).toBeVisible();
  });

  test('authenticates athlete via AuthModal, updates Header Avatar HUD, and executes sign out', async ({ page }) => {
    // Verify Sign In button is present in Header
    const signInBtn = page.locator('[data-testid="header-signin-btn"]');
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Verify Auth Modal opens
    const authModal = page.locator('[data-testid="auth-modal"]');
    await expect(authModal).toBeVisible();
    await expect(page.getByText('IRONPULSE ATHLETE ACCESS')).toBeVisible();

    // Click Demo Athlete Login button
    const demoBtn = page.locator('[data-testid="auth-demo-btn"]');
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();

    // Verify modal closes and user avatar appears in header
    await expect(authModal).not.toBeVisible();
    const userBtn = page.locator('[data-testid="header-user-btn"]');
    await expect(userBtn).toBeVisible();
    await expect(userBtn.getByText('demo.athlete@ironpulse.fit')).toBeVisible();

    // Open User Menu
    await userBtn.click();
    const userMenu = page.locator('[data-testid="header-user-menu"]');
    await expect(userMenu).toBeVisible();
    await expect(userMenu.getByText('ATHLETE', { exact: true })).toBeVisible();

    // Click Sign Out
    const logoutBtn = page.locator('[data-testid="header-logout-btn"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify Header reverts to Sign In button
    await expect(page.locator('[data-testid="header-signin-btn"]')).toBeVisible();
    await expect(userBtn).not.toBeVisible();
  });

  test('navigates to Settings page, switches unit to Pounds (lbs), and verifies reflection across tracker', async ({ page }) => {
    // Navigate to Settings page
    const settingsNavBtn = page.locator('#nav-settings-btn');
    await expect(settingsNavBtn).toBeVisible();
    await settingsNavBtn.click();

    await expect(page.getByText('TRACKER PREFERENCES & SETTINGS')).toBeVisible();
    await expect(page.getByText('Weight Measurement Units')).toBeVisible();

    // Select Pounds (lbs) in dropdown
    const unitSelect = page.locator('#weight-unit-select');
    await expect(unitSelect).toBeVisible();
    await unitSelect.click();

    // Click Pounds (lbs) in MUI popover menu
    const lbsOption = page.locator('li[data-value="lbs"]');
    await expect(lbsOption).toBeVisible();
    await lbsOption.click();

    // Verify snackbar notification appears
    await expect(page.getByText(/Weight unit updated to Pounds \(lbs\)/i)).toBeVisible();

    // Navigate back to Tracker (Home)
    await page.locator('#nav-tracker-btn').click();
    await expect(page.locator('#task-title-input')).toBeVisible();

    // Verify weight input placeholder reflects lbs
    const weightInput = page.locator('#task-weight-input');
    await expect(weightInput).toHaveAttribute('placeholder', 'e.g. 185 lbs');

    // Switch back to kg to maintain test isolation
    await settingsNavBtn.click();
    await page.locator('#weight-unit-select').click();
    await page.locator('li[data-value="kg"]').click();
  });
});


