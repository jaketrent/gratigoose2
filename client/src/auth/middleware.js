// @flow
import type { Store } from 'redux'

import type { Actions, State } from '../common/store/types'

import * as actions from './actions'
import * as router from '../common/router'

export function isLoggedIn(store: Store<State, Actions>, next: void => void) {
  const session = store.getState().auth.session
  if (session) {
    next()
  } else {
    router.redirect('/login')
  }
}

export function logout(store: Store<State, Actions>) {
  store.dispatch(actions.logout())
  router.redirect('/login')
}
