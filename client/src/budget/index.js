// @flow
import type { Cat } from '../cat/types'
import type { Expected } from '../expected/types'
import type { State } from '../common/store/types'
import type { Trans } from '../trans/types'

import { connect } from 'react-redux'
import React from 'react'

import Chrome from '../common/layouts/chrome'
import List from './list'
import renderWithState from '../common/store/render'
import SectionTitle from '../common/components/section-title'
import Summary from './summary'
import Title from '../common/components/title'

type Props = {
  cats: (?Cat)[],
  expecteds: (?Expected)[],
  month: ?number,
  transs: (?Trans)[],
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

function Budget(props: Props) {
  return (
    <Chrome title={<Title>Budget</Title>}>
      <Summary expecteds={props.expecteds} transs={props.transs} />
      <SectionTitle>Categories</SectionTitle>
      <List
        cats={props.cats}
        expecteds={props.expecteds}
        month={props.month}
        transs={props.transs}
        year={props.year}
      />
    </Chrome>
  )
}

export default function render(_: any, el: Element) {
  renderWithState(connect(mapStateToProps)(Budget), el)
}
