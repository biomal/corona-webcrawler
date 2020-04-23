import axios from "axios"
import fs from "fs"
import { asyncForEach } from "../lib/utils"

export const downloadReport = async (url: string) => {
  const filename = url.split('/').pop()
  const res = await axios.get(url, { responseType: 'stream' })
  res.data.pipe(fs.createWriteStream(`files/${filename}`))
  return filename
}

export const downloadReports = async (urls: string[]) => {
  const filenames: string[] = []
  await asyncForEach(urls, async (url) => {
    const filename = await downloadReport(url)
    filenames.push(filename)
  })
  return filenames
}