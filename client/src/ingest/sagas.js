import { put } from 'redux-saga/effects'

import * as actions from './actions'
import { formatTrans } from './utils'
import * as transActions from '../trans/actions.js'

export function* upload({ acct, cat, columns, rows }) {
  try {
    if (!cat) throw new Error('Uploading without ingest cat')

    const transs = rows.map(row => formatTrans({ acct, cat, columns, row }))
    yield put(transActions.create(transs))

    yield put(actions.uploadSuccess(rows.length))
  } catch (errs) {
    yield put(actions.uploadError(errs))
  }
}
