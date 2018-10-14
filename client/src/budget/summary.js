// @flow
import type { Cat, CatType } from '../cat/types'
import type { Expected } from '../expected/types'
import type { Trans } from '../trans/types'

import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './summary.module.css'
import { catTypesMap } from '../cat/types'
import { formatUsd } from '../common/amt'
import Net0 from './net-0'
import SectionTitle from '../common/components/section-title'

function Row(props) {
  return (
    <tr className={props.css.row}>
      <td className={props.css.cell}>{props.label}</td>
      <td className={props.css.cell}>{formatUsd(props.amt)}</td>
    </tr>
  )
}

type Props = {
  cats: Cat[],
  css: Object,
  expecteds: Expected[],
  transs: Trans[]
}

Row.PropTypes = {
  label: PropTypes.string,
  amt: PropTypes.number
}

const catType = (cats: Cat[], catId): ?CatType =>
  (cats.find(cat => cat.id === catId) || {}).type

function Summary(props: Props) {
  const expectedIncome = props.expecteds
    .filter(e => e.amt > 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
    .reduce((sum, e) => sum + e.amt, 0)
  const expectedDebits = props.expecteds
    .filter(e => e.amt <= 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
    .reduce((sum, e) => sum + e.amt, 0)
  const expectedSavings = props.expecteds
    .filter(e => catType(props.cats, e.catId) === catTypesMap.savings)
    .reduce((sum, e) => sum + e.amt, 0)
  const expectedNet = expectedIncome + expectedDebits - expectedSavings

  const transIncome = props.transs
    .filter(e => e.amt > 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
    .reduce((sum, e) => sum + e.amt, 0)
  const transDebits = props.transs
    .filter(e => e.amt <= 0)
    .filter(e => catType(props.cats, e.catId) !== catTypesMap.savings)
    .reduce((sum, e) => sum + e.amt, 0)
  const transSavings = props.transs
    .filter(e => catType(props.cats, e.catId) === catTypesMap.savings)
    .reduce((sum, e) => sum + e.amt, 0)
  // const transNet = transIncome + transDebits - transSavings

  // TODO: include nets in some sort of balance viz
  return (
    <div className={props.css.root}>
      <Net0
        income={expectedIncome}
        debits={expectedDebits}
        savings={expectedSavings}
        net={expectedNet}
      />
    </div>
  )
}
Summary.PropTypes = {
  expecteds: PropTypes.arrayOf(PropTypes.object),
  transs: PropTypes.arrayOf(PropTypes.object)
}

export default styleable(css)(Summary)
