import React from 'react'
import PropTypes from 'prop-types'

import FlowArrowLabel from './FlowArrowLabel.jsx'
import { FlowInfoShape } from './FlowInfoShape.js'

export default function PanoFlowOverlay (props) {
  const { items, panoKey } = props

  return (
    <React.Fragment>
      {/* Add flow geometry objects */}
      {items.map(item => <FlowArrowLabel key={`${panoKey}-${item.key}`} flowInfo={item} />)}
    </React.Fragment>
  )
}

PanoFlowOverlay.propTypes = {
  panoKey: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape(FlowInfoShape))
}

PanoFlowOverlay.defaultProps = {
  items: []
}
