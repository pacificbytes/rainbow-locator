import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  // Navigate to the home page and wait for post-login indicator
  await adminPage.goto('http://localhost:3000/');
  await expect(
    adminPage.getByRole('button', { name: 'admin@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Check for navigation elements
  await expect(
    adminPage.getByRole('link', { name: 'Report Item' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Browse Items' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Admin Dashboard' })
  ).toBeVisible({ timeout: 5000 });

  // Test Report Item adminPage
  await adminPage.getByRole('link', { name: 'Report Item' }).click();
  await expect(
    adminPage.getByRole('heading', { name: 'Report an Item' })
  ).toBeVisible({ timeout: 5000 });

  // Test Browse Items adminPage
  await adminPage.getByRole('link', { name: 'Browse Items' }).click();
  await expect(
    adminPage.getByRole('heading', { name: 'Browse Items' })
  ).toBeVisible({ timeout: 5000 });

  // Test Admin adminPage
  await adminPage.getByRole('link', { name: 'Admin Dashboard' }).click();
  await expect(
    adminPage.getByRole('heading', { name: 'Admin Dashboard' })
  ).toBeVisible({ timeout: 5000 });

});