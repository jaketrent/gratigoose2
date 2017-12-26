import PropTypes from 'prop-types'
import React from 'react'

import CsvColumnOption from './csv-column-option'

function CsvColumnOptions(props) {
  return (
    <div>
      {props.columns.map((c, i) => <CsvColumnOption key={i} name={c} />)}
    </div>
  )
}

CsvColumnOptions.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string)
}

export default CsvColumnOptions
