// @flow
import type { routing$State } from '../router/types'
import type { budget$Actions } from '../../budget/types'

export type State = {
  routing: routing$State
}

export type Actions = budget$Actions
