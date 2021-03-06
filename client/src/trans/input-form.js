import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import * as acctActions from '../acct/actions'
import * as actions from './actions'
import AutocompleteField from '../common/components/autocomplete-field'
import * as catActions from '../cat/actions'
import css from './input-form.module.css'
import * as dateUtils from '../common/date'
import Field from '../common/components/field'
import { keyCodes } from '../common/events'
import * as utils from './utils'

const initialState = {
  acctSearch: '',
  catSearch: '',
  trans: {
    date: new Date().getFullYear() + '-',
    desc: '',
    amt: '',
    acct: {},
    cat: {}
  }
}

function formatCompletion(obj) {
  return {
    value: obj.id,
    label: obj.name
  }
}

function mapStateToProps(state) {
  return {
    accts: state.acct.searchedAccts,
    acctCompletions: state.acct.searchedAccts.map(formatCompletion),
    cats: state.cat.searchedCats,
    catCompletions: state.cat.searchedCats.map(formatCompletion),
    isCreateSuccess: state.trans.isCreateSuccess
  }
}

function mapDispatchToProps(dispatch) {
  return {
    submit(actionName, trans) {
      if (actionName === 'create') {
        dispatch(actions[actionName]([trans]))
      } else {
        // TODO: future - convert update to use array as well
        dispatch(actions[actionName](trans))
      }
    },
    searchAccts(term) {
      dispatch(acctActions.search(term))
    },
    searchCats(term) {
      dispatch(catActions.search(term))
    }
  }
}

class Inputform extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...initialState }
    if (props.trans) this.state.trans = props.trans
    this.handleAcctChange = this.handleAcctChange.bind(this)
    this.handleAcctSelect = this.handleAcctSelect.bind(this)
    this.handleCatChange = this.handleCatChange.bind(this)
    this.handleCatSelect = this.handleCatSelect.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isCreateSuccess) {
      this.setState({ ...initialState })
    }
  }
  handleFieldChange(evt) {
    this.setState({
      trans: {
        ...this.state.trans,
        [evt.target.name]: evt.target.value
      }
    })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    if (evt.which === keyCodes.ENTER) {
      if (utils.hasRequiredFields(this.state.trans)) {
        this.props.submit(this.props.submitAction, this.state.trans)

        if (typeof this.props.onSubmit === 'function')
          this.props.onSubmit(evt, this.state.trans)
      }
    } else if (evt.which === keyCodes.ESC) {
      if (typeof this.props.onSubmit === 'function')
        this.props.onSubmit(evt, this.state.trans)
    }
  }
  handleAcctSelect(evt, id) {
    evt.preventDefault()
    const acct = this.props.accts.find(a => a.id === id) || {}
    this.setState({
      trans: {
        ...this.state.trans,
        acct
      }
    })
  }
  handleAcctChange(evt) {
    const acctSearch = evt.target.value
    this.setState({
      acctSearch,
      trans: {
        ...this.state.trans,
        acct: {}
      }
    })
    this.props.searchAccts(acctSearch)
  }
  renderAcctValue() {
    return this.state.trans.acct.id
      ? this.state.trans.acct.abbrev
      : this.state.acctSearch
  }
  handleCatSelect(evt, id) {
    evt.preventDefault()
    const cat = this.props.cats.find(a => a.id === id) || {}
    this.setState({
      trans: {
        ...this.state.trans,
        cat
      }
    })
  }
  handleCatChange(evt) {
    const catSearch = evt.target.value
    this.setState({
      catSearch,
      trans: {
        ...this.state.trans,
        cat: {}
      }
    })
    this.props.searchCats(catSearch)
  }
  renderCatValue() {
    return this.state.trans.cat.id
      ? this.state.trans.cat.abbrev
      : this.state.catSearch
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
            isFocused={this.props.focusFieldName === 'date'}
            label="Date"
            name="date"
            onFieldChange={this.handleFieldChange}
            value={dateUtils.stripTz(this.state.trans.date)}
          />
          <Field
            css={{ field: this.props.css.field }}
            errors={this.props.errors}
            isFocused={this.props.focusFieldName === 'desc'}
            label="Description"
            name="desc"
            onFieldChange={this.handleFieldChange}
            value={this.state.trans.desc}
          />
          <Field
            css={{ field: this.props.css.field }}
            errors={this.props.errors}
            isFocused={this.props.focusFieldName === 'amt'}
            label="Amount"
            name="amt"
            onFieldChange={this.handleFieldChange}
            value={this.state.trans.amt}
          />
          <AutocompleteField
            completions={this.props.acctCompletions}
            css={{ field: this.props.css.field }}
            errors={this.props.errors}
            isFocused={this.props.focusFieldName === 'acct'}
            label="Account"
            name="acct"
            onFieldChange={this.handleAcctChange}
            onSelect={this.handleAcctSelect}
            value={this.renderAcctValue()}
          />
          <AutocompleteField
            completions={this.props.catCompletions}
            css={{ field: this.props.css.field }}
            errors={this.props.errors}
            isFocused={this.props.focusFieldName === 'cat'}
            isSelected={true}
            label="Category"
            name="cat"
            onFieldChange={this.handleCatChange}
            onSelect={this.handleCatSelect}
            value={this.renderCatValue()}
          />
        </div>
        <input className={this.props.css.btn} type="submit" value="Create" />
      </form>
    )
  }
}
Inputform.propTypes = {
  focusFieldName: PropTypes.string,
  onSubmit: PropTypes.func,
  submitAction: PropTypes.string,
  trans: PropTypes.object
}

Inputform.defaultProps = {
  focusFieldName: 'date',
  submitAction: 'create'
}

export default styleable(css)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Inputform)
)
