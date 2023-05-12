import React from 'react'
import PropTypes from 'prop-types'

import FlowArrow from './FlowArrow.jsx'
import FlowLabel from './FlowLabel.jsx'

export default function PanoFlowOverlay (props) {
  const { arrows, labels, panoKey } = props

  // Build the flow labels and arrows
  const flowArrows = arrows.map(arrow => {
    const key = `${panoKey}-${arrow.key}`
    return (<FlowArrow key={key} {...arrow} />)
  })

  const flowLabels = labels.map(label => {
    const key = `${panoKey}-${label.key}`
    return (<FlowLabel key={key} {...label} />)
  })

  return (
    <React.Fragment>
      {/* Add flow geometry objects */}
      {flowArrows}
      {flowLabels}
    </React.Fragment>
  )
}

PanoFlowOverlay.propTypes = {
  panoKey: PropTypes.string.isRequired,
  arrows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired
  })),
  labels: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired
  }))
}

PanoFlowOverlay.defaultProps = {
  arrows: [],
  labels: []
}
