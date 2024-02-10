import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('It has the expected title', async ({ page }) => {
  await expect(page).toHaveTitle(/× 0 • Super Burokku Bros./)

  const title = page.locator('h1')
  await expect(title).toHaveText('⍰')
})
