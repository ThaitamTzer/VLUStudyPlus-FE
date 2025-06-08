export type StatisticsProcessByTermType = {
  termAbbreviatName: string
  majorName: string
  count: number
}

export type StatisticsProcessByTerm = {
  statistics: StatisticsProcessByTermType[]
}

export type StatisticsProcessOfCVHTType = {
  cvht: string
  classCode: string
  termAbbreviatName: string
  majorName: string
  countslxl: number
  countsslcxl: number
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

export type StatisticsProcessByClassType = {
  classCode: string
  termAbbreviatName: string
  majorName: string
  count: number
}

export type StatisticsProcessByClass = {
  statistics: StatisticsProcessByClassType[]
}

export type StatisticsProcessByStudentKQHTType = {
  classCode: string
  cvht: string
  majorName: string
  termAbbreviatName: string
  countdnd: number
  countcnd: number
  count: number
}

export type StatisticsProcessByStudentKQHT = {
  statistics: StatisticsProcessByStudentKQHTType[]
}
