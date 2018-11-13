export const MIN = new Date(-8640000000000000)

export function format(dateStr) {
  const justDate = dateStr.split('T')[0]
  const [year, month, day] = justDate.split('-')
  return `${year}-${month}-${day}`
}

export function stripTz(dateStr) {
  return dateStr.split('T')[0]
}

export function splitYMDFromJSTimestamp(dateStr) {
  const justDate = dateStr.split('T')[0]
  return justDate.split('-')
}

export function toDate(dateStr) {
  const [year, month, day] = stripTz(dateStr).split('-')
  const date = new Date()
  date.setFullYear(year)
  date.setMonth(month - 1)
  date.setDate(day)
  return date
}
