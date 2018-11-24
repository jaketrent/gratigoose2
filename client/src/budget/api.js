import axios from 'axios'

import deserializeError from '../common/api/deserialize-error'
import * as transUtils from '../trans/utils'

export const findInYearMonth = {
  formatUrl({ month, year }) {
    // TODO: mv to budget ctrl/repo
    return `/api/v1/budget/year/${year}/month/${month}`
  },
  request(args) {
    const { api } = args
    return axios.get(api.formatUrl(args))
  },
  deserializeSuccess(res, args) {
    const { transs, expecteds } = res.data.data
    return {
      transs: transUtils.combineRelations(transs, args),
      expecteds
    }
  },
  deserializeError
}

export const findInYearMonthCat = {
  formatUrl({ catId, month, year }) {
    return `/api/v1/budget/year/${year}/month/${month}/cat/${catId}`
  },
  request(args) {
    const { api } = args
    return axios.get(api.formatUrl(args))
  },
  deserializeSuccess(res, args) {
    const { transs, expecteds } = res.data.data
    return {
      transs: transUtils.combineRelations(transs, args),
      expecteds
    }
  },
  deserializeError
}

export const createExpected = {
  formatUrl() {
    return `/api/v1/expected`
  },
  serialize(args) {
    return {
      amt: args.amt,
      notes: args.notes,
      catId: args.catId,
      year: parseInt(args.year, 10),
      month: parseInt(args.month, 10)
    }
  },
  request(args) {
    const { api } = args
    return axios.post(api.formatUrl(), api.serialize(args))
  },
  deserializeSuccess(res, args) {
    return res.data.data
  },
  deserializeError
}

export const reuseLastBudget = {
  formatUrl({ month, year }) {
    return `/api/v1/budget/year/${year}/month/${month}/reuse`
  },
  request(args) {
    const { api } = args
    return axios.post(api.formatUrl(args))
  },
  deserializeSuccess(res, args) {
    return res.data.data.expecteds
  },
  deserializeError
}

export const updateExpected = {
  formatUrl({ expected }) {
    return `/api/v1/expected/${expected.id}`
  },
  serialize({ amt, notes, expected }) {
    return {
      amt,
      notes,
      id: expected.id
    }
  },
  request(args) {
    const { api } = args
    return axios.put(api.formatUrl(args), api.serialize(args))
  },
  deserializeSuccess(res, args) {
    return res.data.data
  },
  deserializeError
}
