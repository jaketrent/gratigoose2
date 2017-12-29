import * as router from '../router'

export default function request(args) {
  const { api } = args
  return new Promise((resolve, reject) => {
    api
      .request(args)
      .then(res => {
        resolve(api.deserializeSuccess(res, args))
      })
      .catch(errOrRes => {
        const res = errOrRes.response || errOrRes

        const isTokenExpired = (res.data.errors || []).some(
          err => err.code === 'TOKENEXP'
        )
        if (isTokenExpired) router.redirect('/logout')

        reject(api.deserializeError(res, args))
      })
  })
}
