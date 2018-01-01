// @flow
import React from 'react'
import styleable from 'react-styleable'

import css from './badge.module.css'

const Badge = props => <div className={props.css.badge}>{props.children}</div>

export default styleable(css)(Badge)
