import nedb from 'nedb'

export const db = new nedb({
  filename: 'db/news.db',
  autoload: true
})