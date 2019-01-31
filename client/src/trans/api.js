import axios from 'axios'

import * as currencyUtils from '../common/currency'
import * as dateUtils from '../common/date'
import deserializeError from '../common/api/deserialize-error'
import * as utils from './utils.js'

function serializeCreate({ transs }) {
  return transs.map(trans => {
    const [year, month, day] = dateUtils.splitYMDFromJSTimestamp(trans.date)
    return {
      acctId: trans.acct.id,
      amt: currencyUtils.stripDollarSign(trans.amt),
      catId: trans.cat.id,
      desc: trans.desc,
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10)
    }
  })
}

function serializeUpdate({ trans }) {
  // TODO: update to use array in update as well
  const serialized = serializeCreate({ transs: [trans] })[0]
  return {
    ...serialized,
    id: trans.id
  }
}

function deserializeSuccess(res, args) {
  return utils.combineRelations(res.data.data, args)
}

export const create = {
  formatUrl() {
    return '/api/v1/trans'
  },
  serialize: serializeCreate,
  request(args) {
    const { api } = args
    return axios.post(api.formatUrl(), api.serialize(args))
  },
  deserializeSuccess,
  deserializeError
}

export const findAll = {
  formatUrl() {
    return '/api/v1/trans'
  },
  request(args) {
    const { api } = args
    return axios.get(api.formatUrl())
  },
  deserializeSuccess,
  deserializeError
}

export const findInYear = {
  formatUrl({ year }) {
    return `/api/v1/trans/year/${year}`
  },
  request(args) {
    const { api } = args
    return axios.get(api.formatUrl(args))
  },
  deserializeSuccess,
  deserializeError
}

export const findInYearMonth = {
  formatUrl({ month, year }) {
    return `/api/v1/trans/year/${year}/month/${month}`
  },
  request(args) {
    const { api } = args
    return axios.get(api.formatUrl(args))
  },
  deserializeSuccess,
  deserializeError
}

export const update = {
  formatUrl({ trans }) {
    return `/api/v1/trans/${trans.id}`
  },
  serialize: serializeUpdate,
  request(args) {
    const { api } = args
    return axios.put(api.formatUrl(args), api.serialize(args))
  },
  deserializeSuccess,
  deserializeError
}

export const destroy = {
  formatUrl({ trans }) {
    return `/api/v1/trans/${trans.id}`
  },
  request(args) {
    const { api } = args
    return axios.delete(api.formatUrl(args))
  },
  deserializeSuccess() {}, // unused
  deserializeError
}
