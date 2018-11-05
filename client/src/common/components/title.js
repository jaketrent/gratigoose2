import React from 'react'
import styleable from 'react-styleable'

import css from './title.module.css'

function Title(props) {
  return <h2 className={props.css.title}>{props.children}</h2>
}

export default styleable(css)(Title)
