const { test } = require('../lambdatest-setup')
const { expect } = require('@playwright/test')

test.describe('Browse LambdaTest in different search engines', () => {
  test('Search LambdaTest Blog on Bing', async ({ page }) => {
    await page.goto('https://www.bing.com')
   // await page.evaluate((_) => {}, `lambdatest_action: ${JSON.stringify({
    //  action: 'smartui.takeScreenshot',
    //  arguments: { fullPage: true, screenshotName: 'search-lambdatest' }
   // })}`)
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)
   let mask_locator_2 = await page.locator('.cdxMain');
 

   await page.screenshot({path: 'masked.png',mask:[mask_locator_2]});
  
   await page.evaluate((_) => {}, `lambdatest_action: ${JSON.stringify({
    action: 'smartui.takeScreenshot',
    arguments: { fullPage: true, screenshotName: 'Mask-lambdatest', mask:[mask_locator_2] }
  })}`)
    const element = await page.$('[id="sb_form_q"]')
    await element.click()
    await element.type('LambdaTest')
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForSelector('[class=" b_active"]')
    const title = await page.title()

    console.log('Page title:: ', title)
    // Use the expect API for assertions provided by playwright
    expect(title).toEqual(expect.stringContaining('LambdaTest'))
  })
})
