import React from 'react'
import PropTypes from 'prop-types'

import { flowOverlayActiveState, panoMediaPlayingState } from '../../state/globalState.js'
import { currentRoomPriorityState } from '../../state/fullTourState.js'
import { useRecoilValue } from 'recoil'

import InfoHotspot from '../HotSpots/InfoHotSpot.jsx'
import PlacardHotspot from '../HotSpots/PlacardHotSpot.jsx'
import ZoomHotspot from '../HotSpots/ZoomHotSpot.jsx'
import MediaHotspot from '../HotSpots/MediaHotSpot.jsx'
import ExitIndicator from './ExitIndicator.jsx'
import FlowHotspot from '../HotSpots/FlowHotSpot.jsx'

export default function PanoExtras (props) {
  const { exits, hotSpots, panoKey } = props

  const currentRoomPriority = useRecoilValue(currentRoomPriorityState)
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const flowOverlayActive = useRecoilValue(flowOverlayActiveState)

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
      case 'placard': return (<PlacardHotspot key={key} {...info} />)
      case 'zoom': return (<ZoomHotspot key={key} {...info} />)
      case 'media': case 'audio': return (<MediaHotspot key={key} {...info} />)
      case 'flow': return (<FlowHotspot key={key} {...info} />)
      default: return null
    }
  })

  return (
    <React.Fragment>
      {/* Add extra geometry objects */}
      {!panoMediaPlaying && !flowOverlayActive && exitArrows}
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
