// @flow
export type Acct = {
  // TODO: later
}
export type acct$State = {
  accts: Acct[],
  searchedAccts: Acct[]
}

export type acct$FindAllAction = {
  type: 'acct/FIND_ALL'
}

export type acct$Actions = acct$FindAllAction
