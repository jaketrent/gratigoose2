// @flow
import type { Cat } from '../cat/types'
import type { Expected } from '../expected/types'
import type { Trans } from '../trans/types'

import PropTypes from 'prop-types'
import styleable from 'react-styleable'
import React from 'react'

import css from './list.module.css'
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
  return ['Category', 'Expected', 'Actual']
}

function renderRowData(props, row) {
  return [
    <Link
      href={`/${props.year}/${props.month}/cat/${row.cat.id}`}
      tabIndex="-1"
      {...row.expected && { title: row.expected.notes }}
    >
      {row.cat.name}
    </Link>,
    row.expected ? formatUsd(row.expected.amt) : formatUsd(0),
    formatUsd(row.transsAmtSum)
  ]
}

class BudgetCatList extends React.Component {
  constructor(props: Props) {
    super(props)
    this.state = {
      hideUnused: false
    }
  }
  render() {
    const { props, state } = this
    const rows = state.hideUnused
      ? formatBudgetLines(props).filter(row => {
          return !(
            (typeof row.expected === 'undefined' || row.expected.amt === 0) &&
            row.transsAmtSum === 0
          )
        })
      : formatBudgetLines(props)
    return (
      <div>
        <div className={props.css.buttonRow}>
          <button
            onClick={_ => this.setState({ hideUnused: !state.hideUnused })}
          >
            {state.hideUnused ? 'Show' : 'Hide'} unused
          </button>
        </div>
        <div className={state.hideUnused && props.css.tableFiltered}>
          <List
            month={props.month}
            onEditSubmit={props.onEditSubmit}
            renderEdit={renderEdit}
            renderHeaderData={renderHeaderData}
            renderRowData={renderRowData}
            rows={rows}
            year={props.year}
          />
        </div>
      </div>
    )
  }
}

export default styleable(css)(BudgetCatList)
