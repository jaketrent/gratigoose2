import React from 'react'
import styleable from 'react-styleable'

import Alerts from '../../alerts'
import css from './fullpage.module.css'

function Fullpage(props) {
  return (
    <div className={props.css.root}>
      {props.children}
      <Alerts />
    </div>
  )
}

export default styleable(css)(Fullpage)
