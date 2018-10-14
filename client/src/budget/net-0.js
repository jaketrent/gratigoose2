import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './net-0.module.css'
import { formatUsd } from '../common/amt'

function Net0(props) {
  return (
    <div className={props.css.root}>
      <div>Income</div>
      <div>{formatUsd(props.income)}</div>
      <div>Debits</div>
      <div>
        {props.debits > 0 ? '+' : ''}
        {formatUsd(props.debits)}
      </div>
      <div>Savings</div>
      <div>
        {props.savings > 0 ? '+' : ''}
        {formatUsd(props.savings)}
      </div>
      <div />
      <div className={props.css.valueNet}>= {formatUsd(props.net)}</div>
    </div>
  )
}

Net0.propTypes = {
  income: PropTypes.number.isRequired,
  debits: PropTypes.number.isRequired,
  savings: PropTypes.number.isRequired,
  net: PropTypes.number.isRequired
}

export default styleable(css)(Net0)
