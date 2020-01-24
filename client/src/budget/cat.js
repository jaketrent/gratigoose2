import { connect } from 'react-redux'
import { line } from 'd3-shape'
import { scaleLinear, scaleTime } from 'd3-scale'
import React from 'react'
import styleable from 'react-styleable'

import * as actions from '../trans/actions'
import { catName } from './utils'
import Chrome from '../common/layouts/chrome'
import css from './cat.module.css'
import { formatUsd } from '../common/amt'
import InputForm from '../trans/input-form'
import List from '../trans/list'
import renderWithState from '../common/store/render'
import Title from '../common/components/title'
import { toDate, monthName } from '../common/date'
import Total from '../common/components/total'

function mapStateToProps(state) {
  const { month, year, catId } = state.routing.params
  return {
    catName: catName(state.cat.cats, catId),
    expected: state.budget.expecteds[0],
    month,
    transAmtTotal: state.budget.transs.reduce((total, t) => total + t.amt, 0),
    transs: state.budget.transs, //.filter(t => t.catId === catId),
    year
  }
}

function mapDispatchToProps(dispatch) {
  return {
    destroy(trans) {
      dispatch(actions.destroy(trans))
    }
  }
}

function handleDestroyOption(props, trans) {
  if (window.confirm('Are you sure you want to destroy?')) props.destroy(trans)
}

const optionHandlers = {
  destroy: handleDestroyOption
}

function handleOptionClick(props, optionName, trans) {
  const handler = optionHandlers[optionName]
  if (typeof handler === 'function') handler(props, trans)
}

const maxTrans = transs =>
  transs.reduce((maxT, t) => (t.amt > maxT.amt ? t : maxT), transs[0])

const minTrans = transs =>
  transs.reduce((minT, t) => (t.amt < minT.amt ? t : minT), transs[0])

const LineChart = styleable(css)(props => {
  if (props.transs.length === 0) return null

  const minDate = new Date(props.year, props.month - 1, 1)
  const maxDate = new Date(props.year, props.month, 0)

  const defaultCatType = 'debit'
  const catType = props.transs[0].cat.type
  let subtotal = {
    debit: Math.abs(props.expected.amt),
    credit: 0,
    savings: 0,
    both: Math.abs(props.expected.amt)
  }[catType || defaultCatType]
  const transByDate = (a, b) => {
    const dateA = toDate(a.date)
    const dateB = toDate(b.date)
    return dateA - dateB
  }
  const catOverTime = [
    {
      amt: 0,
      desc: 'Starting allotment',
      date: minDate,
      subtotal
    }
  ].concat(
    props.transs.sort(transByDate).map(t => {
      subtotal = subtotal + t.amt
      return {
        amt: t.amt,
        desc: t.desc,
        date: toDate(t.date),
        subtotal
      }
    })
  )

  const height = 100
  const width = 300
  const x = scaleTime()
    .range([0, width])
    .domain([minDate, maxDate])

  const maxAmt = {
    debit: Math.abs(props.expected.amt),
    credit: Math.max(subtotal, props.expected.amt),
    savings: Math.max(subtotal, props.expected.amt),
    both: Math.abs(props.expected.amt)
  }[catType || defaultCatType]
  const minAmt = {
    debit: subtotal,
    credit: 0,
    savings: 0,
    both: subtotal
  }[catType || defaultCatType]

  const amtDiff = maxAmt - minAmt
  const percentYToPlaceZero = maxAmt / amtDiff
  const zeroLineY = height * percentYToPlaceZero

  const y = scaleLinear()
    .range([height, 0])
    .domain([minAmt, maxAmt])

  const transsLine = line()
    .x(t => x(t.date))
    .y(t => y(t.subtotal))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={props.css.lineChart}>
      {subtotal < 0 && [
        <rect
          className={props.css.zeroSpace}
          x="0"
          y={zeroLineY}
          width={width}
          height={height - zeroLineY}
        />,
        <line
          className={props.css.zeroLine}
          x1="0"
          y1={zeroLineY}
          x2={width}
          y2={zeroLineY}
        />
      ]}
      <path className={props.css.line} d={transsLine(catOverTime)} />
      <line
        className={props.css.zeroLine}
        x1="0"
        y1={height}
        x2={width}
        y2={height}
      />
    </svg>
  )
})

const BigNum = styleable(css)(props => (
  <div className={props.css.bigNum}>
    <div className={props.css.bigNumLabel}>{props.label}</div>
    <div className={props.css.bigNumNum}>{formatUsd(props.children)}</div>
  </div>
))

function CatYearMonthTrans(props) {
  return (
    <Chrome
      title={
        <Title>
          {props.catName} for {monthName(props.month)} {props.year}
        </Title>
      }
    >
      {props.transs.length > 0 && (
        <div className={props.css.budgetSpace}>
          <div className={props.css.budgetSpaceCols}>
            <BigNum label="Budgeted">{props.expected.amt}</BigNum>
            <BigNum label="Actual">{props.transAmtTotal}</BigNum>
            <LineChart {...props} />
          </div>
        </div>
      )}
      <List
        onOptionClick={(optionName, trans) =>
          handleOptionClick(props, optionName, trans)
        }
        transs={props.transs}
      />
    </Chrome>
  )
}

export default function render(store, el) {
  renderWithState(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(styleable(css)(CatYearMonthTrans)),
    el
  )
}
