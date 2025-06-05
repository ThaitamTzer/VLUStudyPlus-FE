export type StatisticsProcessByTermType = {
  termAbbreviatName: string
  majorName: string
  count: number
}

export type StatisticsProcessByTerm = {
  statistics: StatisticsProcessByTermType[]
}

export type StatisticsProcessOfCVHTType = {
  termAbbreviatName: string
  majorName: string
  count: number
}
export type StatisticsProcessOfCVHT = {
  statistics: StatisticsProcessOfCVHTType[]
}

export type StatisticsProcessByStatusType = {
  status: string
  termAbbreviatName: string
  majorName: string
  count: number
}

export type StatisticsProcessByStatus = {
  statistics: StatisticsProcessByStatusType[]
}
