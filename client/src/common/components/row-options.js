import FocusTrap from 'focus-trap-react'
import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './row-options.css'

function RowOptions(props) {
  return (
    <FocusTrap>
      <div className={props.css.root}>
        <button
          className={props.css.option}
          onClick={props.onClick.bind(null, 'destroy')}
        >
          Destroy
        </button>
        <button
          className={props.css.option}
          onClick={props.onClick.bind(null, 'close')}
        >
          Close
        </button>
      </div>
    </FocusTrap>
  )
}
RowOptions.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default styleable(css)(RowOptions)
