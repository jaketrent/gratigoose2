import PropTypes from 'prop-types'
import React from 'react'

function CsvHeaderToggle(props) {
  return (
    <div>
      <label>
        <span>Includes header?</span>
        <input
          onChange={props.onChange}
          type="checkbox"
          checked={props.checked}
        />
      </label>
    </div>
  )
}

CsvHeaderToggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

export default CsvHeaderToggle
