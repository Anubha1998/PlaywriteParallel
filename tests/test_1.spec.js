const { test, expect } = require('@playwright/test');

test.describe('Browse LambdaTest in different search engines', () => {
  test('Search LambdaTest on DuckDuckGo', async ({ page , browser }) => {
  
    console.log('Navigating URL')
    await page.goto('https://www.lambdatest.com/')
  
    // Add the following command in order to take screenshot in Smart-UI
    // Add a relevant screenshot name
    // Set `fullPage: true` to take full page screenshots
    await page.evaluate((_) => {}, `lambdatest_action: ${JSON.stringify({
      action: 'smartui.takeScreenshot',
      arguments: { fullPage: true, screenshotName: 'lambdatest-website' }
    })}`)
  
    await page.goto("https://duckduckgo.com");
  
    await page.evaluate((_) => {}, `lambdatest_action: ${JSON.stringify({
      action: 'smartui.takeScreenshot',
      arguments: { fullPage: true, screenshotName: 'search-lambdatest' }
    })}`)
  
    let element = await page.locator("[name=\"q\"]");
    await element.click();
    await element.type("LambdaTest");
    await element.press("Enter");
    const title = await page.title()
  
    try {
      // Pass the `page` object. Add `screennshotName` if you want to fetch response for a specific screenshot
      await validateSmartUIScreenshots(page)
  
      expect(title).toEqual('LambdaTest at DuckDuckGo')
      // Mark the test as completed or failed
      await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({
        action: 'setTestStatus',
        arguments: { status: 'passed', remark: 'Title matched' }
      })}`)
      await teardown(page, browser)
    } catch (err) {
      await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({
        action: 'setTestStatus',
        arguments: { status: 'failed', remark: err.stack }
      })}`)
      await teardown(page, browser)
      throw err.stack
    }
  
  })
  async function teardown(page, browser) {
    await page.close();
    await browser.close();
  }
  
  const validateSmartUIScreenshots = async (page, screenshotName) => {
    try {
      await page.waitForTimeout(5000) // Added delay to get reports of all screenshots captured
  
      let screenshotResponse = JSON.parse(await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'smartui.fetchScreenshotStatus', arguments: { screenshotName }})}`))
      console.log('screenshotStatus response: ', screenshotResponse)
  
      if (screenshotResponse.screenshotsData && Array.isArray(screenshotResponse.screenshotsData)) {
        for (let i = 0; i < screenshotResponse.screenshotsData.length; i++) {
          let screenshot = screenshotResponse.screenshotsData[i];
          if (screenshot.screenshotStatus !== "Approved") {
            throw new Error(`Screenshot status is not approved for the screenshot ${screenshot.screenshotName}`);
          }
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };
})