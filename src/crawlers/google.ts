import { createPage } from "../lib/puppeteer"
import { SearchResult } from "../models/search-result"

export const search = async (searchText: string) => {
  const page = await createPage()
  const browser = page.browser()
  await page.goto('https://google.com.br/', { waitUntil: 'networkidle2' })
  await page.type('input[title="Pesquisar"]', searchText)
  await page.keyboard.press('Enter')
  await page.waitFor('div.g')
  const _results = await page.evaluate(() => {
    const elements = document.querySelectorAll('div.g')
    const _searchResults: SearchResult[] = []
    elements.forEach(element => {
      const h3: HTMLHeadingElement = element.querySelector('h3')
      const span: HTMLSpanElement = element.querySelector('span.st')
      const a: HTMLAnchorElement = element.querySelector('a[href]')
      const title = h3.innerText
      const resume = span.innerText
      const link = a.attributes.getNamedItem('href').textContent
      _searchResults.push({ title, resume, url: link })
    })
    return _searchResults
  })
  await browser.close()
  return _results
}