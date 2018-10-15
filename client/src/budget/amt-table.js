import React from 'react'
import styleable from 'react-styleable'

import css from './amt-table.module.css'

function AmtTable(props) {
  return <div className={props.css.root}>{props.children}</div>
}

export default styleable(css)(AmtTable)
