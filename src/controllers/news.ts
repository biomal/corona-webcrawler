import { db } from "../lib/db"
import { News } from "../models/news"
import { asyncForEach } from "../lib/utils"

export const load = (): Promise<News[]> => {
  return new Promise((resolve, reject) => {
    db.find<News>({}, (err, news) => {
      if (err) reject(err)
      else resolve(news)
    })
  })
}

export const loadOneByUrl = (url: string): Promise<News> => {
  return new Promise((resolve, reject) => {
    db.findOne<News>({ url }, (err, doc) => {
      if (err) reject(err)
      else resolve(doc)
    })
  })
}

export const saveOne = (news: News): Promise<News> => {
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

export const save = async (news: News[]) => {
  const _news: News[] = []
  await asyncForEach(news, async (record) => {
    const _record = await saveOne(record)
    _news.push(_record)
  })
  return _news
}
