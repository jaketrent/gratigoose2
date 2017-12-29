// @flow
import type { Store } from 'redux'

import type { Actions, State } from '../../common/store/types'

import * as actions from '../actions'

export default function findAll(
  store: Store<State, Actions>,
  next: void => void
) {
  // TODO: add cache check
  store.dispatch(actions.findAll())
  next()
}
