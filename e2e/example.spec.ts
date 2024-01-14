import { test, expect } from '@playwright/test'

test('bare-minimum', async ({ page }) => {
  await page.goto('/')
  await page.getByText('PICK AN ELO LEVEL').isVisible()
})
