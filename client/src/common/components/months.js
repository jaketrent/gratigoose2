import styleable from 'react-styleable'
import React from 'react'

import css from './months.module.css'
import { monthName } from '../date'

const Months = styleable(css)(props => {
  const month = parseInt(props.month, 10)
  const year = parseInt(props.year, 10)
  return (
    <div className={props.css.months}>
      <a
        href={`/${month === 1 ? year - 1 : year}/${
          month === 1 ? 12 : month - 1
        }/budget`}
      >
        ◀
      </a>
      <a href={`/${year}/${month}/budget`}>{monthName(month)}</a>
      <a
        href={`/${month === 12 ? year + 1 : year}/${
          month === 12 ? 1 : month + 1
        }/budget`}
      >
        ▶
      </a>
    </div>
  )
})

export default Months
