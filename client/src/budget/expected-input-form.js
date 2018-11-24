import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import * as actions from './actions'
import css from '../common/components/input-form.module.css'
import Field from '../common/components/field'
import { formatUsd } from '../common/amt'
import { keyCodes } from '../common/events'

const initialState = {
  amt: '',
  notes: ''
}

function mapDispatchToProps(dispatch) {
  return {
    createExpected(args) {
      dispatch(actions.createExpected(args))
    },
    updateExpected(args) {
      dispatch(actions.updateExpected(args))
    }
  }
}

class ExpectedInputForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...initialState }
    if (props.line.expected) {
      this.state.amt = props.line.expected.amt
      this.state.notes = props.line.expected.notes
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    if (evt.which === keyCodes.ENTER) {
      if (this.state.amt) {
        const { line, month, year } = this.props
        const { amt, notes } = this.state
        const { cat, expected } = line

        if (expected && expected.id)
          this.props.updateExpected({ expected, amt, notes })
        else
          this.props.createExpected({ amt, notes, catId: cat.id, year, month })

        if (typeof this.props.onSubmit === 'function')
          this.props.onSubmit(evt, expected)
      }
    } else if (evt.which === keyCodes.ESC) {
      if (typeof this.props.onSubmit === 'function')
        this.props.onSubmit(evt, this.props.line.expected)
    }
  }
  render() {
    return (
      <form
        className={this.props.css.root}
        onKeyUp={this.handleSubmit}
        onSubmit={evt => evt.preventDefault()}
      >
        <div className={this.props.css.fields}>
          <Field
            css={{ field: this.props.css.field }}
            errors={this.props.errors}
            isFocused={true}
            label={this.props.line.cat.name + ' notes'}
            name="notes"
            onFieldChange={this.handleChange}
            value={this.state.notes}
          />
          <Field
            css={{ field: this.props.css.field }}
            errors={this.props.errors}
            isFocused={true}
            label="Amt"
            name="amt"
            onFieldChange={this.handleChange}
            value={this.state.amt}
          />
          <div className={this.props.css.fieldReadOnly}>
            {formatUsd(this.props.line.transsAmtSum)}
          </div>
        </div>
        <input className={this.props.css.btn} type="submit" value="Submit" />
      </form>
    )
  }
}
ExpectedInputForm.propTypes = {
  line: PropTypes.shape({
    id: PropTypes.number,
    cat: PropTypes.object,
    expected: PropTypes.object,
    transsAmtSum: PropTypes.number,
    diff: PropTypes.number
  }).isRequired,
  month: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  year: PropTypes.string.isRequired
}

export default styleable(css)(
  connect(
    null,
    mapDispatchToProps
  )(ExpectedInputForm)
)
