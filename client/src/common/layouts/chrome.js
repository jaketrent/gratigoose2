import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import Alerts from '../../alerts'
import Debug from '../components/debug'
import Header from '../components/header'
import Loading from '../components/loading'

function mapStateToProps(state) {
  return {
    isLoaded: state.acct.accts.length > 0 && state.cat.cats.length > 0
  }
}

function renderLoading() {
  return <Loading />
}

function renderApp(props) {
  return (
    <div>
      <Debug />
      <Header title={props.title} />
      {props.children}
      <Alerts />
    </div>
  )
}

function render(props) {
  return props.isLoaded || !props.loadTransMeta
    ? renderApp(props)
    : renderLoading(props)
}

function Chrome(props) {
  return (
    <div>
      <Debug />
      {render(props)}
      <Alerts />
    </div>
  )
}

Chrome.propTypes = {
  title: PropTypes.node,
  loadTransMeta: PropTypes.bool
}

Chrome.defaultProps = {
  loadTransMeta: true
}

export default connect(mapStateToProps)(Chrome)