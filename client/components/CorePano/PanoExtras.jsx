import React from 'react'
import PropTypes from 'prop-types'

import InfoHotspot from '../HotSpots/InfoHotSpot.jsx'
import ExitIndicator from './ExitIndicator.jsx'

export default function PanoExtras (props) {
  const { exits, hotSpots, panoKey } = props

  // Build the exit arrows
  const exitArrows = exits?.map((exit, i) => {
    return (
      <React.Suspense key={`${exit.key}-${i}`} fallback={null}>
        <ExitIndicator {...exit} destination={exit.key} />
      </React.Suspense>
    )
  })

  // Build the info hot spots
  const hotspots = hotSpots?.map(info => {
    const key = `${panoKey}-${info.id}`
    switch (info.type) {
      case 'info': return (<InfoHotspot key={key} {...info} />)
    }
    return null
  })

  return (
    <React.Fragment>
      {/* Add extra geometry objects */}
      {exitArrows}
      {hotspots}
    </React.Fragment>
  )
}

PanoExtras.propTypes = {
  exits: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired
  })),
  hotSpots: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })),
  panoKey: PropTypes.string.isRequired
}

PanoExtras.defaultProps = {
  exits: [],
  hotSpots: []
}
