// @flow
import type { Store } from 'redux'

import type { Actions, State } from '../../common/store/types'

import * as actions from '../actions'

export default function findInYearMonth(
  store: Store<State, Actions>,
  next: void => void
) {
  const { month, year } = store.getState().routing.params
  store.dispatch(actions.findInYearMonth({ month, year }))
  next()
}
