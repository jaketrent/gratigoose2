// @flow
import type { Dispatch } from 'redux'

import type { Acct } from '../acct/types'
import type { Cat } from '../cat/types'
import type { Actions, State } from '../common/store/types'

import { connect } from 'react-redux'
import React from 'react'

import AcctInput from './acct-input'
import * as actions from './actions'
import Chrome from '../common/layouts/chrome'
import CsvAligner from './csv-aligner'
import CsvInput from './csv-input'
import renderWithState from '../common/store/render'
import * as router from '../common/router'
import SectionTitle from '../common/components/section-title'
import Title from '../common/components/title'
import * as utils from './utils'

function formatRows(contents: string): string[][] {
  return contents
    .split('\n')
    .map(row => row.split(','))
    .filter(row => row.filter(cell => cell).length > 1)
}

type StateProps = {
  accts: Acct[],
  cats: Cat[]
}

function mapStateToProps(state: State): StateProps {
  return {
    accts: state.acct.accts,
    cats: state.cat.cats
  }
}

type DispatchProps = {
  upload: ({
    acct: ?Acct,
    cat: ?Cat,
    columns: string[], // TODO: mv away from primitive
    rows: string[][]
  }) => void
}

function mapDispatchToProps(dispatch: Dispatch<Actions>): DispatchProps {
  return {
    upload(args) {
      dispatch(actions.upload(args))
    }
  }
}

type Props = StateProps & DispatchProps

type IngestState = {
  acct: ?Acct,
  columns: string[],
  rows: string[][],
  file: ?File
}

class Ingest extends React.Component<Props, IngestState> {
  constructor(props) {
    super()
    this.state = {
      acct: null,
      columns: [],
      rows: [],
      file: null
    }
    this.handleAcctSelect = this.handleAcctSelect.bind(this)
    this.handleAlignSubmit = this.handleAlignSubmit.bind(this)
    this.handleFileLoad = this.handleFileLoad.bind(this)
    this.handleFileSelect = this.handleFileSelect.bind(this)
  }
  handleAcctSelect: (SyntheticEvent<*>, Acct) => void
  handleAcctSelect(_, acct) {
    this.setState({ acct })
  }
  handleFileLoad: string => void // TODO: specify any
  handleFileLoad(contents) {
    this.setState({ rows: formatRows(contents) })
  }
  handleFileSelect: File => void
  handleFileSelect(file: File) {
    this.setState({ file })
  }
  handleAlignSubmit: (SyntheticEvent<*>, any[], boolean) => void // TODO: specify any
  handleAlignSubmit(evt, columns, includesHeader = true) {
    this.setState({ columns }, _ => {
      this.props.upload({
        acct: this.state.acct,
        cat: this.props.cats.find(c => c.abbrev === utils.INGEST_CAT_ABBREV),
        columns: this.state.columns,
        rows: includesHeader ? this.state.rows.slice(1) : this.state.rows
      })

      router.redirect('/')
    })
  }
  renderAcctInput() {
    return this.props.accts.length > 0 && !this.state.acct ? (
      <div>
        <SectionTitle>Select source account</SectionTitle>
        <AcctInput accts={this.props.accts} onSelect={this.handleAcctSelect} />
      </div>
    ) : null
  }
  renderFileInput() {
    return this.state.acct && this.state.rows.length === 0 ? (
      <div>
        <SectionTitle>Find transactions CSV</SectionTitle>
        <CsvInput
          onLoad={this.handleFileLoad}
          onSelect={this.handleFileSelect}
        />
      </div>
    ) : null
  }
  renderTable() {
    return this.state.rows.length > 0 && this.state.columns.length === 0 ? (
      <div>
        <SectionTitle>Identify transaction fields</SectionTitle>
        <CsvAligner onSubmit={this.handleAlignSubmit} rows={this.state.rows} />
      </div>
    ) : null
  }
  render() {
    return (
      <Chrome loadTransMeta={false} title={<Title>Ingest</Title>}>
        {this.renderAcctInput()}
        {this.renderFileInput()}
        {this.renderTable()}
      </Chrome>
    )
  }
}

const ConnectedIngest = connect(mapStateToProps, mapDispatchToProps)(Ingest)

export default function render(_: any, el: Element) {
  renderWithState(ConnectedIngest, el)
}
