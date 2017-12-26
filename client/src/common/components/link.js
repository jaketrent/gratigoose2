import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './link.module.css'
import * as urlUtil from '../url'

class Link extends React.Component {
  render() {
    const { href, basePath, ...props } = this.props
    return (
      <a
        className={props.css.isActive ? props.css.rootActive : props.css.root}
        href={urlUtil.formatUrl(href, basePath)}
        ref="link"
      >
        {this.props.children}
      </a>
    )
  }
}
Link.propTypes = {
  basePath: PropTypes.string,
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool
}
Link.defaultProps = {
  basePath: ''
}

const StyledLink = styleable(css)(Link)

function mapStateToProps(state) {
  return {
    routing: state.routing
  }
}

class LinkContainer extends React.Component {
  render() {
    const isRouteMatch = urlUtil.routesMatch(
      this.props.routing.path,
      this.props.href,
      this.props.routing.basePath
    )
    return (
      <StyledLink
        {...this.props}
        basePath={this.props.routing.basePath}
        isActive={isRouteMatch}
      >
        {this.props.children}
      </StyledLink>
    )
  }
}

export default connect(mapStateToProps)(LinkContainer)
