import util from "util"

import * as googleCrawler from "./crawlers/google"
import * as g1Crawler from "./crawlers/g1"
import * as newsController from "./controllers/news"
import { writeFile } from "./lib/file"

const run = async () => {
  // Webcrawling google results
  console.log('Google crawling...')
  const googleResults = await googleCrawler.search('corona virus, são carlos, araraquara site:g1.globo.com')
  console.log('Done:', googleResults.length, 'results')

  // Foreach google search result, crawl info from g1
  console.log('EPTV crawling...')
  const eptvResults = await g1Crawler.getInfoFromGoogleResults(googleResults)
  console.log('Done:', eptvResults.length, 'news')

  // Persisting news into db
  console.log('Persisting news...')
  await newsController.save(eptvResults)

  // Saving news into a JSON file
  console.log('Parsing news JSON...')
  const news = await newsController.load()
  const json = JSON.stringify(news)
  await writeFile('docs/news.json', json)

  console.log('Done.')
}

run()