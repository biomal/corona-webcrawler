import { SearchResult } from "./search-result"

export interface News extends SearchResult {
  imgUrl: string
  date: number
}