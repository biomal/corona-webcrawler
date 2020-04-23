import { createPage } from "../lib/puppeteer"

// Link to the sp.gov covid-19 reports
const spReportsUrl = 'http://www.saude.sp.gov.br/cve-centro-de-vigilancia-epidemiologica-prof.-alexandre-vranjac/areas-de-vigilancia/doencas-de-transmissao-respiratoria/coronavirus-covid-19/situacao-epidemiologica'

// The number of the first report we are able to parse
const firstReportId = 49

interface CoronavirusSPReportInfo {
  label: string
  url: string
}

/**
 * Get the report id (nº) from the link label
 * Returns null if it isn't a report id
 * @example parseReportId("nº 56 - 22/04/20") => 56
 */
const getReportId = (label: string): number | null => {
  if (label.indexOf('nº') === -1)
    return null
  const parts = label.split(' - ')
  const number = parseInt(parts[0].replace('nº', ''))
  if (isNaN(number))
    return null
  return number
}

const getAllPdfsInfo = async () => {
  const page = await createPage(undefined, true)
  const browser = page.browser()
  await page.goto(spReportsUrl, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitFor('a[href*=".pdf"]:not([class])')
  const info: CoronavirusSPReportInfo[] = await page.evaluate(() => {
    const _info: CoronavirusSPReportInfo[] = []
    const elems = document.querySelectorAll('a[href*=".pdf"]:not([class])')
    elems.forEach((elem: HTMLAnchorElement) => {
      const label = elem.innerText
      const url = elem.href
      _info.push({ label, url })
    })
    return _info
  })
  await browser.close()
  return info
}

export const getReportUrls = async () => {
  const urls: string[] = []
  const info = await getAllPdfsInfo()
  info.forEach(item => {
    const reportId = getReportId(item.label)
    if (!reportId) return
    if (reportId >= firstReportId)
      urls.push(item.url)
  })
  return urls
}