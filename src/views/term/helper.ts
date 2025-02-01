const getStartYear = () => {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 4
  const endYear = currentYear + 10

  const years: string[] = []

  for (let i = startYear; i <= endYear; i++) {
    years.push(i.toString())
  }

  return years
}

const getEndYear = (startYear: string) => {
  const endYear = Number(startYear) + 10
  const years: string[] = []

  for (let i = Number(startYear); i <= endYear; i++) {
    years.push(i.toString())
  }

  return years
}


export { getStartYear, getEndYear }
