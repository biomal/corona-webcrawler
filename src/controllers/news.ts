import { db } from "../lib/db"
import { News } from "../models/news"
import { asyncForEach } from "../lib/utils"
import { writeFile } from "../lib/file"

import * as googleCrawler from "../crawlers/google"
import * as g1Crawler from "../crawlers/g1"

const load = (): Promise<News[]> => {
  return new Promise((resolve, reject) => {
    db.find<News>({}, (err, news) => {
      if (err) reject(err)
      else resolve(news)
    })
  })
}

const loadOneByUrl = (url: string): Promise<News> => {
  return new Promise((resolve, reject) => {
    db.findOne<News>({ url }, (err, doc) => {
      if (err) reject(err)
      else resolve(doc)
    })
  })
}

const saveOne = (news: News): Promise<News> => {
  return new Promise(async (resolve, reject) => {
    const exists = await loadOneByUrl(news.url)
    if (!exists) {
      db.insert(news, (err, doc) => {
        if (err) reject(err)
        else resolve(doc)
      })
    } else {
      delete news.date
      db.update({ url: news.url }, news, {}, (err) => {
        if (err) reject(err)
        else resolve(news)
      })
    }
  })
}

const save = async (news: News[]) => {
  const _news: News[] = []
  await asyncForEach(news, async (record) => {
    const _record = await saveOne(record)
    _news.push(_record)
  })
  return _news
}

export const run = async () => {
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
  await save(eptvResults)

  // Saving news into a JSON file
  console.log('Parsing news JSON...')
  const news = await load()
  const json = JSON.stringify(news)
  await writeFile('docs/news.json', json)

  console.log('Done.')
}