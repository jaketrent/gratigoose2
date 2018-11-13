// @flow
import type { Store } from 'redux'

import type { Actions, State } from '../../common/store/types'

import * as actions from '../actions'

export default function findInYearMonthCat(
  store: Store<State, Actions>,
  next: void => void
) {
  const { month, year, catId } = store.getState().routing.params
  store.dispatch(actions.findInYearMonthCat({ month, year, catId }))
  next()
}
