// @flow
import type { Actions } from '../common/store/types'

import type {
  cat$SearchSuccessAction,
  cat$FindAllSuccessAction,
  cat$State
} from './types'

import { TYPES } from './actions'

const initialState: cat$State = {
  cats: [],
  searchedCats: [],
  catsById: {}
}

function searchSuccess(
  state: cat$State,
  action: cat$SearchSuccessAction
): cat$State {
  return {
    ...state,
    searchedCats: action.cats
  }
}

function findAllSuccess(
  state: cat$State,
  action: cat$FindAllSuccessAction
): cat$State {
  return {
    ...state,
    cats: action.cats,
    catsById: action.cats.reduce((acc, cat) => {
      acc[cat.id] = cat
      return acc
    }, state.catsById)
  }
}

export default function reduce(
  state: cat$State = initialState,
  action: ?Actions
): cat$State {
  const handlers: Object = {
    [TYPES.FIND_ALL_SUCCESS]: findAllSuccess,
    [TYPES.SEARCH_SUCCESS]: searchSuccess
  }
  return action && handlers[action.type]
    ? handlers[action.type](state, action)
    : state
}
