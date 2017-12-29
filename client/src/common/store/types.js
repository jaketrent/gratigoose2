// @flow
import type { acct$Actions } from '../../acct/types'
import type { auth$State } from '../../auth/types'
import type { budget$Actions, budget$State } from '../../budget/types'
import type { cat$Actions, cat$State } from '../../cat/types'
import type { routing$State } from '../router/types'
import type { trans$Actions } from '../../trans/types'

export type State = {
  auth: auth$State,
  budget: budget$State,
  cat: cat$State,
  routing: routing$State
}

export type Actions =
  | acct$Actions
  | budget$Actions
  | cat$Actions
  | trans$Actions
