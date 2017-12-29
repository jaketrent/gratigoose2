// @flow
import type { Store } from 'redux'

import type { Actions, State } from '../../common/store/types'

import * as actions from '../actions'

export default function findInYear(
  store: Store<State, Actions>,
  next: void => void
) {
  const year = store.getState().routing.params.year
  store.dispatch(actions.findInYear({ year }))
  next()
}
