// @flow
import type { Actions } from '../common/store/types'

import type {
  Cat,
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
const byName = (a: Cat, b: Cat) =>
  a.name > b.name ? 1 : b.name > a.name ? -1 : 0
function searchSuccess(
  state: cat$State,
  action: cat$SearchSuccessAction
): cat$State {
  return {
    ...state,
    searchedCats: action.cats.sort(byName)
  }
}

function findAllSuccess(
  state: cat$State,
  action: cat$FindAllSuccessAction
): cat$State {
  return {
    ...state,
    cats: action.cats.sort(byName),
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
