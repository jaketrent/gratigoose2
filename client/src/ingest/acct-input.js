import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './acct-input.css'

function renderOption(props, acct, i) {
  return (
    <li
      className={props.css.item}
      key={i}
      onClick={e => props.onSelect(e, acct)}
    >
      {acct.name}
    </li>
  )
}

function renderOptions(props) {
  return props.accts.map((a, i) => renderOption(props, a, i))
}

function AcctInput(props) {
  return <ul className={props.css.root}>{renderOptions(props)}</ul>
}

AcctInput.propTypes = {
  accts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired
}

export default styleable(css)(AcctInput)
