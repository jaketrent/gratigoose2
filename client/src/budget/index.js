// @flow
import type { Cat } from '../cat/types'
import type { Expected } from '../expected/types'
import type { State } from '../common/store/types'
import type { Trans } from '../trans/types'

import { connect } from 'react-redux'
import styleable from 'react-styleable'
import React from 'react'

import * as actions from './actions'
import css from './index.module.css'
import Chrome from '../common/layouts/chrome'
import List from './list'
import renderWithState from '../common/store/render'
import Summary from './summary'
import Title from '../common/components/title'

type Props = {
  cats: Cat[],
  expecteds: Expected[],
  month: ?number,
  transs: Trans[],
  year: ?number
}

function mapStateToProps(state: State): Props {
  return {
    cats: state.cat.cats,
    expecteds: state.budget.expecteds,
    month: state.routing.params.month,
    transs: state.budget.transs,
    year: state.routing.params.year
  }
}

type DispatchProps = {
  reuseLastBudget: ({ month: number, year: number }) => void
}
function mapDispatchToProps(dispatch): DispatchProps {
  return {
    reuseLastBudget({ month, year }) {
      dispatch(actions.reuseLastBudget({ month, year }))
    }
  }
}

const Cols = styleable(css)(props => {
  return (
    <div className={props.css.cols}>
      {props.left}
      {props.right}
    </div>
  )
})

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
const Months = styleable(css)(props => {
  const month = parseInt(props.month, 10)
  const year = parseInt(props.year, 10)
  return (
    <div className={props.css.months}>
      <a
        href={`/${month === 1 ? year - 1 : year}/${
          month === 1 ? 12 : month - 1
        }/budget`}
      >
        ◀
      </a>
      <a href={`/${year}/${month}/budget`}>{months[month - 1]}</a>
      <a
        href={`/${month === 12 ? year + 1 : year}/${
          month === 12 ? 1 : month + 1
        }/budget`}
      >
        ▶
      </a>
    </div>
  )
})

const isThePast = (year, month) => {
  year = parseInt(year, 10)
  month = parseInt(month, 10)
  const now = new Date()
  const isPastYear = year < now.getFullYear()
  const isPastMonthCurrentYear =
    year === now.getFullYear() && month < now.getMonth() + 1
  return isPastYear || isPastMonthCurrentYear
}

const HistoricalMarker = styleable(css)(
  props =>
    isThePast(props.year, props.month) ? (
      <div className={props.css.historical}>(Historical)</div>
    ) : null
)

function handleReuseLastBudget(props, evt) {
  evt.preventDefault()
  props.reuseLastBudget({ month: props.month, year: props.year })
}

function Budget(props: Props) {
  return (
    <Chrome
      title={
        <Title>
          Budget
          <Months month={props.month} year={props.year} />
        </Title>
      }
    >
      <Cols
        left={
          <List
            cats={props.cats}
            expecteds={props.expecteds}
            month={props.month}
            transs={props.transs}
            year={props.year}
          />
        }
        right={
          <div className={props.css.aside}>
            <HistoricalMarker year={props.year} month={props.month} />
            {props.expecteds.length === 0 && (
              <button onClick={evt => handleReuseLastBudget(props, evt)}>
                Reuse last budget
              </button>
            )}
            <Summary
              cats={props.cats}
              expecteds={props.expecteds}
              transs={props.transs}
            />
          </div>
        }
      />
    </Chrome>
  )
}

export default function render(_: any, el: Element) {
  renderWithState(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(styleable(css)(Budget)),
    el
  )
}
