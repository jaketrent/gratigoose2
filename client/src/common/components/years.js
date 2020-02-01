import styleable from 'react-styleable'
import React from 'react'

import css from './years.module.css'

const Years = styleable(css)(props => {
  const year = parseInt(props.year, 10)
  return (
    <div className={props.css.years}>
      <a href={`/${year - 1}${props.href}`}>◀</a>
      <a href={`/${year}${props.href}`}>{year}</a>
      <a href={`/${year + 1}${props.href}`}>▶</a>
    </div>
  )
})
Years.defaultProps = {
  href: ''
}

export default Years
