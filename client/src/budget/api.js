import axios from 'axios'

import deserializeError from '../common/api/deserialize-error'

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
    return res.data.data
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

export const updateExpected = {
  formatUrl({ expected }) {
    return `/api/v1/expected/${expected.id}`
  },
  serialize({ amt, expected }) {
    return {
      amt,
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
