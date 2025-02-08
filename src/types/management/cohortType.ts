export type Cohort = {
  _id: string
  cohortId: string
  cohortName: string
  startYear: string
  endYear: string
}

export type CohortForm = {
  cohortId: string | undefined
  cohortName: string | undefined
  startYear: string | undefined
  endYear: string | undefined
}
