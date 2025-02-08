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

export { getStartYear, getEndYear }
