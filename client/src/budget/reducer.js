// @flow
import { TYPES } from './actions'

import type {
  budget$State,
  budget$CreateExpectedSuccessAction,
  budget$FindInYearMonthSuccessAction,
  budget$UpdateExpectedSuccessAction
} from './types'

import { createWithHandlers } from '../common/reducer'

const initialState: budget$State = {
  expecteds: [],
  transs: []
}

function createExpectedSuccess(
  state: budget$State,
  action: budget$CreateExpectedSuccessAction
): budget$State {
  return {
    ...state,
    expecteds: state.expecteds.concat(action.expecteds)
  }
}

function updateExpectedSuccess(
  state: budget$State,
  action: budget$UpdateExpectedSuccessAction
): budget$State {
  const newEx = action.expecteds[0]
  const expecteds = [...state.expecteds]
  const i = expecteds.findIndex(ex => ex.id === newEx.id)
  expecteds[i] = newEx
  return {
    ...state,
    expecteds
  }
}

function findYearMonthSuccess(
  state: budget$State,
  action: budget$FindInYearMonthSuccessAction
): budget$State {
  return {
    ...state,
    expecteds: action.expecteds,
    transs: action.transs
  }
}

export default createWithHandlers(
  {
    [TYPES.CREATE_EXPECTED_SUCCESS]: createExpectedSuccess,
    [TYPES.FIND_IN_YEAR_MONTH_SUCCESS]: findYearMonthSuccess,
    [TYPES.UPDATE_EXPECTED_SUCCESS]: updateExpectedSuccess
  },
  initialState
)
