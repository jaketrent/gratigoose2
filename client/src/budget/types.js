// @flow
import type { Expected } from '../expected/types'
import type { Trans } from '../trans/types'

export type budget$State = {
  expecteds: Expected[],
  transs: Trans[]
}

export type budget$CreateExpectedAction = {
  type: 'budget/CREATE_EXPECTED',
  amt: number,
  catId: number,
  year: number,
  month: number
}
export type budget$CreateExpectedSuccessAction = {
  type: 'budget/CREATE_EXPECTED_SUCCESS',
  expecteds: Expected[]
}
export type budget$FindInYearMonthAction = {
  type: 'budget/FIND_IN_YEAR_MONTH',
  month: number,
  year: number
}
export type budget$FindInYearMonthSuccessAction = {
  type: 'budget/FIND_IN_YEAR_MONTH_SUCCESS',
  expecteds: Expected[],
  transs: Trans[]
}
export type budget$UpdateExpectedSuccessAction = {
  type: 'budget/UPDATE_EXPECTED_SUCCESS',
  expecteds: Expected[]
}
export type budget$Actions =
  | budget$CreateExpectedAction
  | budget$CreateExpectedSuccessAction
  | budget$FindInYearMonthAction
  | budget$FindInYearMonthSuccessAction
  | budget$UpdateExpectedSuccessAction
