// @flow
export type Cat = {
  name: string,
  abbrev: string
}

export type cat$State = {
  cats: Cat[],
  searchedCats: Cat[]
}

export type cat$FindAllAction = {
  type: 'cat/FIND_ALL'
}
export type cat$Actions = cat$FindAllAction

export default {
  debit: 'debit',
  credit: 'credit',
  savings: 'savings',
  both: 'both'
}
