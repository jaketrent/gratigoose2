import React, { Component } from 'react'
import styleable from 'react-styleable'

import css from './app.module.css'

class App extends Component {
  render() {
    return <div className={this.props.css.app}>gratigoose</div>
  }
}

export default styleable(css)(App)
