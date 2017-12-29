// @flow
import type { Expected } from '../expected/types'
import type { Trans } from '../trans/types'

export type budget$State = {
  expecteds: Expected[],
  transs: Trans[]
}

export type budget$CreateExpected = {
  type: 'budget/CREATE_EXPECTED',
  amt: number,
  catId: number,
  year: number,
  month: number
}
export type budget$FindInYearMonthAction = {
  type: 'budget/FIND_IN_YEAR_MONTH',
  month: number,
  year: number
}
export type budget$Actions =
  | budget$CreateExpected
  | budget$FindInYearMonthAction
