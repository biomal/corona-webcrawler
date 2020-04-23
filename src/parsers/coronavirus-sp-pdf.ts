import { readPDF } from "../lib/pdf"
import { CoronavirusSP } from "../models/coronavirus-sp"

const firstCityName = 'ADAMANTINA'
const lastCityName = 'PILAR DO SUL'
const toIgnore = [
  'IGNORADO',
  'OUTRO ESTADO',
  'OUTRO PAÍS'
]

const parseRawStats = (content: any) => {
  const _stats: string[] = []
  const page: any = content.formImage.Pages[0]
  let i = 0
  let parsingCities = false
  for (let text of page.Texts) {
    const info = decodeURIComponent(text.R[0].T)
    if (info === firstCityName)
      parsingCities = true
    if (parsingCities) {
      if (info === '-')
        _stats.push('0')
      else _stats.push(info)
    }
    if (info === lastCityName)
      break
  }
  return _stats
}

const parseStats = (rawStats: string[]) => {
  const _stats: CoronavirusSP[] = []
  for (let i = 0; i < rawStats.length; i += 3) {
    const [city, cases, deaths] = [
      rawStats[i],
      parseInt(rawStats[i + 1]),
      parseInt(rawStats[i + 2])
    ]
    if (!toIgnore.includes(city))
      _stats.push({ city, cases, deaths })
  }
  return _stats
}

const sortStats = (stats: CoronavirusSP[]) => {
  return stats.sort((a, b) => {
    if (a.city > b.city) return 1
    if (a.city < b.city) return -1
    return 0
  })
}

export const getStats = async (path: string) => {
  const content = await readPDF(path)
  const rawStats = parseRawStats(content)
  const stats = parseStats(rawStats)
  return sortStats(stats)
}