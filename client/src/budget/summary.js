// @flow
import type { Cat, CatType } from '../cat/types'
import type { Expected } from '../expected/types'
import type { Trans } from '../trans/types'

import React from 'react'
import styleable from 'react-styleable'

import css from './summary.module.css'
import { catName, catType, findCat } from './utils'
import { catTypesMap } from '../cat/types'
import { formatUsd } from '../common/amt'
import AmtTable from './amt-table'
import SectionTitle from '../common/components/section-title'

type Props = {
  cats: Cat[],
  css: Object,
  expecteds: Expected[],
  transs: Trans[]
}

function Summary(props: Props) {
  const expectedIncome = props.expecteds
    .filter(e => e.amt > 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
  const expectedIncomeSum = expectedIncome.reduce((sum, e) => sum + e.amt, 0)
  const expectedDebits = props.expecteds
    .filter(e => e.amt <= 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
  const expectedDebitSum = expectedDebits.reduce((sum, e) => sum + e.amt, 0)
  const expectedSavings = props.expecteds.filter(
    e => catType(props.cats, e.catId) === catTypesMap.savings
  )
  const expectedSavingSum = expectedSavings.reduce((sum, e) => sum + e.amt, 0)
  const expectedNetSum =
    expectedIncomeSum + expectedDebitSum - expectedSavingSum

  const transIncome = props.transs
    .filter(e => e.amt > 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
  const incomeSum = transIncome.reduce((sum, e) => sum + e.amt, 0)

  const transDebits = props.transs
    .filter(e => e.amt <= 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
  const debitSum = transDebits.reduce((sum, e) => sum + e.amt, 0)

  const transSavings = props.transs.filter(
    e => catType(props.cats, e.catId) === catTypesMap.savings
  )
  const savingSum = transSavings.reduce((sum, e) => sum + e.amt, 0)

  const smallestToLargest = (a, b) => a.amt - b.amt
  const largestToSmallest = (a, b) => b.amt - a.amt

  return (
    <div className={props.css.root}>
      <SectionTitle>Plan</SectionTitle>
      <AmtTable>
        <div>Income</div>
        <div>{formatUsd(expectedIncomeSum)}</div>
        <div>Debits</div>
        <div>{formatUsd(expectedDebitSum)}</div>
        <div>Savings</div>
        <div>{formatUsd(expectedSavingSum)}</div>
        <div className={props.css.sum}>Net</div>
        <div className={props.css.sum}>{formatUsd(expectedNetSum)}</div>
      </AmtTable>
      <SectionTitle>Income</SectionTitle>
      <AmtTable>
        {expectedIncome
          .sort(largestToSmallest)
          .map(e => [
            <div>{catName(props.cats, e.catId)}</div>,
            <div>{formatUsd(e.amt)}</div>
          ])}
      </AmtTable>
      <SectionTitle>Debit</SectionTitle>
      <AmtTable>
        {expectedDebits
          .sort(smallestToLargest)
          .slice(0, 10)
          .map(e => [
            <div>{catName(props.cats, e.catId)}</div>,
            <div>{formatUsd(e.amt)}</div>
          ])}
      </AmtTable>
      <SectionTitle>Savings</SectionTitle>
      <AmtTable>
        {expectedSavings
          .sort(largestToSmallest)
          .slice(0, 10)
          .map(e => [
            <div>{catName(props.cats, e.catId)}</div>,
            <div>{formatUsd(e.amt)}</div>
          ])}
      </AmtTable>
    </div>
  )
}

export default styleable(css)(Summary)
