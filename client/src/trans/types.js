// @flow
export type Trans = {
  // TODO: later
  amt: number,
  catId: number
}
export type trans$FindInYearAction = {
  type: 'trans/FIND_IN_YEAR',
  year: number
}
export type trans$FindInYearMonthAction = {
  type: 'trans/FIND_IN_YEAR_MONTH',
  year: number,
  month: number
}
export type trans$Actions = trans$FindInYearAction | trans$FindInYearMonthAction
