// @flow

const catTypes = {
  debit: 'debit',
  credit: 'credit',
  savings: 'savings',
  both: 'both'
}

// export type CatType = 'debit' | 'credit' | 'savings' | 'both'
export type CatType = $Keys<typeof catTypes>

export const catTypesMap: { [key: CatType]: ?CatType } = catTypes

export type Cat = {
  id: number,
  name: string,
  abbrev: string,
  type: CatType
}

export type cat$State = {
  cats: Cat[],
  searchedCats: Cat[],
  catsById: { [catId: number]: Cat }
}

export type cat$FindAllAction = {
  type: 'cat/FIND_ALL'
}
export type cat$FindAllSuccessAction = {
  type: 'cat/FIND_ALL_SUCCESS',
  cats: Cat[]
}
export type cat$SearchSuccessAction = {
  type: 'cat/SEARCH_SUCCESS',
  cats: Cat[]
}
export type cat$Actions =
  | cat$FindAllAction
  | cat$FindAllSuccessAction
  | cat$SearchSuccessAction
