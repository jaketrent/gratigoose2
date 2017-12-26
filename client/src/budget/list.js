import PropTypes from 'prop-types'
import React from 'react'

import ExpectedInputForm from './expected-input-form'
import { formatBudgetLines } from './utils'
import { formatUsd } from '../common/amt'
import List from '../common/components/list'

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
    row.cat.name,
    row.expected ? formatUsd(row.expected.amt) : formatUsd(0),
    formatUsd(row.transsAmtSum),
    formatUsd(row.diff)
  ]
}

function BudgetCatList(props) {
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
BudgetCatList.PropTypes = {
  cats: PropTypes.arrayOf(PropTypes.object).isRequired,
  expecteds: PropTypes.arrayOf(PropTypes.object).isRequired,
  month: PropTypes.string.isRequired,
  onEditSubmit: PropTypes.func,
  transs: PropTypes.arrayOf(PropTypes.object).isRequired,
  year: PropTypes.string.isRequired
}

export default BudgetCatList
