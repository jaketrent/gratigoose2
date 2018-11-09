import * as transUtils from '../trans/utils'

export function formatBudgetLines({ cats, expecteds, transs }) {
  if (!Array.isArray(cats) || !Array.isArray(expecteds)) return []

  return cats.map(cat => {
    const expectedForCat = findExpectedForCat(cat.id, expecteds)
    const expectedAmt = expectedForCat ? expectedForCat.amt : 0
    const transsAmtSum = transUtils.sumTranssAmtForCat(cat.id, transs)
    const diff = expectedAmt - transsAmtSum
    return {
      id: cat.id,
      cat,
      expected: expectedForCat,
      transsAmtSum,
      diff
    }
  })
}
function findExpectedForCat(catId, expecteds) {
  return expecteds.find(ex => ex.catId === catId)
}

export const catType = (cats: Cat[], catId): ?CatType =>
  (findCat(cats, parseInt(catId, 10)) || {}).type

export const catName = (cats: Cat[], catId): ?string =>
  (findCat(cats, parseInt(catId, 10)) || {}).name

const findCat = (cats: Cat[], catId): ?Cat => cats.find(cat => cat.id === catId)

export const monthName = (month: number): ?string => months[month - 1]
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
