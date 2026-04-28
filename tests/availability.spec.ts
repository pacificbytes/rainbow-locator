import { test, expect } from './auth-utils';

const BASE_URL = 'http://localhost:3000';

test.describe('Public Pages Availability', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText('Lost and found, designed to feel trustworthy.')).toBeVisible();
  });

  test('signin page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);
    await expect(page.getByRole('heading', { name: 'Access your account' })).toBeVisible();
  });

  test('signup page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signup`);
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  });
});

test.describe('User Pages Availability', () => {
  test('browse items page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/items`);
    await expect(page.getByRole('heading', { name: 'Browse Items' })).toBeVisible();
    
    // Check if at least one item is displayed (assuming seeded data)
    await expect(page.locator('.item-card').first()).toBeVisible();
  });

  test('item details and claim form availability', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/items`);
    
    // Navigate to the first item that is NOT owned by John (if possible) 
    // or just any item to check details page availability
    await page.locator('.item-card .link-green').first().click();
    
    await expect(page.locator('.detail-card')).toBeVisible();
    await expect(page.locator('.detail-title')).toBeVisible();
    
    // If it's someone else's item, claim form should be there
    // If it's own item, notice should be there
    const hasClaimForm = await page.locator('textarea[name="message"]').isVisible();
    const hasOwnerNotice = await page.getByText('You reported this item').isVisible();
    
    expect(hasClaimForm || hasOwnerNotice).toBeTruthy();
  });

  test('report item page loads and form works', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/report`);
    await expect(page.getByRole('heading', { name: 'Report an Item' })).toBeVisible();

    // Fill the form
    await page.fill('input[name="title"]', 'Test Item');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.fill('input[name="category"]', 'Test Category');
    await page.selectOption('select[name="type"]', 'lost');
    await page.fill('input[name="location"]', 'Test Location');
    await page.fill('input[name="date"]', '2026-04-28');
    
    const submitBtn = page.getByRole('button', { name: 'Submit Report' });
    await expect(submitBtn).toBeEnabled();
  });

  test('my reports page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/my-stuff`);
    await expect(page.getByRole('heading', { name: 'My Reports' })).toBeVisible();
  });

  test('change password page loads and form is present', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/auth/change-password`);
    await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible();
    await expect(page.locator('input[name="oldpassword"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });

  test('profile page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/profile`);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});

test.describe('Admin Pages Availability', () => {
  test('admin dashboard loads', async ({ getUserPage }) => {
    const page = await getUserPage('admin@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  });

  test('admin items page loads', async ({ getUserPage }) => {
    const page = await getUserPage('admin@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/admin/items`);
    await expect(page.getByRole('heading', { name: 'Manage All Items' })).toBeVisible();
  });

  test('admin claims page loads', async ({ getUserPage }) => {
    const page = await getUserPage('admin@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/admin/claims`);
    await expect(page.getByRole('heading', { name: 'Review Claims' })).toBeVisible();
  });
});
