import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './header.module.css'
import Link from '../components/link'

function Header(props) {
  return (
    <div className={props.css.root}>
      <Link href="/" css={{ root: props.css.img }}>
        Gratigoose
      </Link>
      {props.title}
      <nav className={props.css.nav}>
        <Link css={{ root: props.css.navLink }} href="/">
          Transactions
        </Link>
        <Link css={{ root: props.css.navLink }} href="/budget">
          Budget
        </Link>
        <Link css={{ root: props.css.navLink }} href="/tithing">
          Tithing
        </Link>
        <Link css={{ root: props.css.navLink }} href="/ingest">
          Ingest
        </Link>
        <Link css={{ root: props.css.navLink }} href="/logout">
          Logout
        </Link>
      </nav>
      {props.children}
    </div>
  )
}
Header.propTypes = {
  title: PropTypes.node
}

export default styleable(css)(Header)
