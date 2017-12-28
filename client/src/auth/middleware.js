import * as actions from './actions'
import * as router from '../common/router'

export function isLoggedIn(store, next) {
  const session = store.getState().auth.session
  if (session) {
    next()
  } else {
    router.redirect('/login')
  }
}

export function logout(store) {
  store.dispatch(actions.logout())
  router.redirect('/login')
}
