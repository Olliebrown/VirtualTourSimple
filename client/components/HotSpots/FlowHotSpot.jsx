import React from 'react'

import { flowOverlayActiveState, hotspotHoverState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function FlowHotspot (props) {
  const hotSpotBase = React.useMemo(
    () => new HotSpot(props),
    [props]
  )

  const setFlowOverlayActive = useSetRecoilState(flowOverlayActiveState)
  const setHotspotHover = useSetRecoilState(hotspotHoverState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setFlowOverlayActive(true)
    setHotspotHover({ hovering: false })
  }, [setFlowOverlayActive, setHotspotHover])

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
      onClick={onClick}
    />
  )
}
