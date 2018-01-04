// @flow
import type { Cat } from '../cat/types'
import type { Expected } from '../expected/types'
import type { Trans } from '../trans/types'

import PropTypes from 'prop-types'
import React from 'react'

import ExpectedInputForm from './expected-input-form'
import { formatBudgetLines } from './utils'
import { formatUsd } from '../common/amt'
import Link from '../common/components/link'
import List from '../common/components/list'

type Props = {
  cats: Cat[],
  expecteds: Expected[],
  month: ?number,
  onEditSubmit?: Cat => void,
  transs: Trans[],
  year: ?number
}

function renderEdit(props, row) {
  return (
    <ExpectedInputForm
      line={row}
      month={props.month}
      onSubmit={props.onEditSubmit.bind(null, row.cat)}
      year={props.year}
    />
  )
}

function renderHeaderData(props) {
  return ['Category', 'Expected', 'Actual', 'Difference']
}

function renderRowData(props, row) {
  return [
    <Link
      href={`/${props.year}/${props.month}/cat/${row.cat.id}`}
      tabIndex="-1"
    >
      {row.cat.name}
    </Link>,
    row.expected ? formatUsd(row.expected.amt) : formatUsd(0),
    formatUsd(row.transsAmtSum),
    formatUsd(row.diff)
  ]
}

function BudgetCatList(props: Props) {
  return (
    <List
      month={props.month}
      onEditSubmit={props.onEditSubmit}
      renderEdit={renderEdit}
      renderHeaderData={renderHeaderData}
      renderRowData={renderRowData}
      rows={formatBudgetLines(props)}
      year={props.year}
    />
  )
}

export default BudgetCatList
