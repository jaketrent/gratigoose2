import * as actions from './actions'
import * as router from '../common/router'

export function isLoggedIn(store, next) {
  console.log('is logged in sess', store.getState().auth.session)
  if (store.getState().auth.session) {
    next()
  } else {
    router.redirect('/login')
  }
}

export function logout(store) {
  store.dispatch(actions.logout())
  router.redirect('/login')
}
