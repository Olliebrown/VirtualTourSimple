import React from 'react'

import { flowOverlayActiveState, hotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function FlowHotspot (props) {
  const hotSpotBase = React.useMemo(
    () => new HotSpot(props),
    [props]
  )

  const setFlowOverlayActive = useSetRecoilState(flowOverlayActiveState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setFlowOverlayActive(true)
    setHotspotData({
      type: hotSpotBase.type,
      title: hotSpotBase.title
    })
  }, [setFlowOverlayActive, setHotspotData, hotSpotBase])

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
      onClick={onClick}
    />
  )
}
