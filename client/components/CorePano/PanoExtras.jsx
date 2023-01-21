import React from 'react'
import PropTypes from 'prop-types'

import { currentRoomPriorityState } from '../../state/fullTourState.js'
import { useRecoilValue } from 'recoil'

import InfoHotspot from '../HotSpots/InfoHotSpot.jsx'
import MediaHotspot from '../HotSpots/MediaHotSpot.jsx'
import ExitIndicator from './ExitIndicator.jsx'

export default function PanoExtras (props) {
  const { exits, hotSpots, panoKey } = props

  const currentRoomPriority = useRecoilValue(currentRoomPriorityState)

  // Enable exits and hotspots based on priority (must be equal to or higher than the current priority)
  const [activeExits, setActiveExits] = React.useState([])
  const [activeHotSpots, setActiveHotSpots] = React.useState([])
  React.useEffect(() => {
    setActiveExits(exits.filter((exit) => (exit.priority ?? 0) <= currentRoomPriority))
    setActiveHotSpots(hotSpots.filter((hotspot) => (hotspot.priority ?? 0) <= currentRoomPriority))
  }, [currentRoomPriority, exits, hotSpots])

  // Build the exit arrows
  const exitArrows = activeExits?.map((exit, i) => {
    return (
      <React.Suspense key={`${exit.key}-${i}`} fallback={null}>
        <ExitIndicator {...exit} destination={exit.key} />
      </React.Suspense>
    )
  })

  // Build the info hot spots
  const hotspots = activeHotSpots?.map(info => {
    const key = `${panoKey}-${info.id}`
    switch (info.type) {
      case 'info': return (<InfoHotspot key={key} {...info} />)
      case 'media': return (<MediaHotspot key={key} {...info} />)
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
