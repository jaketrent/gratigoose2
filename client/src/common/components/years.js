import styleable from 'react-styleable'
import React from 'react'

import css from './years.module.css'

const Years = styleable(css)(props => {
  const year = parseInt(props.year, 10)
  return (
    <div className={props.css.years}>
      <a href={`/${year - 1}/tithing`}>◀</a>
      <a href={`/${year}/tithing`}>{year}</a>
      <a href={`/${year + 1}/tithing`}>▶</a>
    </div>
  )
})

export default Years
