import React from 'react'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function PlacardHotspot (props) {
  const hotSpotBase = React.useMemo(
    () => new HotSpot({ type: 'placard', ...props }),
    [props]
  )

  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
    />
  )
}
