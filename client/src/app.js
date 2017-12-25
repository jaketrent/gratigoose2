import React from 'react'
import styleable from 'react-styleable'

import css from './app.module.css'
import lively from './common/lively'

const App = ({ props }) => <div className={props.css.app}>gratigoose</div>

export default styleable(css)(lively(App))
