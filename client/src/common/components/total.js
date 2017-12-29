import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './total.module.css'
import { formatUsd } from '../amt'

function Total(props) {
  return (
    <div className={props.css.root}>
      <span className={props.css.label}>{props.label}:</span>{' '}
      <span className={props.css.amt}>{formatUsd(props.amt)}</span>
    </div>
  )
}

Total.propTypes = {
  label: PropTypes.string,
  amt: PropTypes.number
}

Total.defaultProps = {
  label: 'Total',
  amt: 0
}

export default styleable(css)(Total)
