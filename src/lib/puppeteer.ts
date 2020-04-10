import puppeteer, { LaunchOptions, Browser } from "puppeteer"

export const createBrowser = async (options: LaunchOptions = {}) => {
  return await puppeteer.launch({
    ...options
  })
}

export const createPage = async (browser?: Browser, showConsoleMessages?: boolean) => {
  if (!browser)
    browser = await createBrowser()
  const page = await browser.newPage()
  await page.setViewport({ width: 800, height: 600 })
  if (showConsoleMessages)
    page.on('console', message => console.log(message.text()))
  return page
}