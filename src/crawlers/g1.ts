import { Page } from "puppeteer"

import { createPage, createBrowser } from "../lib/puppeteer"
import { SearchResult } from "../models/search-result"
import { News } from "../models/news"

interface G1Result {
  title: string
  resume: string
  imgUrl: string
  date: number
}

const getInfo = async (page: Page, url: string) => {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitFor('img[class*="content-media"]')
  const _result: G1Result = await page.evaluate(() => {
    const h1: HTMLHeadingElement = document.querySelector('h1[class*="content-head"]')
    const h2: HTMLHeadingElement = document.querySelector('h2[class*="content-head"]')
    const div: HTMLDivElement = document.querySelector('div[class*="progressive-img"]')
    return {
      title: h1.innerText,
      resume: h2.innerText,
      imgUrl: div.attributes.getNamedItem('data-max-size-url').textContent,
      date: new Date().valueOf()
    }
  })
  return _result
}

export const getInfoFromUrl = async (url: string) => {
  const page = await createPage()
  const browser = page.browser()
  const _result = getInfo(page, url)
  await browser.close()
  return _result
}

export const getInfoFromGoogleResults = async (results: SearchResult[]) => {
  const browser = await createBrowser()
  const _results: News[] = await Promise.all(results.map(async (result) => {
    const page = await createPage(browser)
    const g1Result = await getInfo(page, result.url)
    await page.close()
    return { ...result, ...g1Result }
  }))
  await browser.close()
  return _results
}