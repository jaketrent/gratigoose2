import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './field.module.css'
import FieldErrors from './field-errors'

class Field extends React.Component {
  static propTypes = {
    css: PropTypes.object,
    errors: PropTypes.arrayOf(PropTypes.object),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    isWithErrors: PropTypes.bool,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onFieldKeyUp: PropTypes.func,
    type: PropTypes.string,
    value: PropTypes.node
  }
  static defaultProps = {
    isFocused: false,
    isSelected: false,
    type: 'text',
    isWithErrors: true
  }
  componentDidMount() {
    const input = findDOMNode(this.refs.input)
    if (this.props.isFocused) input.focus()

    if (this.props.isSelected) input.setSelectionRange(0, input.value.length)
  }
  renderField() {
    return this.props.type === 'textarea'
      ? this.renderTextarea()
      : this.renderInput()
  }
  renderInput() {
    return (
      <input
        className={this.props.css.input}
        type={this.props.type}
        id={this.props.name}
        name={this.props.name}
        placeholder={this.props.label}
        value={this.props.value}
        onChange={this.props.onFieldChange}
        onKeyUp={this.props.onFieldKeyUp}
        ref="input"
      />
    )
  }
  renderTextarea() {
    return (
      <textarea
        className={this.props.css.inputTextarea}
        id={this.props.name}
        name={this.props.name}
        placeholder={this.props.label}
        value={this.props.value}
        onChange={this.props.onFieldChange}
        ref="input"
      />
    )
  }
  renderErrors() {
    if (this.props.isWithErrors)
      return <FieldErrors name={this.props.name} errors={this.props.errors} />
  }
  render() {
    return (
      <label htmlFor={this.props.name} className={this.props.css.field}>
        {this.renderErrors()}
        <span className={this.props.css.labelText}>{this.props.label}</span>
        {this.renderField()}
      </label>
    )
  }
}

export default styleable(css)(Field)
