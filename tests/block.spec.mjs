import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('It works', async ({ page }) => {
  const block = page.getByRole('button', { name: 'Jump!' })
  await block.click()

  await expect(page).toHaveTitle(/× 1 • Super Burokku Bros./)
})
