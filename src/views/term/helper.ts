const getStartYear = () => {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 5
  const endYear = currentYear + 20

  const years: string[] = []

  for (let i = startYear; i <= endYear; i++) {
    years.push(i.toString())
  }

  return years
}

const getEndYear = (startYear: string | undefined) => {
  const endYear = Number(startYear) + 20
  const years: string[] = []

  for (let i = Number(startYear); i <= endYear; i++) {
    years.push(i.toString())
  }

  return years
}

const getAcademicYear = () => {
  // get from +- 10 years
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 10
  const endYear = currentYear + 10
  const academicYears = []

  for (let i = startYear; i <= endYear; i++) {
    academicYears.push(`${i}-${i + 1}`)
  }

  return academicYears
}

export { getStartYear, getEndYear, getAcademicYear }
