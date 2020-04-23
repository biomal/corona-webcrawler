import axios from "axios"
import fs from "fs"

import { asyncForEach } from "../lib/utils"
import { createDirectoryIfNotExists, writeFile } from "../lib/file"

import * as covidSpCrawler from "../crawlers/coronavirus-sp"
import * as covidSpParser from "../parsers/coronavirus-sp-pdf"

const downloadReport = (url: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const filename = url.split('/').pop()
    const res = await axios.get(url, { responseType: 'stream' })
    const writer = fs.createWriteStream(`files/coronavirus-sp-reports/${filename}`)
    res.data.pipe(writer)
    writer.on('error', reject)
    writer.on('finish', () => {
      writer.close()
      resolve(filename)
    })
  })
}

const downloadReports = async (urls: string[]) => {
  const filenames: string[] = []
  await asyncForEach(urls, async (url) => {
    const filename = await downloadReport(url)
    filenames.push(filename)
  })
  return filenames
}

export const run = async () => {
  // Creating recipient directories
  await createDirectoryIfNotExists('files/coronavirus-sp-reports')
  await createDirectoryIfNotExists('files/coronavirus-sp-stats')

  // Webcrawling sp.gov covid19 reports
  console.log('Crawling sp.gov data...')
  const urls = await covidSpCrawler.getReportUrls()
  console.log('Done:', urls.length, 'downloadable reports')

  // Downloading reports
  console.log('Downloading reports...')
  const filenames = await downloadReports(urls)
  console.log('Done:', filenames.length, 'reports downloaded')

  // Generating JSON data
  console.log('Parsing stats...')
  await asyncForEach(filenames, async (filename) => {
    const stats = await covidSpParser.getStats(`files/coronavirus-sp-reports/${filenames[0]}`)
    const json = JSON.stringify(stats)
    const jsonFilename = filename.replace('.pdf', '.json')
    await writeFile(`files/coronavirus-sp-stats/${jsonFilename}`, json)
  })
  console.log('Done.')
}