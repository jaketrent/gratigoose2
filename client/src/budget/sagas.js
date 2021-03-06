import { call, put } from 'redux-saga/effects'

import * as actions from './actions'
import * as api from './api'
import request from '../common/api/request'
import * as transSagas from '../trans/sagas'

export function* findInYearMonth({ month, year }) {
  const { accts, cats } = yield* transSagas.loadTransRelations()
  const { expecteds, transs } = yield call(request, {
    accts,
    api: api.findInYearMonth,
    cats,
    month,
    year
  })

  yield put(
    actions.findInYearMonthSuccess({ cats, expecteds, month, transs, year })
  )
  // TODO: impl and error check
}

export function* findInYearMonthCat({ month, year, catId }) {
  const { accts, cats } = yield* transSagas.loadTransRelations()
  const { transs, expecteds } = yield call(request, {
    accts,
    api: api.findInYearMonthCat,
    catId,
    cats,
    month,
    year
  })

  yield put(
    actions.findInYearMonthCatSuccess({ catId, month, transs, year, expecteds })
  )
  // TODO: impl and error check
}

export function* createExpected(args) {
  try {
    const { cats } = yield* transSagas.loadTransRelations()
    const expecteds = yield call(request, {
      ...args,
      api: api.createExpected,
      cats
    })
    yield put(actions.createExpectedSuccess(expecteds))
  } catch (errors) {
    yield put(actions.createExpectedError(errors))
  }
}

export function* reuseLastBudget({ month, year }) {
  try {
    const expecteds = yield call(request, {
      api: api.reuseLastBudget,
      month,
      year
    })
    yield put(actions.createExpectedSuccess(expecteds))
  } catch (errors) {
    yield put(actions.updateExpectedError(errors))
  }
}

export function* updateExpected(args) {
  try {
    const { cats } = yield* transSagas.loadTransRelations()
    const expecteds = yield call(request, {
      ...args,
      api: api.updateExpected,
      cats
    })
    yield put(actions.updateExpectedSuccess(expecteds))
  } catch (errors) {
    yield put(actions.updateExpectedError(errors))
  }
}
