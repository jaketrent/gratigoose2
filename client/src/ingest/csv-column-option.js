import { DragSource } from 'react-dnd'
import PropTypes from 'prop-types'
import React from 'react'
import styleable from 'react-styleable'

import css from './csv-column-option.module.css'

const colSource = {
  beginDrag(props) {
    return {
      name: props.name
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

function CsvColumnOption(props) {
  const className = props.isDragging ? props.css.rootDragging : props.css.root
  return props.connectDragSource(<div className={className}>{props.name}</div>)
}

CsvColumnOption.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired
}

export default DragSource('CSVCOL', colSource, collect)(
  styleable(css)(CsvColumnOption)
)
