// @flow
import type { acct$Actions } from '../../acct/types'
import type { auth$State } from '../../auth/types'
import type { budget$Actions } from '../../budget/types'
import type { cat$Actions } from '../../cat/types'
import type { routing$State } from '../router/types'
import type { trans$Actions } from '../../trans/types'

export type State = {
  auth: auth$State,
  routing: routing$State
}

export type Actions =
  | acct$Actions
  | budget$Actions
  | cat$Actions
  | trans$Actions
