import PropTypes from 'prop-types'
import React from 'react'

import InputForm from './input-form'
import * as dateUtils from '../common/date'
import { formatUsd } from '../common/amt'
import IngestBadge from '../ingest/badge'
import { INGEST_CAT_ABBREV } from '../ingest/utils'
import List from '../common/components/list'

function renderEdit(props, row) {
  return (
    <InputForm
      focusFieldName="cat"
      onSubmit={props.onEditSubmit}
      submitAction="update"
      trans={row}
    />
  )
}

function renderHeaderData(props) {
  return ['Date', 'Desc', 'Amt', 'Acct', 'Cat']
}

function renderRowData(props, row) {
  console.log('cat', row.cat.abbrev, INGEST_CAT_ABBREV)
  return [
    dateUtils.format(row.date),
    row.desc,
    formatUsd(row.amt),
    row.acct.name,
    row.cat.abbrev === INGEST_CAT_ABBREV ? (
      <IngestBadge>{row.cat.name}</IngestBadge>
    ) : (
      row.cat.name
    )
  ]
}

function TransList(props) {
  return (
    <List
      onOptionClick={props.onOptionClick}
      onEditSubmit={props.onEditSubmit}
      renderEdit={renderEdit}
      renderHeaderData={renderHeaderData}
      renderRowData={renderRowData}
      rows={props.transs}
    />
  )
}

TransList.PropTypes = {
  onOptionClick: PropTypes.func,
  onEditSubmit: PropTypes.func,
  transs: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TransList
